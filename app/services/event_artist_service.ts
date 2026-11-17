
import { DateTime } from 'luxon'

import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

import Event from '#models/event'
import Artist from '#models/artist'
import EventArtist from '#models/event_artist'
import ArtistUserRole from '#models/artist_user_role'

interface AttachArtistData {
  performanceName?: string | null
  performanceStartsAt?: string | null
  performanceEndsAt?: string | null
}

interface UpdateArtistPerformanceData {
  performanceName?: string | null
  performanceStartsAt?: string | null
  performanceEndsAt?: string | null
}

type AttachArtistResult =
  | { status: 'success'; eventArtist: EventArtist }
  | { status: 'event_not_found' }
  | { status: 'artist_not_found' }
  | { status: 'forbidden' }
  | { status: 'already_associated' }
  | { status: 'invalid_date' }
  | { status: 'invalid_period' }

type ListEventArtistsResult =
  | { status: 'success'; eventArtists: EventArtist[] }
  | { status: 'not_found' }

type UpdateArtistPerformanceResult =
  | { status: 'success'; eventArtist: EventArtist }
  | { status: 'not_found' }
  | { status: 'forbidden' }
  | { status: 'invalid_date' }
  | { status: 'invalid_period' }

type DetachArtistResult =
  | { status: 'success' }
  | { status: 'not_found' }
  | { status: 'forbidden' }

export default class EventArtistService {
  /**
   * Converte uma data ISO válida para UTC.
   */
  private parseDate(value: string): DateTime | null {
    const date = DateTime.fromISO(value, { setZone: true })

    if (!date.isValid) {
      return null
    }

    return date.toUTC()
  }

  /**
   * Valida o período da apresentação.
   */
  private isValidPeriod(
    startsAt: DateTime | null,
    endsAt: DateTime | null
  ): boolean {
    if (!startsAt || !endsAt) {
      return true
    }

    return endsAt.toMillis() > startsAt.toMillis()
  }

  /**
   * Identifica violação de chave única do MySQL.
   */
  private isDuplicateKeyError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
      return false
    }

    const databaseError = error as {
      code?: string
      errno?: number
    }

    return (
      databaseError.code === 'ER_DUP_ENTRY' ||
      databaseError.errno === 1062
    )
  }

  /**
   * Verifica os papéis globais do usuário.
   */
  private async hasGlobalRole(
    userId: number | bigint,
    roles: string[],
    trx: TransactionClientContract
  ): Promise<boolean> {
    const permission = await trx
      .from('user_roles')
      .innerJoin('roles', 'roles.id', 'user_roles.role_id')
      .where('user_roles.user_id', String(userId))
      .whereIn('roles.name', roles)
      .first()

    return Boolean(permission)
  }

  /**
   * Verifica se o usuário administra determinado artista.
   */
  private async hasArtistPermission(
    artistId: number | bigint,
    userId: number | bigint,
    trx: TransactionClientContract
  ): Promise<boolean> {
    const permission = await ArtistUserRole.query({ client: trx })
      .where('artistId', String(artistId))
      .where('userId', String(userId))
      .whereIn('role', ['owner', 'admin', 'editor'])
      .first()

    return Boolean(permission)
  }

  /**
   * Verifica se o usuário pode administrar o evento.
   *
   * Permissões:
   * - Criador do evento.
   * - Administrador global.
   * - Owner, admin ou editor de artista associado ao evento.
   */
  private async canManageEvent(
    event: Event,
    userId: number | bigint,
    trx: TransactionClientContract
  ): Promise<boolean> {
    if (String(event.createdByUserId) === String(userId)) {
      return true
    }

    const isAdmin = await this.hasGlobalRole(
      userId,
      ['admin'],
      trx
    )

    if (isAdmin) {
      return true
    }

    const permission = await trx
      .from('event_artists')
      .innerJoin(
        'artist_user_roles',
        'artist_user_roles.artist_id',
        'event_artists.artist_id'
      )
      .where('event_artists.event_id', String(event.id))
      .where('artist_user_roles.user_id', String(userId))
      .whereIn('artist_user_roles.role', ['owner', 'admin', 'editor'])
      .first()

    return Boolean(permission)
  }

  /**
   * Verifica se o usuário pode associar um artista ao evento.
   *
   * Permite:
   * - Quem administra o evento.
   * - Quem administra o artista.
   */
  private async canManageAssociation(
    event: Event,
    artistId: number | bigint,
    userId: number | bigint,
    trx: TransactionClientContract
  ): Promise<boolean> {
    const eventPermission = await this.canManageEvent(
      event,
      userId,
      trx
    )

    if (eventPermission) {
      return true
    }

    return this.hasArtistPermission(
      artistId,
      userId,
      trx
    )
  }

  /**
   * Associa um artista a um evento.
   */
  async attach(
    eventId: string,
    artistId: number,
    userId: number | bigint,
    data: AttachArtistData = {}
  ): Promise<AttachArtistResult> {
    let performanceStartsAt: DateTime | null = null
    let performanceEndsAt: DateTime | null = null

    if (data.performanceStartsAt) {
      performanceStartsAt = this.parseDate(
        data.performanceStartsAt
      )

      if (!performanceStartsAt) {
        return { status: 'invalid_date' }
      }
    }

    if (data.performanceEndsAt) {
      performanceEndsAt = this.parseDate(
        data.performanceEndsAt
      )

      if (!performanceEndsAt) {
        return { status: 'invalid_date' }
      }
    }

    if (!this.isValidPeriod(
      performanceStartsAt,
      performanceEndsAt
    )) {
      return { status: 'invalid_period' }
    }

    try {
      const result = await db.transaction(async (trx) => {
        const event = await Event.query({ client: trx })
          .where('id', eventId)
          .forUpdate()
          .first()

        if (!event) {
          return { status: 'event_not_found' } as const
        }

        const artist = await Artist.query({ client: trx })
          .where('id', artistId)
          .forUpdate()
          .first()

        if (!artist) {
          return { status: 'artist_not_found' } as const
        }

        const authorized = await this.canManageAssociation(
          event,
          artist.id,
          userId,
          trx
        )

        if (!authorized) {
          return { status: 'forbidden' } as const
        }

        const existingAssociation = await EventArtist.query({
          client: trx,
        })
          .where('eventId', String(event.id))
          .where('artistId', String(artist.id))
          .first()

        if (existingAssociation) {
          return { status: 'already_associated' } as const
        }

        const eventArtist = await EventArtist.create(
          {
            eventId: event.id,
            artistId: artist.id,
            performanceName: data.performanceName ?? null,
            performanceStartsAt,
            performanceEndsAt,
          },
          { client: trx }
        )

        return {
          status: 'success' as const,
          eventArtist,
        }
      })

      if (result.status !== 'success') {
        return result
      }

      await result.eventArtist.load('event')
      await result.eventArtist.load('artist')

      return result
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        return { status: 'already_associated' }
      }

      throw error
    }
  }

  /**
   * Lista os artistas associados a um evento.
   *
   * Eventos privados só podem ser consultados
   * por usuários autorizados.
   */
  async listByEvent(
    eventId: string,
    userId?: number | bigint
  ): Promise<ListEventArtistsResult> {
    const event = await Event.find(eventId)

    if (!event) {
      return { status: 'not_found' }
    }

    if (!event.isPublic) {
      if (userId === undefined) {
        return { status: 'not_found' }
      }

      const authorized = await db.transaction(async (trx) => {
        const lockedEvent = await Event.query({ client: trx })
          .where('id', eventId)
          .forUpdate()
          .first()

        if (!lockedEvent) {
          return false
        }

        if (lockedEvent.isPublic) {
          return true
        }

        return this.canManageEvent(
          lockedEvent,
          userId,
          trx
        )
      })

      if (!authorized) {
        return { status: 'not_found' }
      }
    }

    const eventArtists = await EventArtist.query()
      .where('eventId', eventId)
      .preload('artist')
      .orderBy('performanceStartsAt', 'asc')
      .orderBy('id', 'asc')

    return {
      status: 'success',
      eventArtists,
    }
  }

  /**
   * Atualiza as informações da apresentação.
   */
  async update(
    eventArtistId: string,
    userId: number | bigint,
    data: UpdateArtistPerformanceData
  ): Promise<UpdateArtistPerformanceResult> {
    const result = await db.transaction(async (trx) => {
      const eventArtist = await EventArtist.query({ client: trx })
        .where('id', eventArtistId)
        .forUpdate()
        .first()

      if (!eventArtist) {
        return { status: 'not_found' } as const
      }

      const event = await Event.query({ client: trx })
        .where('id', String(eventArtist.eventId))
        .forUpdate()
        .first()

      if (!event) {
        return { status: 'not_found' } as const
      }

      const authorized = await this.canManageAssociation(
        event,
        eventArtist.artistId,
        userId,
        trx
      )

      if (!authorized) {
        return { status: 'forbidden' } as const
      }

      eventArtist.useTransaction(trx)

      let startsAt = eventArtist.performanceStartsAt
      let endsAt = eventArtist.performanceEndsAt

      if (data.performanceStartsAt !== undefined) {
        if (data.performanceStartsAt === null) {
          startsAt = null
        } else {
          const parsed = this.parseDate(
            data.performanceStartsAt
          )

          if (!parsed) {
            return { status: 'invalid_date' } as const
          }

          startsAt = parsed
        }
      }

      if (data.performanceEndsAt !== undefined) {
        if (data.performanceEndsAt === null) {
          endsAt = null
        } else {
          const parsed = this.parseDate(
            data.performanceEndsAt
          )

          if (!parsed) {
            return { status: 'invalid_date' } as const
          }

          endsAt = parsed
        }
      }

      if (!this.isValidPeriod(startsAt, endsAt)) {
        return { status: 'invalid_period' } as const
      }

      if (data.performanceName !== undefined) {
        eventArtist.performanceName = data.performanceName
      }

      if (data.performanceStartsAt !== undefined) {
        eventArtist.performanceStartsAt = startsAt
      }

      if (data.performanceEndsAt !== undefined) {
        eventArtist.performanceEndsAt = endsAt
      }

      await eventArtist.save()

      return {
        status: 'success' as const,
        eventArtist,
      }
    })

    if (result.status !== 'success') {
      return result
    }

    await result.eventArtist.load('event')
    await result.eventArtist.load('artist')

    return result
  }

  /**
   * Remove um artista da programação do evento.
   */
  async detach(
    eventArtistId: string,
    userId: number | bigint
  ): Promise<DetachArtistResult> {
    return db.transaction(async (trx) => {
      const eventArtist = await EventArtist.query({ client: trx })
        .where('id', eventArtistId)
        .forUpdate()
        .first()

      if (!eventArtist) {
        return { status: 'not_found' } as const
      }

      const event = await Event.query({ client: trx })
        .where('id', String(eventArtist.eventId))
        .forUpdate()
        .first()

      if (!event) {
        return { status: 'not_found' } as const
      }

      const authorized = await this.canManageAssociation(
        event,
        eventArtist.artistId,
        userId,
        trx
      )

      if (!authorized) {
        return { status: 'forbidden' } as const
      }

      eventArtist.useTransaction(trx)

      await eventArtist.delete()

      return { status: 'success' } as const
    })
  }
}

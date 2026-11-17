
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

import Event from '#models/event'
import Venue from '#models/venue'
import ArtistUserRole from '#models/artist_user_role'

type EventType = 'show' | 'festival' | 'concert' | 'other'
type EventStatus = 'scheduled' | 'cancelled' | 'finished'

interface CreateEventData {
  title: string
  description?: string | null
  type?: EventType
  startsAt: string
  endsAt?: string | null
  coverUrl?: string | null
  venueId?: number | null
  address?: string | null
  number?: string | null
  complement?: string | null
  neighborhood?: string | null
  city: string
  state: string
  postalCode?: string | null
  country?: string
  latitude?: number | null
  longitude?: number | null
  isPublic?: boolean
}

interface UpdateEventData {
  title?: string
  description?: string | null
  type?: EventType
  startsAt?: string
  endsAt?: string | null
  coverUrl?: string | null
  venueId?: number | null
  address?: string | null
  number?: string | null
  complement?: string | null
  neighborhood?: string | null
  city?: string
  state?: string
  postalCode?: string | null
  country?: string
  latitude?: number | null
  longitude?: number | null
  isPublic?: boolean
  status?: EventStatus
}

type CreateEventResult =
  | { status: 'success'; event: Event }
  | { status: 'forbidden' }
  | { status: 'invalid_date' }
  | { status: 'invalid_period' }
  | { status: 'venue_not_found' }
  | { status: 'venue_inactive' }

type UpdateEventResult =
  | { status: 'success'; event: Event }
  | { status: 'not_found' }
  | { status: 'forbidden' }
  | { status: 'invalid_date' }
  | { status: 'invalid_period' }
  | { status: 'venue_not_found' }
  | { status: 'venue_inactive' }

type FindEventResult =
  | { status: 'success'; event: Event }
  | { status: 'not_found' }

type CancelEventResult =
  | { status: 'success'; event: Event }
  | { status: 'not_found' }
  | { status: 'forbidden' }

interface ListEventsFilters {
  page?: number
  limit?: number
  search?: string
  type?: EventType
  status?: EventStatus
  city?: string
  state?: string
  artistId?: number
  venueId?: number
}

export default class EventService {
  /**
   * Converte uma data ISO para UTC.
   */
  private parseDate(value: string): DateTime | null {
    const date = DateTime.fromISO(value, { setZone: true })

    if (!date.isValid) {
      return null
    }

    return date.toUTC()
  }

  /**
   * Converte coordenadas para DECIMAL.
   */
  private toDecimalString(value: number | null): string | null {
    if (value === null) {
      return null
    }

    return value.toFixed(7)
  }

  /**
   * Gera um slug a partir do título.
   */
  private generateSlug(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  /**
   * Gera um slug único.
   * Quando informado, utiliza a mesma transação da operação.
   */
  private async generateUniqueSlug(
    title: string,
    eventId?: number | bigint,
    trx?: TransactionClientContract
  ): Promise<string> {
    const baseSlug = this.generateSlug(title) || 'evento'

    let slug = baseSlug
    let counter = 1

    while (true) {
      const query = trx
        ? Event.query({ client: trx }).where('slug', slug)
        : Event.query().where('slug', slug)

      if (eventId !== undefined) {
        query.whereNot('id', String(eventId))
      }

      const existingEvent = await query.first()

      if (!existingEvent) {
        return slug
      }

      counter++
      slug = `${baseSlug}-${counter}`
    }
  }

  /**
   * Busca um local utilizando bloqueio de linha.
   *
   * O bloqueio impede que uma desativação concorrente
   * aconteça enquanto o evento está sendo associado.
   */
  private async findActiveVenue(
    venueId: number,
    trx: TransactionClientContract
  ): Promise<
    | { status: 'success'; venue: Venue }
    | { status: 'venue_not_found' }
    | { status: 'venue_inactive' }
  > {
    const venue = await Venue.query({ client: trx })
      .where('id', venueId)
      .forUpdate()
      .first()

    if (!venue) {
      return { status: 'venue_not_found' }
    }

    if (!venue.isActive) {
      return { status: 'venue_inactive' }
    }

    return {
      status: 'success',
      venue,
    }
  }

  /**
   * Retorna o snapshot do endereço do local.
   */
  private getVenueAddress(venue: Venue) {
    return {
      address: venue.address,
      number: venue.number,
      complement: venue.complement,
      neighborhood: venue.neighborhood,
      city: venue.city,
      state: venue.state,
      postalCode: venue.postalCode,
      country: venue.country,
      latitude: venue.latitude,
      longitude: venue.longitude,
    }
  }

  /**
   * Verifica papéis globais do usuário.
   */
  private async hasGlobalRole(
    userId: number | bigint,
    roles: string[]
  ): Promise<boolean> {
    const permission = await db
      .from('user_roles')
      .innerJoin('roles', 'roles.id', 'user_roles.role_id')
      .where('user_roles.user_id', String(userId))
      .whereIn('roles.name', roles)
      .first()

    return Boolean(permission)
  }

  /**
   * Verifica se o usuário administra algum artista.
   */
  private async hasArtistPermission(
    userId: number | bigint
  ): Promise<boolean> {
    const permission = await ArtistUserRole.query()
      .where('userId', String(userId))
      .whereIn('role', ['owner', 'admin', 'editor'])
      .first()

    return Boolean(permission)
  }

  /**
   * Verifica se o usuário pode cadastrar eventos.
   */
  private async canCreateEvent(
    userId: number | bigint
  ): Promise<boolean> {
    const hasGlobalPermission = await this.hasGlobalRole(userId, [
      'producer',
      'admin',
    ])

    if (hasGlobalPermission) {
      return true
    }

    return this.hasArtistPermission(userId)
  }

  /**
   * Verifica se o usuário pode administrar o evento.
   */
  private async canManageEvent(
    event: Event,
    userId: number | bigint
  ): Promise<boolean> {
    if (String(event.createdByUserId) === String(userId)) {
      return true
    }

    const isAdmin = await this.hasGlobalRole(userId, ['admin'])

    if (isAdmin) {
      return true
    }

    const permission = await db
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
   * Cadastra um evento.
   */
  async create(
    userId: number | bigint,
    data: CreateEventData
  ): Promise<CreateEventResult> {
    const authorized = await this.canCreateEvent(userId)

    if (!authorized) {
      return { status: 'forbidden' }
    }

    const startsAt = this.parseDate(data.startsAt)

    if (!startsAt) {
      return { status: 'invalid_date' }
    }

    const endsAt = data.endsAt ? this.parseDate(data.endsAt) : null

    if (data.endsAt && !endsAt) {
      return { status: 'invalid_date' }
    }

    if (endsAt && endsAt <= startsAt) {
      return { status: 'invalid_period' }
    }

    const result = await db.transaction(async (trx) => {
      let addressData = {
        address: data.address ?? null,
        number: data.number ?? null,
        complement: data.complement ?? null,
        neighborhood: data.neighborhood ?? null,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode ?? null,
        country: data.country ?? 'Brasil',
        latitude: this.toDecimalString(data.latitude ?? null),
        longitude: this.toDecimalString(data.longitude ?? null),
      }

      let venueId: number | null = null

      if (data.venueId !== undefined && data.venueId !== null) {
        const venueResult = await this.findActiveVenue(data.venueId, trx)

        if (venueResult.status !== 'success') {
          return { status: venueResult.status } as const
        }

        venueId = data.venueId
        addressData = this.getVenueAddress(venueResult.venue)
      }

      const slug = await this.generateUniqueSlug(data.title, undefined, trx)

      const event = await Event.create(
        {
          createdByUserId: userId,
          venueId,
          title: data.title,
          slug,
          description: data.description ?? null,
          type: data.type ?? 'show',
          startsAt,
          endsAt,
          coverUrl: data.coverUrl ?? null,
          ...addressData,
          status: 'scheduled',
          isPublic: data.isPublic ?? true,
        },
        { client: trx }
      )

      return {
        status: 'success' as const,
        event,
      }
    })

    if (result.status !== 'success') {
      return result
    }

    await result.event.load('venue')
    await result.event.load('artists')

    return result
  }

  /**
   * Lista eventos públicos com filtros e paginação.
   */
  async list(filters: ListEventsFilters = {}) {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20

    const query = Event.query()
      .where('isPublic', true)
      .preload('venue')
      .preload('artists')
      .orderBy('startsAt', 'asc')

    if (filters.search) {
      query.where('title', 'like', `%${filters.search}%`)
    }

    if (filters.type) {
      query.where('type', filters.type)
    }

    if (filters.status) {
      query.where('status', filters.status)
    }

    if (filters.city) {
      query.where('city', 'like', `%${filters.city}%`)
    }

    if (filters.state) {
      query.where('state', filters.state)
    }

    if (filters.venueId) {
      query.where('venueId', filters.venueId)
    }

    if (filters.artistId) {
      query.whereIn(
        'id',
        db
          .from('event_artists')
          .select('event_id')
          .where('artist_id', filters.artistId)
      )
    }

    const paginator = await query.paginate(page, limit)

    return {
      events: paginator.all(),
      meta: paginator.getMeta(),
    }
  }

  /**
   * Consulta um evento pelo ID.
   */
  async findById(
    eventId: string,
    userId?: number | bigint
  ): Promise<FindEventResult> {
    const event = await Event.query()
      .where('id', eventId)
      .preload('venue')
      .preload('artists')
      .first()

    if (!event) {
      return { status: 'not_found' }
    }

    if (!event.isPublic) {
      if (userId === undefined) {
        return { status: 'not_found' }
      }

      const authorized = await this.canManageEvent(event, userId)

      if (!authorized) {
        return { status: 'not_found' }
      }
    }

    return {
      status: 'success',
      event,
    }
  }

  /**
   * Atualiza um evento.
   */
  async update(
    eventId: string,
    userId: number | bigint,
    data: UpdateEventData
  ): Promise<UpdateEventResult> {
    if (data.startsAt !== undefined) {
      if (!this.parseDate(data.startsAt)) {
        return { status: 'invalid_date' }
      }
    }

    if (data.endsAt !== undefined && data.endsAt !== null) {
      if (!this.parseDate(data.endsAt)) {
        return { status: 'invalid_date' }
      }
    }

    const result = await db.transaction(async (trx) => {
      const event = await Event.query({ client: trx })
        .where('id', eventId)
        .forUpdate()
        .first()

      if (!event) {
        return { status: 'not_found' } as const
      }

      const authorized = await this.canManageEvent(event, userId)

      if (!authorized) {
        return { status: 'forbidden' } as const
      }

      event.useTransaction(trx)

      let startsAt = event.startsAt
      let endsAt = event.endsAt

      if (data.startsAt !== undefined) {
        const parsedStartsAt = this.parseDate(data.startsAt)

        if (!parsedStartsAt) {
          return { status: 'invalid_date' } as const
        }

        startsAt = parsedStartsAt
      }

      if (data.endsAt !== undefined) {
        if (data.endsAt === null) {
          endsAt = null
        } else {
          const parsedEndsAt = this.parseDate(data.endsAt)

          if (!parsedEndsAt) {
            return { status: 'invalid_date' } as const
          }

          endsAt = parsedEndsAt
        }
      }

      if (endsAt && endsAt <= startsAt) {
        return { status: 'invalid_period' } as const
      }

      if (data.title !== undefined) {
        event.title = data.title
        event.slug = await this.generateUniqueSlug(
          data.title,
          event.id,
          trx
        )
      }

      if (data.description !== undefined) {
        event.description = data.description
      }

      if (data.type !== undefined) {
        event.type = data.type
      }

      if (data.startsAt !== undefined) {
        event.startsAt = startsAt
      }

      if (data.endsAt !== undefined) {
        event.endsAt = endsAt
      }

      if (data.coverUrl !== undefined) {
        event.coverUrl = data.coverUrl
      }

      /**
       * Associação com local:
       *
       * venueId omitido:
       * mantém a associação atual.
       *
       * venueId null:
       * remove a associação, preservando o endereço.
       *
       * venueId informado:
       * bloqueia o local, valida e copia seu snapshot.
       */
      if (data.venueId !== undefined) {
        if (data.venueId === null) {
          event.venueId = null
        } else {
          const venueResult = await this.findActiveVenue(
            data.venueId,
            trx
          )

          if (venueResult.status !== 'success') {
            return { status: venueResult.status } as const
          }

          event.venueId = data.venueId

          const venueAddress = this.getVenueAddress(venueResult.venue)

          event.address = venueAddress.address
          event.number = venueAddress.number
          event.complement = venueAddress.complement
          event.neighborhood = venueAddress.neighborhood
          event.city = venueAddress.city
          event.state = venueAddress.state
          event.postalCode = venueAddress.postalCode
          event.country = venueAddress.country
          event.latitude = venueAddress.latitude
          event.longitude = venueAddress.longitude
        }
      }

      /**
       * Permite editar o endereço próprio.
       * Quando um local é associado, o snapshot do local prevalece.
       */
      const canUpdateAddress =
        data.venueId === null ||
        (data.venueId === undefined && event.venueId === null)

      if (canUpdateAddress) {
        if (data.address !== undefined) {
          event.address = data.address
        }

        if (data.number !== undefined) {
          event.number = data.number
        }

        if (data.complement !== undefined) {
          event.complement = data.complement
        }

        if (data.neighborhood !== undefined) {
          event.neighborhood = data.neighborhood
        }

        if (data.city !== undefined) {
          event.city = data.city
        }

        if (data.state !== undefined) {
          event.state = data.state
        }

        if (data.postalCode !== undefined) {
          event.postalCode = data.postalCode
        }

        if (data.country !== undefined) {
          event.country = data.country
        }

        if (data.latitude !== undefined) {
          event.latitude = this.toDecimalString(data.latitude)
        }

        if (data.longitude !== undefined) {
          event.longitude = this.toDecimalString(data.longitude)
        }
      }

      if (data.isPublic !== undefined) {
        event.isPublic = data.isPublic
      }

      if (data.status !== undefined) {
        event.status = data.status
      }

      await event.save()

      return {
        status: 'success' as const,
        event,
      }
    })

    if (result.status !== 'success') {
      return result
    }

    await result.event.load('venue')
    await result.event.load('artists')

    return result
  }

  /**
   * Cancela um evento sem excluir seu registro.
   */
  async cancel(
    eventId: string,
    userId: number | bigint
  ): Promise<CancelEventResult> {
    const event = await Event.find(eventId)

    if (!event) {
      return { status: 'not_found' }
    }

    const authorized = await this.canManageEvent(event, userId)

    if (!authorized) {
      return { status: 'forbidden' }
    }

    event.status = 'cancelled'

    await event.save()

    await event.load('venue')
    await event.load('artists')

    return {
      status: 'success',
      event,
    }
  }
}

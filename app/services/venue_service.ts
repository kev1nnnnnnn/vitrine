
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

import Venue from '#models/venue'

interface CreateVenueData {
  name: string
  description?: string | null
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
  phone?: string | null
  website?: string | null
}

interface UpdateVenueData {
  name?: string
  description?: string | null
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
  phone?: string | null
  website?: string | null
}

interface ListVenuesFilters {
  page?: number
  limit?: number
  search?: string
  city?: string
  state?: string
}

export class VenueService {
  /**
   * Converte coordenadas numéricas para o formato DECIMAL
   * esperado pelo Lucid.
   */
  private toDecimalString(value: number | null): string | null {
    if (value === null) {
      return null
    }

    return value.toFixed(7)
  }

  /**
   * Gera um slug a partir do nome do local.
   */
  private generateSlug(value: string): string {
    return (
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'local'
    )
  }

  /**
   * Gera um slug único dentro da transação informada.
   *
   * A constraint UNIQUE no banco continua sendo a proteção
   * definitiva contra colisões entre operações simultâneas.
   */
  private async generateUniqueSlug(
    name: string,
    ignoreId: number | bigint | undefined,
    trx: TransactionClientContract
  ): Promise<string> {
    const baseSlug = this.generateSlug(name)

    let slug = baseSlug
    let counter = 1

    while (true) {
      const query = Venue.query({ client: trx }).where('slug', slug)

      if (ignoreId !== undefined) {
        query.whereNot('id', String(ignoreId))
      }

      const existingVenue = await query.first()

      if (!existingVenue) {
        return slug
      }

      counter++
      slug = `${baseSlug}-${counter}`
    }
  }

  /**
   * Verifica se o usuário possui papel global de administrador.
   */
  private async hasGlobalAdminRole(
    userId: number | bigint,
    trx: TransactionClientContract
  ): Promise<boolean> {
    const role = await trx
      .from('user_roles')
      .innerJoin('roles', 'roles.id', 'user_roles.role_id')
      .where('user_roles.user_id', String(userId))
      .where('roles.name', 'admin')
      .first()

    return Boolean(role)
  }

  /**
   * Verifica se o usuário pode administrar o local.
   */
  private async canManageVenue(
    venue: Venue,
    userId: number | bigint,
    trx: TransactionClientContract
  ): Promise<boolean> {
    if (String(venue.createdByUserId) === String(userId)) {
      return true
    }

    return this.hasGlobalAdminRole(userId, trx)
  }

  /**
   * Cadastra um novo local.
   */
  async create(userId: number | bigint, data: CreateVenueData) {
    return db.transaction(async (trx) => {
      const slug = await this.generateUniqueSlug(
        data.name,
        undefined,
        trx
      )

      const venue = await Venue.create(
        {
          createdByUserId: userId,
          name: data.name,
          slug,
          description: data.description ?? null,
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
          phone: data.phone ?? null,
          website: data.website ?? null,
          isActive: true,
          createdAt: DateTime.now(),
          updatedAt: null,
        },
        { client: trx }
      )

      return {
        status: 'success' as const,
        venue,
      }
    })
  }

  /**
   * Lista exclusivamente locais ativos.
   */
  async list(filters: ListVenuesFilters) {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20

    const query = Venue.query().where('isActive', true)

    if (filters.search) {
      query.where((builder) => {
        builder
          .whereILike('name', `%${filters.search}%`)
          .orWhereILike('city', `%${filters.search}%`)
          .orWhereILike('neighborhood', `%${filters.search}%`)
      })
    }

    if (filters.city) {
      query.whereILike('city', `%${filters.city}%`)
    }

    if (filters.state) {
      query.where('state', filters.state.toUpperCase())
    }

    query.orderBy('name', 'asc')

    const paginator = await query.paginate(page, limit)

    return {
      venues: paginator.all(),
      meta: paginator.getMeta(),
    }
  }

  /**
   * Consulta um local ativo pelo ID.
   */
  async findById(id: string | number) {
    const venue = await Venue.query()
      .where('id', id)
      .where('isActive', true)
      .preload('events')
      .first()

    if (!venue) {
      return {
        status: 'not_found' as const,
      }
    }

    return {
      status: 'success' as const,
      venue,
    }
  }

  /**
   * Atualiza os dados cadastrais de um local existente.
   *
   * Utiliza transação e bloqueio de linha.
   * Não permite alterar a situação de ativação do local.
   */
  async update(
    id: string | number,
    userId: number | bigint,
    data: UpdateVenueData
  ) {
    return db.transaction(async (trx) => {
      const venue = await Venue.query({ client: trx })
        .where('id', id)
        .forUpdate()
        .first()

      if (!venue) {
        return {
          status: 'not_found' as const,
        }
      }

      const canManage = await this.canManageVenue(
        venue,
        userId,
        trx
      )

      if (!canManage) {
        return {
          status: 'forbidden' as const,
        }
      }

      if (data.name !== undefined && data.name !== venue.name) {
        venue.slug = await this.generateUniqueSlug(
          data.name,
          venue.id,
          trx
        )

        venue.name = data.name
      }

      if (data.description !== undefined) {
        venue.description = data.description
      }

      if (data.address !== undefined) {
        venue.address = data.address
      }

      if (data.number !== undefined) {
        venue.number = data.number
      }

      if (data.complement !== undefined) {
        venue.complement = data.complement
      }

      if (data.neighborhood !== undefined) {
        venue.neighborhood = data.neighborhood
      }

      if (data.city !== undefined) {
        venue.city = data.city
      }

      if (data.state !== undefined) {
        venue.state = data.state
      }

      if (data.postalCode !== undefined) {
        venue.postalCode = data.postalCode
      }

      if (data.country !== undefined) {
        venue.country = data.country
      }

      if (data.latitude !== undefined) {
        venue.latitude = this.toDecimalString(data.latitude)
      }

      if (data.longitude !== undefined) {
        venue.longitude = this.toDecimalString(data.longitude)
      }

      if (data.phone !== undefined) {
        venue.phone = data.phone
      }

      if (data.website !== undefined) {
        venue.website = data.website
      }

      venue.updatedAt = DateTime.now()

      await venue.save()

      return {
        status: 'success' as const,
        venue,
      }
    })
  }

  /**
   * Desativa um local sem excluir seu registro.
   *
   * O bloqueio impede que uma associação concorrente
   * seja concluída simultaneamente com a desativação.
   */
  async deactivate(id: string | number, userId: number | bigint) {
    return db.transaction(async (trx) => {
      const venue = await Venue.query({ client: trx })
        .where('id', id)
        .forUpdate()
        .first()

      if (!venue) {
        return {
          status: 'not_found' as const,
        }
      }

      const canManage = await this.canManageVenue(
        venue,
        userId,
        trx
      )

      if (!canManage) {
        return {
          status: 'forbidden' as const,
        }
      }

      if (!venue.isActive) {
        return {
          status: 'already_inactive' as const,
          venue,
        }
      }

      venue.useTransaction(trx)
      venue.isActive = false
      venue.updatedAt = DateTime.now()

      await venue.save()

      return {
        status: 'success' as const,
        venue,
      }
    })
  }
}

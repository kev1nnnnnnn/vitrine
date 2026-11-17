
import { DateTime } from 'luxon'

import Notification from '#models/notification'

interface ListNotificationsFilters {
  page?: number
  limit?: number
  unreadOnly?: boolean
}

export default class NotificationService {
  /**
   * Lista as notificações do usuário autenticado.
   */
  async list(userId: number | string, filters: ListNotificationsFilters = {}) {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20

    const query = Notification.query()
      .where('user_id', userId)
      .orderBy('created_at', 'desc')

    if (filters.unreadOnly) {
      query.whereNull('read_at')
    }

    return query.paginate(page, limit)
  }

  /**
   * Busca uma notificação pertencente ao usuário.
   */
  async findById(id: number | string, userId: number | string) {
    return Notification.query()
      .where('id', id)
      .where('user_id', userId)
      .first()
  }

  /**
   * Marca uma notificação como lida.
   */
  async markAsRead(id: number | string, userId: number | string) {
    const notification = await this.findById(id, userId)

    if (!notification) {
      return {
        status: 'not_found' as const,
      }
    }

    if (!notification.readAt) {
      notification.readAt = DateTime.now()
      await notification.save()
    }

    return {
      status: 'success' as const,
      notification,
    }
  }

  /**
   * Marca todas as notificações do usuário como lidas.
   */
  async markAllAsRead(userId: number | string) {
    const result = await Notification.query()
      .where('user_id', userId)
      .whereNull('read_at')
      .update({
        readAt: DateTime.now(),
      })

    return {
      status: 'success' as const,
      updatedCount: result[0],
    }
  }

  /**
   * Conta as notificações não lidas do usuário.
   */
  async countUnread(userId: number | string) {
    const result = await Notification.query()
      .where('user_id', userId)
      .whereNull('read_at')
      .count('* as total')

    return Number(result[0].$extras.total)
  }

  /**
   * Exclui uma notificação pertencente ao usuário.
   */
  async delete(id: number | string, userId: number | string) {
    const notification = await this.findById(id, userId)

    if (!notification) {
      return {
        status: 'not_found' as const,
      }
    }

    await notification.delete()

    return {
      status: 'success' as const,
    }
  }
}

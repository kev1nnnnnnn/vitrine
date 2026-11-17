
import type { HttpContext } from '@adonisjs/core/http'

import NotificationService from '#services/notification_service'
import {
  listNotificationsValidator,
  showNotificationValidator,
} from '#validators/notification'

export default class NotificationsController {
  private notificationService = new NotificationService()

  async index({ auth, request, response }: HttpContext) {
    const filters = await request.validateUsing(listNotificationsValidator)

    const userId = String(auth.user!.id)

    const notifications = await this.notificationService.list(
      userId,
      filters
    )

    return response.ok(notifications.toJSON())
  }

  async show({ params, auth, response }: HttpContext) {
    const { id } = await showNotificationValidator.validate({
      id: params.id,
    })

    const userId = String(auth.user!.id)

    const notification = await this.notificationService.findById(
      id,
      userId
    )

    if (!notification) {
      return response.notFound({
        message: 'Notificação não encontrada.',
      })
    }

    return response.ok({
      data: notification,
    })
  }

  async markAsRead({ params, auth, response }: HttpContext) {
    const { id } = await showNotificationValidator.validate({
      id: params.id,
    })

    const userId = String(auth.user!.id)

    const result = await this.notificationService.markAsRead(
      id,
      userId
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Notificação marcada como lida.',
          data: result.notification,
        })

      case 'not_found':
        return response.notFound({
          message: 'Notificação não encontrada.',
        })
    }
  }

  async markAllAsRead({ auth, response }: HttpContext) {
    const userId = String(auth.user!.id)

    const result = await this.notificationService.markAllAsRead(userId)

    return response.ok({
      message: 'Notificações marcadas como lidas.',
      updatedCount: result.updatedCount,
    })
  }

  async unreadCount({ auth, response }: HttpContext) {
    const userId = String(auth.user!.id)

    const count = await this.notificationService.countUnread(userId)

    return response.ok({
      unreadCount: count,
    })
  }

  async destroy({ params, auth, response }: HttpContext) {
    const { id } = await showNotificationValidator.validate({
      id: params.id,
    })

    const userId = String(auth.user!.id)

    const result = await this.notificationService.delete(id, userId)

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Notificação excluída com sucesso.',
        })

      case 'not_found':
        return response.notFound({
          message: 'Notificação não encontrada.',
        })
    }
  }
}

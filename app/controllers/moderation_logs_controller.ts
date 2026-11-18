
import type { HttpContext } from '@adonisjs/core/http'

import { ModerationLogService } from '#services/moderation_log_service'
import ReportService from '#services/report_service'

export default class ModerationLogsController {
  private moderationLogService = new ModerationLogService()
  private reportService = new ReportService()

  async index({ request, auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Usuário não autenticado.',
      })
    }

    const isAdmin = await this.reportService.isAdmin(user.id)

    if (!isAdmin) {
      return response.forbidden({
        message: 'Você não tem permissão para consultar os registros de moderação.',
      })
    }

    const filters = {
      targetType: request.input('targetType'),
      targetId: request.input('targetId')
        ? Number(request.input('targetId'))
        : undefined,
      action: request.input('action'),
      performedByUserId: request.input('performedByUserId')
        ? Number(request.input('performedByUserId'))
        : undefined,
      page: Number(request.input('page', 1)),
      limit: Number(request.input('limit', 20)),
    }

    const logs = await this.moderationLogService.list(filters)

    return response.ok({
      message: 'Registros de moderação listados com sucesso.',
      data: logs,
    })
  }

  async show({ params, auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Usuário não autenticado.',
      })
    }

    const isAdmin = await this.reportService.isAdmin(user.id)

    if (!isAdmin) {
      return response.forbidden({
        message: 'Você não tem permissão para consultar os registros de moderação.',
      })
    }

    const log = await this.moderationLogService.findById(
      Number(params.id)
    )

    if (!log) {
      return response.notFound({
        message: 'Registro de moderação não encontrado.',
      })
    }

    return response.ok({
      message: 'Registro de moderação encontrado com sucesso.',
      data: log,
    })
  }
}

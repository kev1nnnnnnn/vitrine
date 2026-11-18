
import type { HttpContext } from '@adonisjs/core/http'

import ReportService from '#services/report_service'

import {
  createReportValidator,
  updateReportStatusValidator,
} from '#validators/report'

export default class ReportsController {
  private reportService = new ReportService()

  /**
   * Lista denúncias.
   * Acesso exclusivo para administradores.
   */
  async index({ request, auth, response }: HttpContext) {
    const isAdmin = await this.reportService.isAdmin(auth.user!.id)

    if (!isAdmin) {
      return response.forbidden({
        message: 'Você não tem permissão para consultar denúncias.',
      })
    }

    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const reports = await this.reportService.list(page, limit)

    return response.ok({
      data: reports.all(),
      meta: reports.getMeta(),
    })
  }

  /**
   * Consulta uma denúncia.
   * Acesso exclusivo para administradores.
   */
  async show({ params, auth, response }: HttpContext) {
    const isAdmin = await this.reportService.isAdmin(auth.user!.id)

    if (!isAdmin) {
      return response.forbidden({
        message: 'Você não tem permissão para consultar denúncias.',
      })
    }

    const report = await this.reportService.findById(Number(params.id))

    if (!report) {
      return response.notFound({
        message: 'Denúncia não encontrada.',
      })
    }

    return response.ok({
      data: report,
    })
  }

  /**
   * Registra uma denúncia.
   * Disponível para qualquer usuário autenticado.
   */
  async store({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(createReportValidator)
    const userId = String(auth.user!.id)

    const result = await this.reportService.create(userId, data)

    switch (result.status) {
      case 'success':
        return response.created({
          message: 'Denúncia registrada com sucesso.',
          data: result.report,
        })

      case 'target_not_found':
        return response.notFound({
          message: 'O conteúdo denunciado não foi encontrado.',
        })

      case 'already_reported':
        return response.conflict({
          message: 'Você já possui uma denúncia pendente para este conteúdo.',
        })
    }
  }

  /**
   * Atualiza o status de uma denúncia.
   * Acesso exclusivo para administradores.
   */
  async updateStatus({ params, request, auth, response }: HttpContext) {
    const isAdmin = await this.reportService.isAdmin(auth.user!.id)

    if (!isAdmin) {
      return response.forbidden({
        message: 'Você não tem permissão para atualizar denúncias.',
      })
    }

    const data = await request.validateUsing(updateReportStatusValidator)

    const result = await this.reportService.updateStatus(
      Number(params.id),
      auth.user!.id,
      data
    )

    if (result.status === 'not_found') {
      return response.notFound({
        message: 'Denúncia não encontrada.',
      })
    }

    return response.ok({
      message: 'Status da denúncia atualizado com sucesso.',
      data: result.report,
    })
  }
}

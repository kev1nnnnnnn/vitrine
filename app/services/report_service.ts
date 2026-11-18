
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import Report from '#models/report'
import Artist from '#models/artist'
import Event from '#models/event'
import Post from '#models/post'
import ModerationLog from '#models/moderation_log'

interface CreateReportData {
  targetType: 'artist' | 'event' | 'post'
  targetId: number
  reason: string
  description?: string | null
}

interface UpdateReportData {
  status: 'reviewed' | 'resolved' | 'rejected'
}

type UserId = number | string | bigint

export default class ReportService {
  /**
   * Verifica se o usuário possui um papel global.
   */
  private async hasGlobalRole(
    userId: UserId,
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
   * Verifica se o usuário é administrador.
   */
  async isAdmin(userId: UserId): Promise<boolean> {
    return this.hasGlobalRole(userId, ['admin'])
  }

  /**
   * Registra uma denúncia.
   */
  async create(userId: UserId, data: CreateReportData) {
    let targetExists = false

    switch (data.targetType) {
      case 'artist':
        targetExists = Boolean(
          await Artist.query()
            .where('id', data.targetId)
            .first()
        )
        break

      case 'event':
        targetExists = Boolean(
          await Event.query()
            .where('id', data.targetId)
            .first()
        )
        break

      case 'post':
        targetExists = Boolean(
          await Post.query()
            .where('id', data.targetId)
            .first()
        )
        break
    }

    if (!targetExists) {
      return { status: 'target_not_found' as const }
    }

    const existingReport = await Report.query()
      .where('reported_by_user_id', String(userId))
      .where('target_type', data.targetType)
      .where('target_id', data.targetId)
      .whereIn('status', ['pending'])
      .first()

    if (existingReport) {
      return { status: 'already_reported' as const }
    }

    const report = await Report.create({
      reportedByUserId: Number(userId),
      targetType: data.targetType,
      targetId: data.targetId,
      reason: data.reason,
      description: data.description ?? null,
      status: 'pending',
    })

    return {
      status: 'success' as const,
      report,
    }
  }

  /**
   * Lista denúncias.
   */
  async list(page = 1, limit = 20) {
    return Report.query()
      .preload('reportedByUser')
      .preload('reviewedByUser')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)
  }

  /**
   * Consulta denúncia pelo ID.
   */
  async findById(id: number) {
    return Report.query()
      .where('id', id)
      .preload('reportedByUser')
      .preload('reviewedByUser')
      .first()
  }

  /**
   * Atualiza o status de uma denúncia e registra a ação de moderação.
   */
  async updateStatus(
    id: number,
    userId: UserId,
    data: UpdateReportData
  ) {
    return db.transaction(async (trx) => {
      const report = await Report.query({ client: trx })
        .where('id', id)
        .first()

      if (!report) {
        return { status: 'not_found' as const }
      }

      const previousStatus = report.status

      const action =
        data.status === 'rejected'
          ? 'reject'
          : 'other'

      const now = DateTime.now()

      report.useTransaction(trx)
      report.status = data.status
      report.reviewedByUserId = Number(userId)
      report.reviewedAt = now

      await report.save()

      const moderationLog = await ModerationLog.create(
        {
          performedByUserId: Number(userId),
          targetType: 'report',
          targetId: Number(report.id),
          action,
          reason: null,
          metadata: JSON.stringify({
            previousStatus,
            newStatus: data.status,
          }),
          createdAt: now,
        },
        { client: trx }
      )

      return {
        status: 'success' as const,
        report,
        moderationLog,
      }
    })
  }
}

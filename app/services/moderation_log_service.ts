
import { DateTime } from 'luxon'

import ModerationLog from '#models/moderation_log'

interface CreateModerationLogData {
  performedByUserId: number
  targetType: 'artist' | 'event' | 'post' | 'report' | 'user'
  targetId: number
  action:
    | 'approve'
    | 'hide'
    | 'block'
    | 'restore'
    | 'reject'
    | 'delete'
    | 'warn'
    | 'other'
  reason?: string | null
  metadata?: string | null
}

interface ListModerationLogsFilters {
  targetType?: 'artist' | 'event' | 'post' | 'report' | 'user'
  targetId?: number
  action?:
    | 'approve'
    | 'hide'
    | 'block'
    | 'restore'
    | 'reject'
    | 'delete'
    | 'warn'
    | 'other'
  performedByUserId?: number
  page?: number
  limit?: number
}

export class ModerationLogService {
  async create(data: CreateModerationLogData) {
    return ModerationLog.create({
      performedByUserId: data.performedByUserId,
      targetType: data.targetType,
      targetId: data.targetId,
      action: data.action,
      reason: data.reason ?? null,
      metadata: data.metadata ?? null,
      createdAt: DateTime.now(),
    })
  }

  async list(filters: ListModerationLogsFilters = {}) {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20

    const query = ModerationLog.query()
      .preload('performedByUser')
      .orderBy('created_at', 'desc')

    if (filters.targetType) {
      query.where('target_type', filters.targetType)
    }

    if (filters.targetId !== undefined) {
      query.where('target_id', filters.targetId)
    }

    if (filters.action) {
      query.where('action', filters.action)
    }

    if (filters.performedByUserId !== undefined) {
      query.where('performed_by_user_id', filters.performedByUserId)
    }

    return query.paginate(page, limit)
  }

  async findById(id: number) {
    return ModerationLog.query()
      .where('id', id)
      .preload('performedByUser')
      .first()
  }
}

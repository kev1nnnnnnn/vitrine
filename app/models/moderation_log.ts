import { ModerationLogSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#models/user'

export default class ModerationLog extends ModerationLogSchema {
  @belongsTo(() => User, {
    foreignKey: 'performedByUserId',
  })
  declare performedByUser: BelongsTo<typeof User>
}
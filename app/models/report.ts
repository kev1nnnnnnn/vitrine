import { ReportSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#models/user'

export default class Report extends ReportSchema {
  @belongsTo(() => User, {
    foreignKey: 'reportedByUserId',
  })
  declare reportedByUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'reviewedByUserId',
  })
  declare reviewedByUser: BelongsTo<typeof User>
}
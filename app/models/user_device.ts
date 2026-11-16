import { UserDeviceSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#models/user'

export default class UserDevice extends UserDeviceSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
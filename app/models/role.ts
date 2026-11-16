
import { RoleSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Role extends RoleSchema {
  @manyToMany(() => User, {
    pivotTable: 'user_roles',
    pivotForeignKey: 'role_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: true,
  })
  declare users: ManyToMany<typeof User>
}

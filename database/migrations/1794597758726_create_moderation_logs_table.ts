
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'moderation_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()

      table
        .bigInteger('performed_by_user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')

      table
        .enum('target_type', ['artist', 'event', 'post', 'report', 'user'])
        .notNullable()

      table.bigInteger('target_id').unsigned().notNullable()

      table
        .enum('action', [
          'approve',
          'hide',
          'block',
          'restore',
          'reject',
          'delete',
          'warn',
          'other',
        ])
        .notNullable()

      table.text('reason').nullable()
      table.json('metadata').nullable()

      table.timestamp('created_at').notNullable()

      table.index(['target_type', 'target_id'])
      table.index(['performed_by_user_id', 'created_at'])
      table.index(['action'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

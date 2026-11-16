
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()

      table
        .bigInteger('reported_by_user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')

      table
        .enum('target_type', ['artist', 'event', 'post'])
        .notNullable()

      table.bigInteger('target_id').unsigned().notNullable()

      table.string('reason', 100).notNullable()
      table.text('description').nullable()

      table
        .enum('status', ['pending', 'reviewed', 'resolved', 'rejected'])
        .notNullable()
        .defaultTo('pending')

      table
        .bigInteger('reviewed_by_user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      table.timestamp('reviewed_at').nullable()

       
table
  .timestamp('created_at')
  .notNullable()
  .defaultTo(this.now())

  
      table.timestamp('updated_at').nullable()

      table.index(['target_type', 'target_id'])
      table.index(['status', 'created_at'])
      table.index(['reported_by_user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

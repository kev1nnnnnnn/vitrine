
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()

      table
        .bigInteger('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('type', 80).notNullable()
      table.string('title', 180).notNullable()
      table.text('message').nullable()

      table.json('data').nullable()

      table.timestamp('read_at').nullable()

        
table
  .timestamp('created_at')
  .notNullable()
  .defaultTo(this.now())

  
      table.timestamp('updated_at').nullable()

      table.index(['user_id', 'read_at', 'created_at'])
      table.index(['type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

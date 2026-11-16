
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_devices'

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

      table.string('device_token', 512).notNullable().unique()

      table
        .enum('platform', ['android', 'ios', 'web'])
        .notNullable()

      table.string('device_name', 150).nullable()
      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('last_used_at').nullable()

        
table
  .timestamp('created_at')
  .notNullable()
  .defaultTo(this.now())

  
      table.timestamp('updated_at').nullable()

      table.index(['user_id', 'is_active'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

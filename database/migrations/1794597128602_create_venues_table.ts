
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'venues'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()

      table.string('name', 180).notNullable()
      table.string('slug', 200).notNullable().unique()

      table.string('description', 255).nullable()
      table.string('address', 255).nullable()
      table.string('number', 30).nullable()
      table.string('complement', 150).nullable()
      table.string('neighborhood', 120).nullable()
      table.string('city', 100).notNullable()
      table.string('state', 2).notNullable()
      table.string('postal_code', 15).nullable()
      table.string('country', 100).notNullable().defaultTo('Brasil')

      table.decimal('latitude', 10, 7).nullable()
      table.decimal('longitude', 10, 7).nullable()

      table.string('phone', 30).nullable()
      table.string('website', 2048).nullable()

      table
        .bigInteger('created_by_user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['city', 'state'])
      table.index(['is_active'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}


import { BaseSchema } from '@adonisjs/lucid/schema'


export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()

      table
        .bigInteger('created_by_user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')

      table
        .bigInteger('venue_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('venues')
        .onDelete('SET NULL')

      table.string('title', 180).notNullable()
      table.string('slug', 200).notNullable().unique()
      table.text('description').nullable()

      table
        .enum('type', ['show', 'festival', 'concert', 'other'])
        .notNullable()
        .defaultTo('show')

      table.timestamp('starts_at').notNullable()
      table.timestamp('ends_at').nullable()

      table.string('cover_url', 2048).nullable()

      // Endereço próprio do evento (snapshot)
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

      table
        .enum('status', ['scheduled', 'cancelled', 'finished'])
        .notNullable()
        .defaultTo('scheduled')

      table.boolean('is_public').notNullable().defaultTo(true)

  
table
  .timestamp('created_at')
  .notNullable()
  .defaultTo(this.now())


      table.timestamp('updated_at').nullable()

      table.index(['starts_at', 'status'])
      table.index(['city', 'state'])
      table.index(['venue_id'])
      table.index(['created_by_user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

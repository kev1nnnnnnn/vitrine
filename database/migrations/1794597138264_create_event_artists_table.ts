
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'event_artists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()

      table
        .bigInteger('event_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('events')
        .onDelete('CASCADE')

      table
        .bigInteger('artist_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('artists')
        .onDelete('CASCADE')

      table.string('performance_name', 180).nullable()
      table.timestamp('performance_starts_at').nullable()
      table.timestamp('performance_ends_at').nullable()

      table.unique(['event_id', 'artist_id'])

       
table
  .timestamp('created_at')
  .notNullable()
  .defaultTo(this.now())

  
      table.timestamp('updated_at').nullable()

      table.index(['artist_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

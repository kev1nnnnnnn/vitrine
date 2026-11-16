
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'artist_genres'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()

      table
        .bigInteger('artist_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('artists')
        .onDelete('CASCADE')

      table
        .bigInteger('genre_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('genres')
        .onDelete('CASCADE')

      table.unique(['artist_id', 'genre_id'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['genre_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

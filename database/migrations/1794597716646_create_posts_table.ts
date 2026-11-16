
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

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
        .bigInteger('created_by_user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')

      table.text('content').nullable()

      table
        .enum('status', ['draft', 'published', 'hidden'])
        .notNullable()
        .defaultTo('published')

      table.timestamp('published_at').nullable()

        
table
  .timestamp('created_at')
  .notNullable()
  .defaultTo(this.now())

  
      table.timestamp('updated_at').nullable()

      table.index(['artist_id', 'status', 'published_at'])
      table.index(['created_by_user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

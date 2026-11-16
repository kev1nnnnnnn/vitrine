
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'artists'

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

      table.string('name', 150).notNullable()
      table.string('slug', 180).notNullable().unique()

      table
        .enum('type', ['band', 'solo', 'duo', 'group'])
        .notNullable()

      table.text('bio').nullable()
      table.string('city', 100).nullable()
      table.string('state', 2).nullable()
      table.string('country', 100).nullable()

      table.string('avatar_url', 2048).nullable()
      table.string('cover_url', 2048).nullable()

      table
        .enum('status', ['active', 'hidden', 'blocked'])
        .notNullable()
        .defaultTo('active')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['type'])
      table.index(['status'])
      table.index(['city', 'state'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

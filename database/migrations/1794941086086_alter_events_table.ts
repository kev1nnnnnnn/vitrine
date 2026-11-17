
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .timestamp('starts_at')
        .notNullable()
        .defaultTo(this.now())
        .alter()
    })
  }

  async down() {
    // Mantém a configuração corrigida para evitar
    // a reintrodução do ON UPDATE automático no MySQL.
    this.schema.alterTable(this.tableName, (table) => {
      table
        .timestamp('starts_at')
        .notNullable()
        .defaultTo(this.now())
        .alter()
    })
  }
}

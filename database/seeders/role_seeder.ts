
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class RolesSeeder extends BaseSeeder {
  async run() {
    await db
      .table('roles')
      .insert([
        {
          name: 'user',
          description: 'Usuário padrão da plataforma',
        },
        {
          name: 'producer',
          description: 'Produtor responsável pela criação e gerenciamento de eventos',
        },
        {
          name: 'admin',
          description: 'Administrador geral da plataforma',
        },
      ])
      .onConflict()
      .merge(['description'])
  }
}

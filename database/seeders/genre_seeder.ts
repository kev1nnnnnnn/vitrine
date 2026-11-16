
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class GenresSeeder extends BaseSeeder {
  async run() {
    await db
      .table('genres')
      .insert([
        { name: 'Rock', slug: 'rock', description: 'Rock em suas diferentes vertentes' },
        { name: 'Pop', slug: 'pop', description: 'Música pop nacional e internacional' },
        { name: 'Gospel', slug: 'gospel', description: 'Música cristã e gospel' },
        { name: 'Sertanejo', slug: 'sertanejo', description: 'Sertanejo tradicional e universitário' },
        { name: 'Forró', slug: 'forro', description: 'Forró e suas vertentes' },
        { name: 'Reggae', slug: 'reggae', description: 'Reggae e suas vertentes' },
        { name: 'Metal', slug: 'metal', description: 'Heavy metal e subgêneros' },
        { name: 'MPB', slug: 'mpb', description: 'Música popular brasileira' },
        { name: 'Eletrônica', slug: 'eletronica', description: 'Música eletrônica' },
        { name: 'Pagode', slug: 'pagode', description: 'Pagode e samba romântico' },
        { name: 'Samba', slug: 'samba', description: 'Samba tradicional e suas vertentes' },
        { name: 'Funk', slug: 'funk', description: 'Funk brasileiro e internacional' },
        { name: 'Rap', slug: 'rap', description: 'Rap e hip hop' },
        { name: 'Hip Hop', slug: 'hip-hop', description: 'Hip hop e cultura urbana' },
        { name: 'Jazz', slug: 'jazz', description: 'Jazz e suas vertentes' },
        { name: 'Blues', slug: 'blues', description: 'Blues tradicional e contemporâneo' },
        { name: 'Reggaeton', slug: 'reggaeton', description: 'Reggaeton e música urbana latina' },
        { name: 'Axé', slug: 'axe', description: 'Axé music' },
        { name: 'Bossa Nova', slug: 'bossa-nova', description: 'Bossa nova' },
        { name: 'Clássica', slug: 'classica', description: 'Música clássica e erudita' },
        { name: 'Indie', slug: 'indie', description: 'Música independente e alternativa' },
        { name: 'Punk', slug: 'punk', description: 'Punk rock e suas vertentes' },
      ])
      .onConflict()
      .merge(['name', 'description'])
  }
}

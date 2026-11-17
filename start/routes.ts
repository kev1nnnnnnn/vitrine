
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

const ArtistsController = () =>
  import('#controllers/artists_controller')

const ArtistMembersController = () =>
  import('#controllers/artist_members_controller')

const ArtistFollowersController = () =>
  import('#controllers/artist_followers_controller')

const PostsController = () =>
  import('#controllers/posts_controller')

const PostMediasController = () =>
  import('#controllers/post_medias_controller')

const EventsController = () =>
  import('#controllers/events_controller')

const VenuesController = () =>
  import('#controllers/venues_controller')

const EventArtistsController = () =>
  import('#controllers/event_artists_controller')

const GenresController = () =>
  import('#controllers/genres_controller')

const NotificationsController = () =>
  import('#controllers/notifications_controller')

router.get('/', () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    /*
    |--------------------------------------------------------------------------
    | Account
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.put('profile', [controllers.Profile, 'update'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])

        // Artistas que o usuário autenticado segue
        router.get('following', [
          ArtistFollowersController,
          'following',
        ])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Artists
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.get('artists', [ArtistsController, 'index'])
        router.get('artists/:id', [ArtistsController, 'show'])
        router.post('artists', [ArtistsController, 'store'])

        router.put('artists/:id/genres', [
          ArtistsController,
          'syncGenres',
        ])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Artist Members
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.get('artists/:artistId/members', [
          ArtistMembersController,
          'index',
        ])

        router.post('artists/:artistId/members', [
          ArtistMembersController,
          'store',
        ])

        router.put('artists/:artistId/members/:memberId', [
          ArtistMembersController,
          'update',
        ])

        router.delete('artists/:artistId/members/:memberId', [
          ArtistMembersController,
          'destroy',
        ])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Artist Followers
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.post('artists/:artistId/follow', [
          ArtistFollowersController,
          'follow',
        ])

        router.delete('artists/:artistId/follow', [
          ArtistFollowersController,
          'unfollow',
        ])

        router.get('artists/:artistId/followers', [
          ArtistFollowersController,
          'artistFollowers',
        ])

        router.get('artists/:artistId/followers/count', [
          ArtistFollowersController,
          'countFollowers',
        ])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Public Posts
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.get('artists/:artistId/posts', [
          PostsController,
          'index',
        ])

        router.get('posts/:postId', [
          PostsController,
          'show',
        ])
      })

    /*
    |--------------------------------------------------------------------------
    | Manage Posts
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.post('artists/:artistId/posts', [
          PostsController,
          'store',
        ])

        router.put('posts/:postId', [
          PostsController,
          'update',
        ])

        router.delete('posts/:postId', [
          PostsController,
          'destroy',
        ])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Public Post Medias
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.get('posts/:postId/medias', [
          PostMediasController,
          'index',
        ])
      })

    /*
    |--------------------------------------------------------------------------
    | Manage Post Medias
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.post('posts/:postId/medias', [
          PostMediasController,
          'store',
        ])

        router.put('post-medias/:mediaId', [
          PostMediasController,
          'update',
        ])

        router.delete('post-medias/:mediaId', [
          PostMediasController,
          'destroy',
        ])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Public Events
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.get('events', [
          EventsController,
          'index',
        ])

        router.get('events/:id', [
          EventsController,
          'show',
        ])
      })

    /*
    |--------------------------------------------------------------------------
    | Manage Events
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.post('events', [
          EventsController,
          'store',
        ])

        router.put('events/:id', [
          EventsController,
          'update',
        ])

        router.patch('events/:id/cancel', [
          EventsController,
          'cancel',
        ])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Public Venues
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        // Listar locais ativos
        router.get('venues', [
          VenuesController,
          'index',
        ])

        // Consultar local individual
        router.get('venues/:id', [
          VenuesController,
          'show',
        ])
      })

    /*
    |--------------------------------------------------------------------------
    | Manage Venues
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        // Cadastrar local
        router.post('venues', [
          VenuesController,
          'store',
        ])

        // Atualizar local
        router.put('venues/:id', [
          VenuesController,
          'update',
        ])

        // Desativar local sem excluir o registro
        router.delete('venues/:id', [
          VenuesController,
          'destroy',
        ])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Public Event Artists
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        // Listar artistas associados a um evento
        router.get('events/:eventId/artists', [
          EventArtistsController,
          'index',
        ])
      })

    /*
    |--------------------------------------------------------------------------
    | Manage Event Artists
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        // Associar artista a um evento
        router.post('events/:eventId/artists', [
          EventArtistsController,
          'store',
        ])

        // Atualizar dados da apresentação
        router.put('event-artists/:eventArtistId', [
          EventArtistsController,
          'update',
        ])

        // Remover artista do evento
        router.delete('event-artists/:eventArtistId', [
          EventArtistsController,
          'destroy',
        ])
      })
      .use(middleware.auth())

      /*
      |--------------------------------------------------------------------------
      | Public Genres
      |--------------------------------------------------------------------------
      */

      router
        .group(() => {
          // Listar gêneros musicais
          router.get('genres', [GenresController, 'index'])

          // Consultar gênero específico
          router.get('genres/:id', [GenresController, 'show'])
        })

        /*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

router
  .group(() => {
    // Listar notificações
    router.get('notifications', [
      NotificationsController,
      'index',
    ])

    // Contar notificações não lidas
    router.get('notifications/unread-count', [
      NotificationsController,
      'unreadCount',
    ])

    // Consultar notificação específica
    router.get('notifications/:id', [
      NotificationsController,
      'show',
    ])

    // Marcar uma notificação como lida
    router.patch('notifications/:id/read', [
      NotificationsController,
      'markAsRead',
    ])

    // Marcar todas as notificações como lidas
    router.patch('notifications/read-all', [
      NotificationsController,
      'markAllAsRead',
    ])

    // Excluir notificação
    router.delete('notifications/:id', [
      NotificationsController,
      'destroy',
    ])
  })
  .use(middleware.auth())
        
  })
  .prefix('/api/v1')

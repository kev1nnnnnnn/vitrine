
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

const UserDevicesController = () =>
  import('#controllers/user_devices_controller')

const ReportsController = () =>
  import('#controllers/reports_controller')

const ModerationLogsController = () =>
  import('#controllers/moderation_logs_controller')

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

    router.group(() => {
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

    router.group(() => {
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

    router.group(() => {
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

    router.group(() => {
      router.get('venues', [
        VenuesController,
        'index',
      ])

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
        router.post('venues', [
          VenuesController,
          'store',
        ])

        router.put('venues/:id', [
          VenuesController,
          'update',
        ])

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

    router.group(() => {
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
        router.post('events/:eventId/artists', [
          EventArtistsController,
          'store',
        ])

        router.put('event-artists/:eventArtistId', [
          EventArtistsController,
          'update',
        ])

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

    router.group(() => {
      router.get('genres', [
        GenresController,
        'index',
      ])

      router.get('genres/:id', [
        GenresController,
        'show',
      ])
    })

    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.get('notifications', [
          NotificationsController,
          'index',
        ])

        router.get('notifications/unread-count', [
          NotificationsController,
          'unreadCount',
        ])

        router.get('notifications/:id', [
          NotificationsController,
          'show',
        ])

        router.patch('notifications/:id/read', [
          NotificationsController,
          'markAsRead',
        ])

        router.patch('notifications/read-all', [
          NotificationsController,
          'markAllAsRead',
        ])

        router.delete('notifications/:id', [
          NotificationsController,
          'destroy',
        ])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | User Devices
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        router.get('user-devices', [
          UserDevicesController,
          'index',
        ])

        router.get('user-devices/:id', [
          UserDevicesController,
          'show',
        ])

        router.post('user-devices', [
          UserDevicesController,
          'store',
        ])

        router.put('user-devices/:id', [
          UserDevicesController,
          'update',
        ])

        router.delete('user-devices/:id', [
          UserDevicesController,
          'destroy',
        ])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Reports
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        // Registrar denúncia
        router.post('reports', [
          ReportsController,
          'store',
        ])

        // Listar denúncias (admin)
        router.get('reports', [
          ReportsController,
          'index',
        ])

        // Consultar denúncia (admin)
        router.get('reports/:id', [
          ReportsController,
          'show',
        ])

        // Atualizar status da denúncia (admin)
        router.patch('reports/:id/status', [
          ReportsController,
          'updateStatus',
        ])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Moderation Logs
    |--------------------------------------------------------------------------
    */

    router
      .group(() => {
        // Listar registros de moderação (admin)
        router.get('moderation-logs', [
          ModerationLogsController,
          'index',
        ])

        // Consultar registro de moderação (admin)
        router.get('moderation-logs/:id', [
          ModerationLogsController,
          'show',
        ])
      })
      .use(middleware.auth())
  })
  .prefix('/api/v1')

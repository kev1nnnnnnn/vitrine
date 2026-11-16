
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

// Importação direta do ArtistsController
const ArtistsController = () => import('#controllers/artists_controller')

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    // Rotas públicas de autenticação
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    // Rotas autenticadas da conta
    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.put('profile', [controllers.Profile, 'update'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    // Rotas autenticadas de artistas
    router
      .group(() => {
        router.get('artists', [ArtistsController, 'index'])
        router.post('artists', [ArtistsController, 'store'])
      })
      .use(middleware.auth())
    })
    .prefix('/api/v1')

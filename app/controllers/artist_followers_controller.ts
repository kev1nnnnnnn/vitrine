
import type { HttpContext } from '@adonisjs/core/http'

import ArtistFollowerService from '#services/artist_follower_service'

export default class ArtistFollowersController {
  private artistFollowerService = new ArtistFollowerService()

  /**
   * Seguir um artista.
   * POST /api/v1/artists/:artistId/follow
   */
  async follow({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id

    const result = await this.artistFollowerService.follow(
      String(params.artistId),
      userId
    )

    switch (result.status) {
      case 'success':
        return response.created({
          message: 'Você começou a seguir este artista.',
          data: result.follower,
        })

      case 'not_found':
        return response.notFound({
          message: 'Artista não encontrado.',
        })

      case 'already_following':
        return response.conflict({
          message: 'Você já segue este artista.',
        })
    }
  }

  /**
   * Deixar de seguir um artista.
   * DELETE /api/v1/artists/:artistId/follow
   */
  async unfollow({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id

    const result = await this.artistFollowerService.unfollow(
      String(params.artistId),
      userId
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Você deixou de seguir este artista.',
        })

      case 'not_found':
        return response.notFound({
          message: 'Artista não encontrado.',
        })

      case 'not_following':
        return response.notFound({
          message: 'Você não segue este artista.',
        })
    }
  }

  /**
   * Listar seguidores de um artista.
   * GET /api/v1/artists/:artistId/followers
   */
  async artistFollowers({ params, response }: HttpContext) {
    const result = await this.artistFollowerService.getArtistFollowers(
      String(params.artistId)
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          data: result.followers,
          total: result.followers.length,
        })

      case 'not_found':
        return response.notFound({
          message: 'Artista não encontrado.',
        })
    }
  }

  /**
   * Listar artistas seguidos pelo usuário autenticado.
   * GET /api/v1/account/following
   */
  async following({ auth, response }: HttpContext) {
    const userId = auth.user!.id

    const result = await this.artistFollowerService.getUserFollowing(userId)

    return response.ok({
      data: result.following,
      total: result.following.length,
    })
  }

  /**
   * Consultar quantidade de seguidores de um artista.
   * GET /api/v1/artists/:artistId/followers/count
   */
  async countFollowers({ params, response }: HttpContext) {
    const result = await this.artistFollowerService.countFollowers(
      String(params.artistId)
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          artistId: String(params.artistId),
          followersCount: result.count,
        })

      case 'not_found':
        return response.notFound({
          message: 'Artista não encontrado.',
        })
    }
  }
}

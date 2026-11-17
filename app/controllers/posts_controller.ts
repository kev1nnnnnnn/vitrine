
import type { HttpContext } from '@adonisjs/core/http'

import PostService from '#services/post_service'

import {
  createPostValidator,
  updatePostValidator,
  listPostsValidator,
  showPostValidator,
} from '#validators/post'

export default class PostsController {
  private postService = new PostService()

  /**
   * Lista as publicações de um artista.
   * Publicações não publicadas ficam visíveis apenas para usuários autorizados.
   */
  async index({ params, request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(listPostsValidator)

    const result = await this.postService.listByArtist(
      String(params.artistId),
      payload.page ?? 1,
      payload.limit ?? 10,
      auth.user?.id
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          data: result.posts,
          meta: result.meta,
        })

      case 'not_found':
        return response.notFound({
          message: 'Artista não encontrado.',
        })
    }
  }

  /**
   * Exibe uma publicação específica.
   */
  async show({ params, response, auth }: HttpContext) {
    const payload = await showPostValidator.validate({
      id: Number(params.postId),
    })

    const result = await this.postService.findById(
      String(payload.id),
      auth.user?.id
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          data: result.post,
        })

      case 'not_found':
        return response.notFound({
          message: 'Publicação não encontrada.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para visualizar esta publicação.',
        })
    }
  }

  /**
   * Cria uma publicação para um artista.
   */
  async store({ params, request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator)

    const result = await this.postService.create(
      String(params.artistId),
      auth.user!.id,
      payload
    )

    switch (result.status) {
      case 'success':
        return response.created({
          message: 'Publicação criada com sucesso.',
          data: result.post,
        })

      case 'not_found':
        return response.notFound({
          message: 'Artista não encontrado.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para publicar neste artista.',
        })
    }
  }

  /**
   * Atualiza uma publicação existente.
   */
  async update({ params, request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(updatePostValidator)

    const result = await this.postService.update(
      String(params.postId),
      auth.user!.id,
      payload
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Publicação atualizada com sucesso.',
          data: result.post,
        })

      case 'not_found':
        return response.notFound({
          message: 'Publicação não encontrada.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para editar esta publicação.',
        })
    }
  }

  /**
   * Exclui uma publicação.
   */
  async destroy({ params, response, auth }: HttpContext) {
    const result = await this.postService.delete(
      String(params.postId),
      auth.user!.id
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Publicação excluída com sucesso.',
        })

      case 'not_found':
        return response.notFound({
          message: 'Publicação não encontrada.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para excluir esta publicação.',
        })
    }
  }
}


import type { HttpContext } from '@adonisjs/core/http'

import PostMediaService from '#services/post_media_service'

import {
  createPostMediaValidator,
  updatePostMediaValidator,
  listPostMediasValidator,
  showPostMediaValidator,
} from '#validators/post_media'

export default class PostMediasController {
  private postMediaService = new PostMediaService()

  /**
   * Lista as mídias de uma publicação.
   */
  async index({ params, response, auth }: HttpContext) {
    const payload = await listPostMediasValidator.validate({
      postId: Number(params.postId),
    })

    const result = await this.postMediaService.listByPost(
      String(payload.postId),
      auth.user?.id
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          data: result.medias,
          total: result.medias.length,
        })

      case 'not_found':
        return response.notFound({
          message: 'Publicação não encontrada.',
        })
    }
  }

  /**
   * Adiciona uma mídia a uma publicação.
   */
  async store({ params, request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(
      createPostMediaValidator
    )

    const result = await this.postMediaService.create(
      String(params.postId),
      auth.user!.id,
      payload
    )

    switch (result.status) {
      case 'success':
        return response.created({
          message: 'Mídia adicionada com sucesso.',
          data: result.media,
        })

      case 'not_found':
        return response.notFound({
          message: 'Publicação não encontrada.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para adicionar mídias nesta publicação.',
        })
    }
  }

  /**
   * Atualiza uma mídia existente.
   */
  async update({ params, request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(
      updatePostMediaValidator
    )

    const result = await this.postMediaService.update(
      String(params.mediaId),
      auth.user!.id,
      payload
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Mídia atualizada com sucesso.',
          data: result.media,
        })

      case 'not_found':
        return response.notFound({
          message: 'Mídia não encontrada.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para atualizar esta mídia.',
        })
    }
  }

  /**
   * Exclui uma mídia.
   */
  async destroy({ params, response, auth }: HttpContext) {
    const payload = await showPostMediaValidator.validate({
      id: Number(params.mediaId),
    })

    const result = await this.postMediaService.delete(
      String(payload.id),
      auth.user!.id
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Mídia excluída com sucesso.',
        })

      case 'not_found':
        return response.notFound({
          message: 'Mídia não encontrada.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para excluir esta mídia.',
        })
    }
  }
}

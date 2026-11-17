
import type { HttpContext } from '@adonisjs/core/http'

import ArtistMember from '#models/artist_member'
import ArtistMemberService from '#services/artist_member_service'

import {
  createArtistMemberValidator,
  updateArtistMemberValidator,
} from '#validators/artist_member'

export default class ArtistMembersController {
  /**
   * Lista os integrantes de um artista.
   */
  async index({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const artistId = String(params.artistId)

    if (!/^[1-9]\d*$/.test(artistId)) {
      return response.badRequest({
        message: 'ID do artista inválido.',
      })
    }

    const service = new ArtistMemberService()
    const result = await service.index(artistId, user.id)

    if (result.status === 'not_found') {
      return response.notFound({
        message: 'Artista não encontrado.',
      })
    }

    if (result.status === 'forbidden') {
      return response.forbidden({
        message: 'Você não tem permissão para visualizar os integrantes.',
      })
    }

    // Garante que o retorno contém a propriedade members.
    if (!('members' in result)) {
      return response.internalServerError({
        message: 'Não foi possível carregar os integrantes.',
      })
    }

    const members: ArtistMember[] = result.members

    return response.ok({
      data: members.map((member: ArtistMember) => ({
        id: String(member.id),
        artistId: String(member.artistId),
        userId: member.userId !== null
          ? String(member.userId)
          : null,
        name: member.name,
        position: member.position,
        bio: member.bio,
        photoUrl: member.photoUrl,
        sortOrder: member.sortOrder,
        isActive: member.isActive,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      })),
    })
  }

  /**
   * Cadastra um integrante.
   */
  async store({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const artistId = String(params.artistId)

    if (!/^[1-9]\d*$/.test(artistId)) {
      return response.badRequest({
        message: 'ID do artista inválido.',
      })
    }

    const payload = await request.validateUsing(
      createArtistMemberValidator
    )

    const service = new ArtistMemberService()

    const result = await service.create(
      artistId,
      user.id,
      payload
    )

    if (result.status === 'not_found') {
      return response.notFound({
        message: 'Artista não encontrado.',
      })
    }

    if (result.status === 'forbidden') {
      return response.forbidden({
        message: 'Você não tem permissão para adicionar integrantes.',
      })
    }

    if (result.status === 'invalid_user') {
      return response.badRequest({
        message: 'A conta de usuário informada não existe.',
      })
    }

    if (!('member' in result)) {
      return response.internalServerError({
        message: 'Não foi possível cadastrar o integrante.',
      })
    }

    const member = result.member

    return response.created({
      message: 'Integrante cadastrado com sucesso.',
      data: {
        id: String(member.id),
        artistId: String(member.artistId),
        userId: member.userId !== null
          ? String(member.userId)
          : null,
        name: member.name,
        position: member.position,
        bio: member.bio,
        photoUrl: member.photoUrl,
        sortOrder: member.sortOrder,
        isActive: member.isActive,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
    })
  }

  /**
   * Atualiza um integrante.
   */
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const artistId = String(params.artistId)
    const memberId = String(params.memberId)

    if (
      !/^[1-9]\d*$/.test(artistId) ||
      !/^[1-9]\d*$/.test(memberId)
    ) {
      return response.badRequest({
        message: 'ID do artista ou integrante inválido.',
      })
    }

    const payload = await request.validateUsing(
      updateArtistMemberValidator
    )

    const service = new ArtistMemberService()

    const result = await service.update(
      artistId,
      memberId,
      user.id,
      payload
    )

    if (result.status === 'not_found') {
      return response.notFound({
        message: 'Artista ou integrante não encontrado.',
      })
    }

    if (result.status === 'forbidden') {
      return response.forbidden({
        message: 'Você não tem permissão para editar este integrante.',
      })
    }

    if (result.status === 'invalid_user') {
      return response.badRequest({
        message: 'A conta de usuário informada não existe.',
      })
    }

    if (!('member' in result)) {
      return response.internalServerError({
        message: 'Não foi possível atualizar o integrante.',
      })
    }

    const member = result.member

    return response.ok({
      message: 'Integrante atualizado com sucesso.',
      data: {
        id: String(member.id),
        artistId: String(member.artistId),
        userId: member.userId !== null
          ? String(member.userId)
          : null,
        name: member.name,
        position: member.position,
        bio: member.bio,
        photoUrl: member.photoUrl,
        sortOrder: member.sortOrder,
        isActive: member.isActive,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
    })
  }

  /**
   * Remove um integrante.
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const artistId = String(params.artistId)
    const memberId = String(params.memberId)

    if (
      !/^[1-9]\d*$/.test(artistId) ||
      !/^[1-9]\d*$/.test(memberId)
    ) {
      return response.badRequest({
        message: 'ID do artista ou integrante inválido.',
      })
    }

    const service = new ArtistMemberService()

    const result = await service.delete(
      artistId,
      memberId,
      user.id
    )

    if (result.status === 'not_found') {
      return response.notFound({
        message: 'Artista ou integrante não encontrado.',
      })
    }

    if (result.status === 'forbidden') {
      return response.forbidden({
        message: 'Você não tem permissão para remover este integrante.',
      })
    }

    return response.ok({
      message: 'Integrante removido com sucesso.',
    })
  }
}

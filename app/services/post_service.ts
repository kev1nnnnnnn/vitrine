
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

import Artist from '#models/artist'
import ArtistUserRole from '#models/artist_user_role'
import Post from '#models/post'

type PostStatus = 'draft' | 'published' | 'hidden'

interface CreatePostData {
  content?: string | null
  status?: PostStatus
  publishedAt?: DateTime | null
}

interface UpdatePostData {
  content?: string | null
  status?: PostStatus
  publishedAt?: DateTime | null
}

type CreatePostResult =
  | { status: 'success'; post: Post }
  | { status: 'not_found' }
  | { status: 'forbidden' }

type UpdatePostResult =
  | { status: 'success'; post: Post }
  | { status: 'not_found' }
  | { status: 'forbidden' }

type DeletePostResult =
  | { status: 'success' }
  | { status: 'not_found' }
  | { status: 'forbidden' }

type FindPostResult =
  | { status: 'success'; post: Post }
  | { status: 'not_found' }
  | { status: 'forbidden' }

type ListPostsResult =
  | {
      status: 'success'
      posts: Post[]
      meta: {
        total: number
        page: number
        limit: number
        lastPage: number
      }
    }
  | { status: 'not_found' }

export default class PostService {
  /**
   * Verifica se o usuário possui permissão para gerenciar
   * publicações de determinado artista.
   */
  private async hasPermission(
    artistId: number | bigint,
    userId: number | bigint
  ): Promise<boolean> {
    const permission = await ArtistUserRole.query()
      .where('artistId', String(artistId))
      .where('userId', String(userId))
      .whereIn('role', ['owner', 'admin', 'editor'])
      .first()

    return Boolean(permission)
  }

  /**
   * Criar publicação.
   */
  async create(
    artistId: string,
    userId: number | bigint,
    data: CreatePostData
  ): Promise<CreatePostResult> {
    const artist = await Artist.query()
      .where('id', artistId)
      .first()

    if (!artist) {
      return { status: 'not_found' }
    }

    const authorized = await this.hasPermission(artist.id, userId)

    if (!authorized) {
      return { status: 'forbidden' }
    }

    const status = data.status ?? 'published'

    const publishedAt =
      data.publishedAt !== undefined
        ? data.publishedAt
        : status === 'published'
          ? DateTime.now()
          : null

    const post = await Post.create({
      artistId: artist.id,
      createdByUserId: userId,
      content: data.content ?? null,
      status,
      publishedAt,
    })

    return {
      status: 'success',
      post,
    }
  }

  /**
   * Atualizar publicação.
   */
  async update(
    postId: string,
    userId: number | bigint,
    data: UpdatePostData
  ): Promise<UpdatePostResult> {
    const post = await Post.query()
      .where('id', postId)
      .first()

    if (!post) {
      return { status: 'not_found' }
    }

    const authorized = await this.hasPermission(post.artistId, userId)

    if (!authorized) {
      return { status: 'forbidden' }
    }

    if (data.content !== undefined) {
      post.content = data.content
    }

    if (data.status !== undefined) {
      post.status = data.status

      if (data.status === 'published' && !post.publishedAt) {
        post.publishedAt = DateTime.now()
      }
    }

    if (data.publishedAt !== undefined) {
      post.publishedAt = data.publishedAt
    }

    await post.save()

    return {
      status: 'success',
      post,
    }
  }

  /**
   * Excluir publicação.
   */
  async delete(
    postId: string,
    userId: number | bigint
  ): Promise<DeletePostResult> {
    const post = await Post.query()
      .where('id', postId)
      .first()

    if (!post) {
      return { status: 'not_found' }
    }

    const authorized = await this.hasPermission(post.artistId, userId)

    if (!authorized) {
      return { status: 'forbidden' }
    }

    await post.delete()

    return { status: 'success' }
  }

  /**
   * Listar publicações de um artista com paginação.
   *
   * Sem usuário autorizado, retorna somente publicações publicadas.
   * Com usuário autorizado, permite visualizar todos os status.
   */
  async listByArtist(
    artistId: string,
    page: number = 1,
    limit: number = 10,
    userId?: number | bigint
  ): Promise<ListPostsResult> {
    const artist = await Artist.query()
      .where('id', artistId)
      .first()

    if (!artist) {
      return { status: 'not_found' }
    }

    const currentPage = Math.max(1, Math.floor(page))
    const perPage = Math.min(100, Math.max(1, Math.floor(limit)))

    let canViewAll = false

    if (userId !== undefined) {
      canViewAll = await this.hasPermission(artist.id, userId)
    }

    const postsQuery = Post.query()
      .where('artistId', String(artist.id))

    const countQuery = db
      .from('posts')
      .where('artist_id', String(artist.id))

    if (!canViewAll) {
      postsQuery.where('status', 'published')
      countQuery.where('status', 'published')
    }

    const countResult = await countQuery
      .count('* as total')
      .first()

    const total = Number(countResult?.total ?? 0)

    const posts = await postsQuery
      .preload('medias')
      .orderBy('publishedAt', 'desc')
      .orderBy('createdAt', 'desc')
      .offset((currentPage - 1) * perPage)
      .limit(perPage)

    return {
      status: 'success',
      posts,
      meta: {
        total,
        page: currentPage,
        limit: perPage,
        lastPage: Math.ceil(total / perPage),
      },
    }
  }

  /**
   * Consultar uma publicação individual.
   *
   * Publicações não publicadas só podem ser consultadas
   * por usuários autorizados na vitrine correspondente.
   */
  async findById(
    postId: string,
    userId?: number | bigint
  ): Promise<FindPostResult> {
    const post = await Post.query()
      .where('id', postId)
      .preload('medias')
      .first()

    if (!post) {
      return { status: 'not_found' }
    }

    if (post.status !== 'published') {
      if (userId === undefined) {
        return { status: 'not_found' }
      }

      const authorized = await this.hasPermission(post.artistId, userId)

      if (!authorized) {
        return { status: 'not_found' }
      }
    }

    return {
      status: 'success',
      post,
    }
  }
}

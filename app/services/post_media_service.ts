
import Post from '#models/post'
import PostMedia from '#models/post_media'
import ArtistUserRole from '#models/artist_user_role'

type MediaType = 'image' | 'video'

interface CreatePostMediaData {
  type: MediaType
  url: string
  thumbnailUrl?: string | null
  altText?: string | null
  sortOrder?: number
}

interface UpdatePostMediaData {
  type?: MediaType
  url?: string
  thumbnailUrl?: string | null
  altText?: string | null
  sortOrder?: number
}

type CreatePostMediaResult =
  | { status: 'success'; media: PostMedia }
  | { status: 'not_found' }
  | { status: 'forbidden' }

type ListPostMediasResult =
  | { status: 'success'; medias: PostMedia[] }
  | { status: 'not_found' }

type UpdatePostMediaResult =
  | { status: 'success'; media: PostMedia }
  | { status: 'not_found' }
  | { status: 'forbidden' }

type DeletePostMediaResult =
  | { status: 'success' }
  | { status: 'not_found' }
  | { status: 'forbidden' }

export default class PostMediaService {
  /**
   * Verifica se o usuário possui permissão para gerenciar
   * publicações do artista.
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
   * Adiciona uma mídia a uma publicação.
   */
  async create(
    postId: string,
    userId: number | bigint,
    data: CreatePostMediaData
  ): Promise<CreatePostMediaResult> {
    const post = await Post.query()
      .where('id', postId)
      .first()

    if (!post) {
      return { status: 'not_found' }
    }

    const authorized = await this.hasPermission(
      post.artistId,
      userId
    )

    if (!authorized) {
      return { status: 'forbidden' }
    }

    const media = await PostMedia.create({
      postId: post.id,
      type: data.type,
      url: data.url,
      thumbnailUrl: data.thumbnailUrl ?? null,
      altText: data.altText ?? null,
      sortOrder: data.sortOrder ?? 0,
    })

    return {
      status: 'success',
      media,
    }
  }

  /**
   * Lista as mídias de uma publicação.
   * Publicações não publicadas ficam visíveis apenas
   * para usuários autorizados.
   */
  async listByPost(
    postId: string,
    userId?: number | bigint
  ): Promise<ListPostMediasResult> {
    const post = await Post.query()
      .where('id', postId)
      .first()

    if (!post) {
      return { status: 'not_found' }
    }

    if (post.status !== 'published') {
      if (userId === undefined) {
        return { status: 'not_found' }
      }

      const authorized = await this.hasPermission(
        post.artistId,
        userId
      )

      if (!authorized) {
        return { status: 'not_found' }
      }
    }

    const medias = await PostMedia.query()
      .where('postId', String(post.id))
      .orderBy('sortOrder', 'asc')
      .orderBy('createdAt', 'asc')

    return {
      status: 'success',
      medias,
    }
  }

  /**
   * Atualiza as informações de uma mídia.
   */
  async update(
    mediaId: string,
    userId: number | bigint,
    data: UpdatePostMediaData
  ): Promise<UpdatePostMediaResult> {
    const media = await PostMedia.query()
      .where('id', mediaId)
      .first()

    if (!media) {
      return { status: 'not_found' }
    }

    const post = await Post.query()
      .where('id', String(media.postId))
      .first()

    if (!post) {
      return { status: 'not_found' }
    }

    const authorized = await this.hasPermission(
      post.artistId,
      userId
    )

    if (!authorized) {
      return { status: 'forbidden' }
    }

    if (data.type !== undefined) {
      media.type = data.type
    }

    if (data.url !== undefined) {
      media.url = data.url
    }

    if (data.thumbnailUrl !== undefined) {
      media.thumbnailUrl = data.thumbnailUrl
    }

    if (data.altText !== undefined) {
      media.altText = data.altText
    }

    if (data.sortOrder !== undefined) {
      media.sortOrder = data.sortOrder
    }

    await media.save()

    return {
      status: 'success',
      media,
    }
  }

  /**
   * Remove uma mídia de uma publicação.
   */
  async delete(
    mediaId: string,
    userId: number | bigint
  ): Promise<DeletePostMediaResult> {
    const media = await PostMedia.query()
      .where('id', mediaId)
      .first()

    if (!media) {
      return { status: 'not_found' }
    }

    const post = await Post.query()
      .where('id', String(media.postId))
      .first()

    if (!post) {
      return { status: 'not_found' }
    }

    const authorized = await this.hasPermission(
      post.artistId,
      userId
    )

    if (!authorized) {
      return { status: 'forbidden' }
    }

    await media.delete()

    return {
      status: 'success',
    }
  }
}


import User from '#models/user'
import UserProfile from '#models/user_profile'
import { updateUserProfileValidator } from '#validators/user_profile'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ProfileController {
  /**
   * Retorna os dados do usuário autenticado e seu perfil.
   */
  async show({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await user.load((preloader) => {
      preloader.load('profile')
    })

    return response.ok({
      data: {
        id: String(user.id),
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        initials: user.initials,
        profile: user.profile
          ? {
              phone: user.profile.phone,
              avatarUrl: user.profile.avatarUrl,
              bio: user.profile.bio,
              city: user.profile.city,
              state: user.profile.state,
            }
          : null,
      },
    })
  }

  /**
   * Atualiza os dados da conta e do perfil.
   */
  async update({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const userId = String(user.id)

    const payload = await request.validateUsing(updateUserProfileValidator)

    await db.transaction(async (trx) => {
      if (payload.fullName !== undefined) {
        await User.query({ client: trx })
          .where('id', userId)
          .update({
            fullName: payload.fullName,
          })
      }

      const hasProfileChanges =
        payload.phone !== undefined ||
        payload.avatarUrl !== undefined ||
        payload.bio !== undefined ||
        payload.city !== undefined ||
        payload.state !== undefined

      if (!hasProfileChanges) {
        return
      }

      let profile = await UserProfile.query({ client: trx })
        .where('userId', userId)
        .first()

      if (!profile) {
        profile = new UserProfile()
        profile.userId = user.id
      }

      profile.useTransaction(trx)

      if (payload.phone !== undefined) {
        profile.phone = payload.phone
      }

      if (payload.avatarUrl !== undefined) {
        profile.avatarUrl = payload.avatarUrl
      }

      if (payload.bio !== undefined) {
        profile.bio = payload.bio
      }

      if (payload.city !== undefined) {
        profile.city = payload.city
      }

      if (payload.state !== undefined) {
        profile.state = payload.state
      }

      await profile.save()
    })

    const updatedUser = await User.query()
      .where('id', userId)
      .preload('profile')
      .firstOrFail()

    return response.ok({
      data: {
        id: String(updatedUser.id),
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        initials: updatedUser.initials,
        profile: updatedUser.profile
          ? {
              phone: updatedUser.profile.phone,
              avatarUrl: updatedUser.profile.avatarUrl,
              bio: updatedUser.profile.bio,
              city: updatedUser.profile.city,
              state: updatedUser.profile.state,
            }
          : null,
      },
    })
  }
}

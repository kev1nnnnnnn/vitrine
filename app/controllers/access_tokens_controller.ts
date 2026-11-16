
import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

export default class AccessTokensController {
  async store({ request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async destroy({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!user.currentAccessToken) {
      return response.unauthorized({
        message: 'Token de acesso não encontrado.',
      })
    }

    await User.accessTokens.delete(
      user,
      user.currentAccessToken.identifier
    )

    return response.ok({
      message: 'Logout realizado com sucesso.',
    })
  }
}

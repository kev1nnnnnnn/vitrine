
import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
// import { errors } from '@adonisjs/auth'

export default class NewAccountController {
  async store({ request, response, serialize }: HttpContext) {
    const { fullName, email, password } =
      await request.validateUsing(signupValidator)

    const existingUser = await User.findBy('email', email)

    if (existingUser) {
      return response.conflict({
        message: 'Este e-mail já está cadastrado.',
      })
    }

    const user = await User.create({
      fullName: fullName ?? null,
      email,
      password,
    })

    const token = await User.accessTokens.create(user)

    return response.created(
      await serialize({
        user: UserTransformer.transform(user),
        token: token.value!.release(),
      })
    )
  }
}

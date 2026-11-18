
import type { HttpContext } from '@adonisjs/core/http'

import UserDeviceService from '#services/user_device_service'
import {
  createUserDeviceValidator,
  updateUserDeviceValidator,
  showUserDeviceValidator,
} from '#validators/user_device'

export default class UserDevicesController {
  private userDeviceService = new UserDeviceService()

  async index({ auth, response }: HttpContext) {
    const userId = String(auth.user!.id)

    const devices = await this.userDeviceService.list(userId)

    return response.ok({
      data: devices,
    })
  }

  async show({ params, auth, response }: HttpContext) {
    const { id } = await showUserDeviceValidator.validate({
      id: params.id,
    })

    const userId = String(auth.user!.id)

    const device = await this.userDeviceService.findById(id, userId)

    if (!device) {
      return response.notFound({
        message: 'Dispositivo não encontrado.',
      })
    }

    return response.ok({
      data: device,
    })
  }

  async store({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(createUserDeviceValidator)

    const userId = String(auth.user!.id)

    const result = await this.userDeviceService.create(userId, data)

    switch (result.status) {
      case 'success':
        return response.created({
          message: 'Dispositivo cadastrado com sucesso.',
          data: result.device,
        })

      case 'token_in_use':
        return response.conflict({
          message: 'Este token já está associado a outro usuário.',
        })
    }
  }

  async update({ params, request, auth, response }: HttpContext) {
    const { id } = await showUserDeviceValidator.validate({
      id: params.id,
    })

    const data = await request.validateUsing(updateUserDeviceValidator)

    const userId = String(auth.user!.id)

    const result = await this.userDeviceService.update(id, userId, data)

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Dispositivo atualizado com sucesso.',
          data: result.device,
        })

      case 'not_found':
        return response.notFound({
          message: 'Dispositivo não encontrado.',
        })

      case 'token_in_use':
        return response.conflict({
          message: 'Este token já está associado a outro dispositivo.',
        })
    }
  }

  async destroy({ params, auth, response }: HttpContext) {
    const { id } = await showUserDeviceValidator.validate({
      id: params.id,
    })

    const userId = String(auth.user!.id)

    const result = await this.userDeviceService.deactivate(id, userId)

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Dispositivo desativado com sucesso.',
        })

      case 'not_found':
        return response.notFound({
          message: 'Dispositivo não encontrado.',
        })

      case 'already_inactive':
        return response.conflict({
          message: 'Este dispositivo já está desativado.',
        })
    }
  }
}

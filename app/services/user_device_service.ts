
import { DateTime } from 'luxon'

import UserDevice from '#models/user_device'

interface CreateUserDeviceData {
  deviceToken: string
  platform: 'android' | 'ios' | 'web'
  deviceName?: string | null
}

interface UpdateUserDeviceData {
  deviceToken?: string
  platform?: 'android' | 'ios' | 'web'
  deviceName?: string | null
}

type UserId = number | string

export default class UserDeviceService {
  async create(userId: UserId, data: CreateUserDeviceData) {
    const existingDevice = await UserDevice.query()
      .where('device_token', data.deviceToken)
      .first()

    if (existingDevice) {
      if (String(existingDevice.userId) !== String(userId)) {
        return { status: 'token_in_use' as const }
      }

      existingDevice.platform = data.platform
      existingDevice.deviceName = data.deviceName ?? null
      existingDevice.isActive = true
      existingDevice.lastUsedAt = DateTime.now()

      await existingDevice.save()

      return {
        status: 'success' as const,
        device: existingDevice,
      }
    }

    const device = await UserDevice.create({
      userId: Number(userId),
      deviceToken: data.deviceToken,
      platform: data.platform,
      deviceName: data.deviceName ?? null,
      isActive: true,
      lastUsedAt: DateTime.now(),
    })

    return {
      status: 'success' as const,
      device,
    }
  }

  async list(userId: UserId) {
    return UserDevice.query()
      .where('user_id', String(userId))
      .where('is_active', true)
      .orderBy('created_at', 'desc')
  }

  async findById(id: UserId, userId: UserId) {
    return UserDevice.query()
      .where('id', String(id))
      .where('user_id', String(userId))
      .first()
  }

  async update(
    id: UserId,
    userId: UserId,
    data: UpdateUserDeviceData
  ) {
    const device = await this.findById(id, userId)

    if (!device) {
      return { status: 'not_found' as const }
    }

    if (data.deviceToken && data.deviceToken !== device.deviceToken) {
      const existingDevice = await UserDevice.query()
        .where('device_token', data.deviceToken)
        .whereNot('id', String(device.id))
        .first()

      if (existingDevice) {
        return { status: 'token_in_use' as const }
      }

      device.deviceToken = data.deviceToken
    }

    if (data.platform !== undefined) {
      device.platform = data.platform
    }

    if (data.deviceName !== undefined) {
      device.deviceName = data.deviceName
    }

    device.lastUsedAt = DateTime.now()

    await device.save()

    return {
      status: 'success' as const,
      device,
    }
  }

  async deactivate(id: UserId, userId: UserId) {
    const device = await this.findById(id, userId)

    if (!device) {
      return { status: 'not_found' as const }
    }

    if (!device.isActive) {
      return { status: 'already_inactive' as const }
    }

    device.isActive = false

    await device.save()

    return { status: 'success' as const }
  }
}

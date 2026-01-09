import { randomUUID } from 'crypto'
import { Response } from 'express'

import {
  NotificationDTO,
  NotificationType,
} from '../../data/dto/notification.dto'
import { prisma } from '../../repository'
import { PrismaExceptionHandler } from '../../data/exception/prisma.execption.handler'
import { ApiError } from '../../data/exception/api.exception'
import { UserDTO } from '../../data/dto/user.dto'

type SSEClient = {
  userId: string
  res: Response
}

const clients = new Map<string, SSEClient>()

const addClient = (userId: string, res: Response): string => {
  const clientId = randomUUID()
  clients.set(clientId, { userId, res })
  return clientId
}

const removeClient = (clientId: string) => {
  clients.delete(clientId)
}

const sendEventToUser = async ({
  userId,
  type,
  title,
  read,
  message,
  data,
}: NotificationDTO) => {
  try {
    const notification = (await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        read,
        message,
        data,
      },
    })) as NotificationDTO

    clients.forEach(({ userId: clientUserId, res }) => {
      if (clientUserId === userId && !res.writableEnded) {
        res.write(`event: ${type}\n`)
        res.write(`data: ${JSON.stringify(data)}\n\n`)
      }
    })

    return {
      success: true,
      data: notification,
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'create notification')
  }
}

const broadcastEvent = async (
  event: string,
  data: any,
  author: Partial<UserDTO>
) => {
  try {
    const notification = (await prisma.notification.create({
      data: {
        userId: author.id,
        type: NotificationType.BROADCAST,
        title: 'BROADCAST',
        read: false,
        message: '',
        data,
      },
    })) as NotificationDTO
    clients.forEach(({ res }) => {
      if (!res.writableEnded) {
        res.write(`event: ${event}\n`)
        res.write(`data: ${JSON.stringify(data)}\n\n`)
      }
    })

    return {
      success: true,
      data: notification,
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'create notification')
  }
}

const getUserNotifications = async (userId: string, limit: number) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      data: notifications,
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'create session')
  }
}

export default {
  addClient,
  removeClient,
  sendEventToUser,
  broadcastEvent,
  getUserNotifications,
}

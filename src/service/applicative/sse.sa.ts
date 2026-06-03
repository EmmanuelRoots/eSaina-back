import { randomUUID } from 'crypto'
import { Response } from 'express'

import {
  NotificationDTO,
  NotificationType,
  StoredNotificationDTO,
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
    // Le cast est StoredNotificationDTO car Prisma retourne id + createdAt.
    const notification = (await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        read,
        message,
        data,
      },
    })) as unknown as StoredNotificationDTO

    clients.forEach(({ userId: clientUserId, res }) => {
      if (clientUserId === userId && !res.writableEnded) {
        res.write(`event: ${type}\n`)
        // On envoie la notification complète (avec id, createdAt) pour que le front
        // puisse afficher la date relative correctement.
        res.write(`data: ${JSON.stringify(notification)}\n\n`)
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
      data: notifications as unknown as StoredNotificationDTO[],
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'create session')
  }
}

/**
 * Marque une notification comme lue.
 * Vérifie que la notification appartient bien à l'utilisateur avant de la modifier.
 *
 * @param notificationId - Identifiant de la notification.
 * @param userId         - Identifiant de l'utilisateur (guard d'ownership).
 * @returns La notification mise à jour.
 * @throws ApiError(404) si la notification n'existe pas ou n'appartient pas à l'utilisateur.
 */
const markAsRead = async (notificationId: string, userId: string) => {
  try {
    const existing = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!existing || existing.userId !== userId) {
      throw new ApiError(404, 'Notification introuvable', 'notification_not_found')
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    return { success: true, data: notification as unknown as StoredNotificationDTO }
  } catch (error) {
    if (error instanceof ApiError) throw error
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'mark notification as read')
  }
}

/**
 * Marque toutes les notifications non lues d'un utilisateur comme lues.
 *
 * @param userId - Identifiant de l'utilisateur.
 * @returns Le nombre de notifications mises à jour.
 */
const markAllAsRead = async (userId: string) => {
  try {
    const { count } = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })

    return { success: true, data: { count } }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'mark all notifications as read')
  }
}

export default {
  addClient,
  removeClient,
  sendEventToUser,
  broadcastEvent,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
}

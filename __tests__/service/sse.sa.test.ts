/**
 * Tests unitaires — sse.sa.ts
 *
 * Couvre : addClient/removeClient (gestion de la Map mémoire),
 * sendEventToUser (persistance + émission SSE sur les clients actifs),
 * broadcastEvent (émission sur tous les clients),
 * getUserNotifications (lecture paginée),
 * markAsRead (ownership check + mise à jour),
 * markAllAsRead (updateMany).
 *
 * Prisma est mocké ; les Response Express sont des stubs minimaux.
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────
jest.mock('../../src/repository', () => ({
  prisma: {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  },
}))

import { prisma } from '../../src/repository'
import sseSa from '../../src/service/applicative/sse.sa'
import { NotificationType } from '../../src/data/dto/notification.dto'
import { ApiError } from '../../src/data/exception/api.exception'
import { Response } from 'express'

const mockNotification = prisma.notification as jest.Mocked<typeof prisma.notification>

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Construit une Response Express minimale avec les méthodes utilisées par SSE. */
const buildMockRes = (writableEnded = false) =>
  ({
    write: jest.fn(),
    writableEnded,
  } as unknown as Response)

/** Construit une NotificationDTO de test. */
const buildNotificationDTO = (overrides: Record<string, unknown> = {}) => ({
  userId: 'user-1',
  type: NotificationType.ISSUE_ASSIGNED,
  title: 'Ticket assigné',
  message: 'PROJ-5 vous a été assigné',
  data: { issueId: 'issue-1' },
  read: false,
  ...overrides,
})

/** Construit une notification persistée (retournée par Prisma). */
const buildDbNotification = (overrides: Record<string, unknown> = {}) => ({
  id: 'notif-1',
  userId: 'user-1',
  type: NotificationType.ISSUE_ASSIGNED,
  title: 'Ticket assigné',
  message: 'PROJ-5',
  data: { issueId: 'issue-1' },
  read: false,
  createdAt: new Date(),
  ...overrides,
})

afterEach(() => jest.clearAllMocks())

// ── addClient / removeClient ──────────────────────────────────────────────────
describe('addClient / removeClient', () => {
  it('addClient retourne un clientId non vide et enregistre le client', () => {
    const res = buildMockRes()
    const clientId = sseSa.addClient('user-1', res)
    expect(typeof clientId).toBe('string')
    expect(clientId.length).toBeGreaterThan(0)
  })

  it('removeClient supprime le client sans erreur', () => {
    const res = buildMockRes()
    const clientId = sseSa.addClient('user-2', res)
    expect(() => sseSa.removeClient(clientId)).not.toThrow()
  })
})

// ── sendEventToUser ───────────────────────────────────────────────────────────
describe('sendEventToUser', () => {
  it('crée la notification en base et retourne success: true', async () => {
    const dbNotif = buildDbNotification()
    mockNotification.create.mockResolvedValueOnce(dbNotif as any)

    const result = await sseSa.sendEventToUser(buildNotificationDTO())

    expect(mockNotification.create).toHaveBeenCalledTimes(1)
    expect(result.success).toBe(true)
  })

  it('écrit l\'événement SSE sur les clients connectés avec le bon userId', async () => {
    const dbNotif = buildDbNotification()
    mockNotification.create.mockResolvedValueOnce(dbNotif as any)

    const res = buildMockRes()
    const clientId = sseSa.addClient('user-sse', res)

    await sseSa.sendEventToUser(buildNotificationDTO({ userId: 'user-sse' }))

    expect(res.write).toHaveBeenCalledWith(
      expect.stringContaining(`event: ${NotificationType.ISSUE_ASSIGNED}`),
    )

    sseSa.removeClient(clientId)
  })

  it('n\'écrit pas sur un client dont writableEnded est true', async () => {
    const dbNotif = buildDbNotification()
    mockNotification.create.mockResolvedValueOnce(dbNotif as any)

    const closedRes = buildMockRes(true)
    const clientId = sseSa.addClient('user-closed', closedRes)

    await sseSa.sendEventToUser(buildNotificationDTO({ userId: 'user-closed' }))

    expect(closedRes.write).not.toHaveBeenCalled()

    sseSa.removeClient(clientId)
  })

  it('n\'écrit pas sur un client d\'un autre userId', async () => {
    const dbNotif = buildDbNotification()
    mockNotification.create.mockResolvedValueOnce(dbNotif as any)

    const res = buildMockRes()
    const clientId = sseSa.addClient('other-user', res)

    await sseSa.sendEventToUser(buildNotificationDTO({ userId: 'user-1' }))

    expect(res.write).not.toHaveBeenCalled()

    sseSa.removeClient(clientId)
  })

  it('lève ApiError(500) si Prisma échoue', async () => {
    mockNotification.create.mockRejectedValueOnce(new Error('DB error'))

    await expect(sseSa.sendEventToUser(buildNotificationDTO())).rejects.toMatchObject({
      statusCode: 500,
    })
  })
})

// ── broadcastEvent ────────────────────────────────────────────────────────────
describe('broadcastEvent', () => {
  it('crée la notification en base et écrit sur tous les clients ouverts', async () => {
    const dbNotif = buildDbNotification({ type: NotificationType.BROADCAST })
    mockNotification.create.mockResolvedValueOnce(dbNotif as any)

    const res1 = buildMockRes()
    const res2 = buildMockRes()
    const id1 = sseSa.addClient('u1', res1)
    const id2 = sseSa.addClient('u2', res2)

    const result = await sseSa.broadcastEvent('GLOBAL', { msg: 'hello' }, { id: 'admin-1' })

    expect(result.success).toBe(true)
    expect(res1.write).toHaveBeenCalled()
    expect(res2.write).toHaveBeenCalled()

    sseSa.removeClient(id1)
    sseSa.removeClient(id2)
  })

  it('n\'écrit pas sur un client fermé (writableEnded: true)', async () => {
    const dbNotif = buildDbNotification({ type: NotificationType.BROADCAST })
    mockNotification.create.mockResolvedValueOnce(dbNotif as any)

    const closedRes = buildMockRes(true)
    const id = sseSa.addClient('u-closed', closedRes)

    await sseSa.broadcastEvent('GLOBAL', {}, { id: 'admin-1' })

    expect(closedRes.write).not.toHaveBeenCalled()

    sseSa.removeClient(id)
  })
})

// ── getUserNotifications ──────────────────────────────────────────────────────
describe('getUserNotifications', () => {
  it('retourne les notifications de l\'utilisateur triées par date décroissante', async () => {
    const notifs = [buildDbNotification(), buildDbNotification({ id: 'notif-2' })]
    mockNotification.findMany.mockResolvedValueOnce(notifs as any)

    const result = await sseSa.getUserNotifications('user-1', 20)

    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(2)
    expect(mockNotification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1' },
        take: 20,
        orderBy: { createdAt: 'desc' },
      }),
    )
  })

  it('lève ApiError(500) si Prisma échoue', async () => {
    mockNotification.findMany.mockRejectedValueOnce(new Error('DB error'))

    await expect(sseSa.getUserNotifications('user-1', 10)).rejects.toMatchObject({
      statusCode: 500,
    })
  })
})

// ── markAsRead ────────────────────────────────────────────────────────────────
describe('markAsRead', () => {
  it('marque la notification comme lue si elle appartient à l\'utilisateur', async () => {
    const existing = buildDbNotification({ read: false })
    const updated = buildDbNotification({ read: true })
    mockNotification.findUnique.mockResolvedValueOnce(existing as any)
    mockNotification.update.mockResolvedValueOnce(updated as any)

    const result = await sseSa.markAsRead('notif-1', 'user-1')

    expect(result.success).toBe(true)
    expect(mockNotification.update).toHaveBeenCalledWith({
      where: { id: 'notif-1' },
      data: { read: true },
    })
  })

  it('lève ApiError(404) si la notification n\'existe pas', async () => {
    mockNotification.findUnique.mockResolvedValueOnce(null)

    await expect(sseSa.markAsRead('notif-inexistant', 'user-1')).rejects.toMatchObject({
      statusCode: 404,
      message: 'Notification introuvable',
    })
  })

  it('lève ApiError(404) si la notification appartient à un autre utilisateur', async () => {
    const existing = buildDbNotification({ userId: 'autre-user' })
    mockNotification.findUnique.mockResolvedValueOnce(existing as any)

    await expect(sseSa.markAsRead('notif-1', 'user-1')).rejects.toMatchObject({
      statusCode: 404,
    })
    // update ne doit pas avoir été appelé (guard d'ownership respecté)
    expect(mockNotification.update).not.toHaveBeenCalled()
  })

  it('lève ApiError(500) si Prisma échoue lors du findUnique', async () => {
    mockNotification.findUnique.mockRejectedValueOnce(new Error('DB error'))

    await expect(sseSa.markAsRead('notif-1', 'user-1')).rejects.toMatchObject({
      statusCode: 500,
    })
  })
})

// ── markAllAsRead ─────────────────────────────────────────────────────────────
describe('markAllAsRead', () => {
  it('met à jour toutes les notifications non lues de l\'utilisateur', async () => {
    mockNotification.updateMany.mockResolvedValueOnce({ count: 3 } as any)

    const result = await sseSa.markAllAsRead('user-1')

    expect(result.success).toBe(true)
    expect(result.data).toEqual({ count: 3 })
    expect(mockNotification.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', read: false },
      data: { read: true },
    })
  })

  it('retourne count: 0 quand il n\'y a rien à marquer', async () => {
    mockNotification.updateMany.mockResolvedValueOnce({ count: 0 } as any)

    const result = await sseSa.markAllAsRead('user-sans-notifs')
    expect(result.data.count).toBe(0)
  })

  it('lève ApiError(500) si Prisma échoue', async () => {
    mockNotification.updateMany.mockRejectedValueOnce(new Error('DB error'))

    await expect(sseSa.markAllAsRead('user-1')).rejects.toMatchObject({
      statusCode: 500,
    })
  })
})

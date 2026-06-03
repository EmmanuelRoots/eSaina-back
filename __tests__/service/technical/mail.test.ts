/**
 * Tests unitaires — mail.ts
 *
 * Couvre : comportement no-op quand SMTP absent, appel sendMail avec le bon
 * sujet et le bon destinataire pour chaque template, troncature du commentaire
 * au-delà de 200 caractères, et absorption silencieuse des erreurs d'envoi.
 *
 * nodemailer est mocké pour éviter tout envoi réseau.
 * Les modules sont isolés entre suites pour manipuler les variables d'env SMTP.
 */

// ── Mock nodemailer (AVANT tout import du module testé) ───────────────────────
const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-id' })
const mockCreateTransport = jest.fn(() => ({ sendMail: mockSendMail }))

jest.mock('nodemailer', () => ({
  createTransport: mockCreateTransport,
}))

import * as mailModule from '../../../src/service/technical/mail'

afterEach(() => {
  jest.clearAllMocks()
})

// ── sendIssueAssigned ─────────────────────────────────────────────────────────
describe('sendIssueAssigned', () => {
  it('ne lève pas d\'erreur quand SMTP n\'est pas configuré', async () => {
    // Sans SMTP_HOST/PORT/USER/PASS → transporter est null → no-op
    await expect(
      mailModule.sendIssueAssigned('user@test.com', 'PROJ', 5, 'Corriger le bug', 'Alice Martin'),
    ).resolves.toBeUndefined()
  })

  it('envoie au bon destinataire avec le bon sujet si SMTP est configuré', async () => {
    // Isole le module pour injecter les vars SMTP AVANT le require
    let isolatedSendIssueAssigned: typeof mailModule.sendIssueAssigned
    jest.isolateModules(() => {
      process.env.SMTP_HOST = 'smtp.test.com'
      process.env.SMTP_PORT = '587'
      process.env.SMTP_USER = 'user@test.com'
      process.env.SMTP_PASS = 'pass'
      process.env.SMTP_FROM = 'noreply@esaina.app'
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      isolatedSendIssueAssigned = require('../../../src/service/technical/mail').sendIssueAssigned
    })

    await isolatedSendIssueAssigned!('assignee@test.com', 'PROJ', 7, 'Ajouter la feature X', 'Bob Dupont')

    expect(mockSendMail).toHaveBeenCalledTimes(1)
    const call = mockSendMail.mock.calls[0][0]
    expect(call.to).toBe('assignee@test.com')
    expect(call.subject).toBe('[PROJ-7] Ticket assigné : Ajouter la feature X')
    expect(call.html).toContain('PROJ-7')
    expect(call.html).toContain('Bob Dupont')

    delete process.env.SMTP_HOST
    delete process.env.SMTP_PORT
    delete process.env.SMTP_USER
    delete process.env.SMTP_PASS
    delete process.env.SMTP_FROM
  })
})

// ── sendIssueStatusChanged ────────────────────────────────────────────────────
describe('sendIssueStatusChanged', () => {
  it('ne lève pas d\'erreur quand SMTP n\'est pas configuré', async () => {
    await expect(
      mailModule.sendIssueStatusChanged(
        'user@test.com', 'PROJ', 3, 'Fix login', 'En cours', 'Terminé', 'Alice',
      ),
    ).resolves.toBeUndefined()
  })

  it('envoie avec le bon sujet indiquant le nouveau statut si SMTP configuré', async () => {
    let isolatedSendIssueStatusChanged: typeof mailModule.sendIssueStatusChanged
    jest.isolateModules(() => {
      process.env.SMTP_HOST = 'smtp.test.com'
      process.env.SMTP_PORT = '587'
      process.env.SMTP_USER = 'user@test.com'
      process.env.SMTP_PASS = 'pass'
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      isolatedSendIssueStatusChanged = require('../../../src/service/technical/mail').sendIssueStatusChanged
    })

    await isolatedSendIssueStatusChanged!(
      'reporter@test.com', 'PROJ', 3, 'Fix login', 'En cours', 'Terminé', 'Alice Martin',
    )

    expect(mockSendMail).toHaveBeenCalledTimes(1)
    const call = mockSendMail.mock.calls[0][0]
    expect(call.to).toBe('reporter@test.com')
    expect(call.subject).toContain('[PROJ-3]')
    expect(call.subject).toContain('Terminé')
    expect(call.html).toContain('En cours')
    expect(call.html).toContain('Alice Martin')

    delete process.env.SMTP_HOST
    delete process.env.SMTP_PORT
    delete process.env.SMTP_USER
    delete process.env.SMTP_PASS
  })
})

// ── sendIssueCommented ────────────────────────────────────────────────────────
describe('sendIssueCommented', () => {
  it('ne lève pas d\'erreur quand SMTP n\'est pas configuré', async () => {
    await expect(
      mailModule.sendIssueCommented(
        'user@test.com', 'PROJ', 2, 'Fix auth', 'Charlie', 'Court commentaire.',
      ),
    ).resolves.toBeUndefined()
  })

  it('tronque le contenu du commentaire à 200 caractères dans le HTML si SMTP configuré', async () => {
    let isolatedSendIssueCommented: typeof mailModule.sendIssueCommented
    jest.isolateModules(() => {
      process.env.SMTP_HOST = 'smtp.test.com'
      process.env.SMTP_PORT = '587'
      process.env.SMTP_USER = 'user@test.com'
      process.env.SMTP_PASS = 'pass'
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      isolatedSendIssueCommented = require('../../../src/service/technical/mail').sendIssueCommented
    })

    const longComment = 'A'.repeat(250)
    await isolatedSendIssueCommented!(
      'assignee@test.com', 'PROJ', 9, 'Long comment issue', 'Diana', longComment,
    )

    expect(mockSendMail).toHaveBeenCalledTimes(1)
    const call = mockSendMail.mock.calls[0][0]
    // Le HTML doit contenir les 200 premiers caractères + "…" mais PAS les 250
    expect(call.html).toContain('A'.repeat(200) + '…')
    expect(call.html).not.toContain('A'.repeat(201) + 'A')

    delete process.env.SMTP_HOST
    delete process.env.SMTP_PORT
    delete process.env.SMTP_USER
    delete process.env.SMTP_PASS
  })

  it('ne tronque pas un commentaire de moins de 200 caractères', async () => {
    let isolatedSendIssueCommented: typeof mailModule.sendIssueCommented
    jest.isolateModules(() => {
      process.env.SMTP_HOST = 'smtp.test.com'
      process.env.SMTP_PORT = '587'
      process.env.SMTP_USER = 'user@test.com'
      process.env.SMTP_PASS = 'pass'
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      isolatedSendIssueCommented = require('../../../src/service/technical/mail').sendIssueCommented
    })

    const shortComment = 'Commentaire court.'
    await isolatedSendIssueCommented!(
      'reporter@test.com', 'PROJ', 1, 'Issue titre', 'Eve', shortComment,
    )

    expect(mockSendMail).toHaveBeenCalledTimes(1)
    const call = mockSendMail.mock.calls[0][0]
    expect(call.html).toContain(shortComment)
    expect(call.html).not.toContain('…')

    delete process.env.SMTP_HOST
    delete process.env.SMTP_PORT
    delete process.env.SMTP_USER
    delete process.env.SMTP_PASS
  })

  it('absorbe silencieusement une erreur d\'envoi SMTP sans lever d\'exception', async () => {
    let isolatedSendIssueCommented: typeof mailModule.sendIssueCommented
    jest.isolateModules(() => {
      process.env.SMTP_HOST = 'smtp.test.com'
      process.env.SMTP_PORT = '587'
      process.env.SMTP_USER = 'user@test.com'
      process.env.SMTP_PASS = 'pass'
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      isolatedSendIssueCommented = require('../../../src/service/technical/mail').sendIssueCommented
    })

    mockSendMail.mockRejectedValueOnce(new Error('SMTP connection refused'))

    await expect(
      isolatedSendIssueCommented!(
        'user@test.com', 'PROJ', 1, 'Issue', 'Frank', 'Commentaire.',
      ),
    ).resolves.toBeUndefined()

    delete process.env.SMTP_HOST
    delete process.env.SMTP_PORT
    delete process.env.SMTP_USER
    delete process.env.SMTP_PASS
  })
})

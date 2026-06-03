/**
 * Service technique d'envoi de mails transactionnels (nodemailer/SMTP).
 *
 * Rôle : adaptateur infrastructure — toute la logique d'envoi SMTP est isolée ici.
 * Les services applicatifs appellent les fonctions de haut niveau (sendIssueAssigned,
 * sendIssueStatusChanged, sendIssueCommented) sans connaître le transport.
 *
 * Variables d'env requises : SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.
 * Si l'une est absente, les envois sont no-op (log uniquement) pour ne pas crasher le dev.
 */
import nodemailer, { Transporter } from 'nodemailer'

// ── Transport SMTP ────────────────────────────────────────────────────────────

/**
 * Crée le transport SMTP à partir des variables d'env.
 * Retourne null si la config est incomplète (mode dev sans SMTP configuré).
 */
const createTransport = (): Transporter | null => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('[mail] Config SMTP incomplète — les mails ne seront pas envoyés.')
    return null
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

const transporter = createTransport()
const FROM = process.env.SMTP_FROM ?? 'eSaina <no-reply@esaina.app>'

// ── Fonction bas niveau ───────────────────────────────────────────────────────

/**
 * Envoie un mail HTML transactionnel.
 * Silencieux (log uniquement) si le transporter n'est pas configuré.
 *
 * @param to      - Adresse destinataire.
 * @param subject - Objet du mail.
 * @param html    - Corps HTML du mail.
 */
const sendMail = async (to: string, subject: string, html: string): Promise<void> => {
  if (!transporter) {
    console.info(`[mail] (no-op) À: ${to} | Sujet: ${subject}`)
    return
  }
  try {
    await transporter.sendMail({ from: FROM, to, subject, html })
  } catch (err) {
    // On logue sans propager : un échec mail ne doit pas faire rater l'action métier.
    console.error('[mail] Échec d\'envoi:', err)
  }
}

// ── Templates HTML ────────────────────────────────────────────────────────────

/**
 * Enveloppe HTML commune à tous les mails (layout minimaliste).
 */
const wrapHtml = (content: string): string => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
    .header { background: #4f46e5; padding: 24px 32px; color: #fff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
    .body { padding: 28px 32px; color: #374151; line-height: 1.6; }
    .issue-ref { display: inline-block; background: #eef2ff; color: #4f46e5; padding: 2px 10px; border-radius: 4px; font-weight: 600; font-size: 13px; }
    .meta { margin-top: 16px; background: #f9fafb; border-radius: 6px; padding: 14px 18px; font-size: 14px; }
    .meta p { margin: 4px 0; color: #6b7280; }
    .meta strong { color: #111827; }
    .footer { padding: 16px 32px; background: #f9fafb; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">eSaina — vous recevez ce mail car vous êtes concerné par ce ticket.</div>
  </div>
</body>
</html>`

// ── Envois spécialisés ────────────────────────────────────────────────────────

/**
 * Notifie un utilisateur qu'un ticket lui a été assigné.
 *
 * @param to          - Email du destinataire (nouvel assignee).
 * @param projectKey  - Clé du projet (ex. "PROJ").
 * @param issueNumber - Numéro du ticket dans le projet.
 * @param issueTitle  - Titre du ticket.
 * @param reporterName - Nom complet du rapporteur (qui a assigné).
 */
export const sendIssueAssigned = async (
  to: string,
  projectKey: string,
  issueNumber: number,
  issueTitle: string,
  reporterName: string,
): Promise<void> => {
  const ref = `${projectKey}-${issueNumber}`
  const html = wrapHtml(`
    <div class="header"><h1>Ticket assigné</h1></div>
    <div class="body">
      <p>Le ticket <span class="issue-ref">${ref}</span> vous a été assigné.</p>
      <div class="meta">
        <p><strong>Titre :</strong> ${issueTitle}</p>
        <p><strong>Assigné par :</strong> ${reporterName}</p>
      </div>
    </div>`)
  await sendMail(to, `[${ref}] Ticket assigné : ${issueTitle}`, html)
}

/**
 * Notifie assignee et/ou reporter qu'un statut de ticket a changé.
 *
 * @param to            - Email du destinataire.
 * @param projectKey    - Clé du projet.
 * @param issueNumber   - Numéro du ticket.
 * @param issueTitle    - Titre du ticket.
 * @param oldStatus     - Ancien statut (label lisible).
 * @param newStatus     - Nouveau statut (label lisible).
 * @param actorName     - Nom de l'utilisateur ayant fait le changement.
 */
export const sendIssueStatusChanged = async (
  to: string,
  projectKey: string,
  issueNumber: number,
  issueTitle: string,
  oldStatus: string,
  newStatus: string,
  actorName: string,
): Promise<void> => {
  const ref = `${projectKey}-${issueNumber}`
  const html = wrapHtml(`
    <div class="header"><h1>Statut mis à jour</h1></div>
    <div class="body">
      <p>Le statut du ticket <span class="issue-ref">${ref}</span> a été mis à jour.</p>
      <div class="meta">
        <p><strong>Titre :</strong> ${issueTitle}</p>
        <p><strong>Ancien statut :</strong> ${oldStatus}</p>
        <p><strong>Nouveau statut :</strong> ${newStatus}</p>
        <p><strong>Modifié par :</strong> ${actorName}</p>
      </div>
    </div>`)
  await sendMail(to, `[${ref}] Statut mis à jour → ${newStatus}`, html)
}

/**
 * Notifie assignee et/ou reporter qu'un nouveau commentaire a été posté.
 *
 * @param to             - Email du destinataire.
 * @param projectKey     - Clé du projet.
 * @param issueNumber    - Numéro du ticket.
 * @param issueTitle     - Titre du ticket.
 * @param commenterName  - Nom de l'auteur du commentaire.
 * @param commentContent - Contenu textuel du commentaire (tronqué si long).
 */
export const sendIssueCommented = async (
  to: string,
  projectKey: string,
  issueNumber: number,
  issueTitle: string,
  commenterName: string,
  commentContent: string,
): Promise<void> => {
  const ref = `${projectKey}-${issueNumber}`
  const preview = commentContent.length > 200
    ? `${commentContent.slice(0, 200)}…`
    : commentContent
  const html = wrapHtml(`
    <div class="header"><h1>Nouveau commentaire</h1></div>
    <div class="body">
      <p><strong>${commenterName}</strong> a commenté le ticket <span class="issue-ref">${ref}</span>.</p>
      <div class="meta">
        <p><strong>Titre :</strong> ${issueTitle}</p>
        <p><strong>Commentaire :</strong></p>
        <p>${preview}</p>
      </div>
    </div>`)
  await sendMail(to, `[${ref}] Nouveau commentaire de ${commenterName}`, html)
}

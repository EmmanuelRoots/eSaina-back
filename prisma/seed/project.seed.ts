import { StatusCategory } from '@prisma/client'
import { prisma } from '../../src/repository'

export const projectSeed = async () => {
  const existing = await prisma.project.findUnique({
    where: { key: 'ESA' },
  })

  if (existing) {
    console.log('ℹ️ Project "ESA" existe déjà.')
    return
  }

  const owner = await prisma.user.findFirst({
    where: { role: { name: 'SUPER_ADMIN' } },
  })
  if (!owner) {
    console.warn('⚠️ Seed project skipped : aucun SUPER_ADMIN trouvé.')
    return
  }

  const salon = await prisma.salon.findFirst({
    where: { title: 'Annonce officielle' },
  })

  // Création du projet avec les statuts dynamiques par défaut — même logique
  // que createProject dans project.sa.ts. Sans ces entrées ProjectStatus,
  // le dashboard analytics (qui lit projectStatus.category) n'aurait aucun
  // résultat pour les issues seedées.
  const project = await prisma.project.create({
    data: {
      key: 'ESA',
      name: 'eSaina Platform',
      description: 'Projet de démonstration pour la gestion de projet style JIRA.',
      ownerId: owner.id,
      salonId: salon?.id,
      issueCounter: 3,
      members: {
        create: [{ userId: owner.id, role: 'ADMIN' }],
      },
      labels: {
        create: [
          { name: 'frontend', color: '#3B82F6' },
          { name: 'backend', color: '#10B981' },
          { name: 'urgent', color: '#EF4444' },
        ],
      },
      statuses: {
        create: [
          { name: 'Todo',        color: '#94a3b8', position: 0, category: StatusCategory.TODO },
          { name: 'In Progress', color: '#3b82f6', position: 1, category: StatusCategory.IN_PROGRESS },
          { name: 'Done',        color: '#22c55e', position: 2, category: StatusCategory.DONE },
        ],
      },
      sprints: {
        create: [
          {
            name: 'Sprint 1 - Bootstrap',
            goal: "Mise en place de l'architecture projet.",
            status: 'ACTIVE',
            startDate: new Date(),
          },
        ],
      },
    },
    include: { sprints: true, statuses: true },
  })

  const sprint = project.sprints[0]

  // Résolution des IDs de statuts par catégorie pour lier les issues
  const statusByCategory = Object.fromEntries(
    project.statuses.map((s) => [s.category, s.id]),
  )

  await prisma.issue.createMany({
    data: [
      {
        projectId: project.id,
        number: 1,
        title: 'Configurer le board Kanban',
        description: 'Vue avec colonnes TODO / IN_PROGRESS / IN_REVIEW / DONE.',
        type: 'STORY',
        status: 'IN_PROGRESS',
        statusId: statusByCategory[StatusCategory.IN_PROGRESS],
        priority: 'HIGH',
        storyPoints: 5,
        position: 1,
        sprintId: sprint?.id,
        reporterId: owner.id,
        assigneeId: owner.id,
      },
      {
        projectId: project.id,
        number: 2,
        title: 'Schéma Prisma pour les projets',
        description: 'Project, Sprint, Issue, Label, etc.',
        type: 'TASK',
        status: 'DONE',
        statusId: statusByCategory[StatusCategory.DONE],
        priority: 'MEDIUM',
        storyPoints: 3,
        position: 2,
        sprintId: sprint?.id,
        reporterId: owner.id,
        assigneeId: owner.id,
      },
      {
        projectId: project.id,
        number: 3,
        title: 'Bug : refresh token expire trop vite',
        description: 'Vérifier la TTL côté backend.',
        type: 'BUG',
        status: 'TODO',
        statusId: statusByCategory[StatusCategory.TODO],
        priority: 'CRITICAL',
        storyPoints: 2,
        position: 3,
        reporterId: owner.id,
      },
    ],
  })

  console.log('✅ Project "ESA" créé avec 3 issues + 1 sprint actif + statuts dynamiques.')
}

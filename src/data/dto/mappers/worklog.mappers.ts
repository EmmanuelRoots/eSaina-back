/**
 * Mapper : entité Prisma WorkLog → WorkLogDTO.
 *
 * Place dans le flux : appelé par worklog.sa.ts avant de retourner les données
 * au controller, pour éviter d'exposer les types Prisma bruts à l'API.
 *
 * Dépendances : Prisma (WorkLog, User, Issue, Project), date.utils.ts.
 */

import { Issue, Project, User, WorkLog } from "@prisma/client";
import { toISO } from "../../../utils/date.utils";
import { WorkLogDTO } from "../worklog.dto";
import { buildIssueKey } from "./issue.mappers";

/**
 * Convertit un enregistrement WorkLog Prisma (avec ses relations) en WorkLogDTO.
 *
 * @param worklog - WorkLog Prisma avec user et issue (+ project) inclus.
 * @returns WorkLogDTO prêt pour la réponse API.
 */
export const toWorkLogDTO = (
  worklog: WorkLog & {
    user: User;
    issue: Issue & { project?: Pick<Project, "key"> };
  },
): WorkLogDTO => ({
  id: worklog.id,
  issueId: worklog.issueId,
  issueKey:
    worklog.issue.project
      ? buildIssueKey(worklog.issue.project.key, worklog.issue.number)
      : undefined,
  issueTitle: worklog.issue.title,
  userId: worklog.userId,
  user: {
    id: worklog.user.id,
    firstName: worklog.user.firstName,
    lastName: worklog.user.lastName,
    pdpUrl: worklog.user.pdpUrl ?? undefined,
  },
  date: toISO(worklog.date)!,
  timeSpentMinutes: worklog.timeSpentMinutes,
  description: worklog.description,
  createdAt: toISO(worklog.createdAt)!,
  updatedAt: toISO(worklog.updatedAt)!,
});

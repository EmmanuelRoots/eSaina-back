import { Session as PrismaSession } from '../../../../generated/prisma';
import { User } from '../../../../generated/prisma';
import { toISO } from '../../../utils/date.utils';
import { SessionDTO } from '../session.dto';
import { toUserDTO } from './user.mappers';

export const toSessionDTO = (session: PrismaSession & { user: User }): SessionDTO => ({
  id: session.id,
  refreshToken: session.refreshToken,
  expiresAt: toISO(session.expiresAt),
  userId: session.userId,
  user: toUserDTO(session.user),
  createdAt : toISO(session.createdAt)
});
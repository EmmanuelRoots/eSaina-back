import { Group, GroupMember, User } from '@prisma/client'
import { toISO } from '../../../utils/date.utils'
import {
  GroupDetailDTO,
  GroupMemberDTO,
  GroupSummaryDTO,
} from '../group.dto'

type GroupWithCount = Group & { _count?: { members: number } }
type GroupMemberWithUser = GroupMember & { user: User }
type GroupWithMembers = Group & { members: GroupMemberWithUser[] }

export const toGroupMemberDTO = (m: GroupMemberWithUser): GroupMemberDTO => ({
  id: m.id,
  userId: m.userId,
  role: m.role,
  joinedAt: toISO(m.joinedAt)!,
  user: {
    id: m.user.id,
    email: m.user.email,
    firstName: m.user.firstName,
    lastName: m.user.lastName,
    pdpUrl: m.user.pdpUrl ?? '',
  },
})

export const toGroupSummaryDTO = (g: GroupWithCount): GroupSummaryDTO => ({
  id: g.id,
  name: g.name,
  description: g.description,
  createdAt: toISO(g.createdAt)!,
  updatedAt: toISO(g.updatedAt)!,
  createdById: g.createdById,
  memberCount: g._count?.members ?? 0,
})

export const toGroupDetailDTO = (
  g: GroupWithMembers & { _count?: { members: number } }
): GroupDetailDTO => ({
  ...toGroupSummaryDTO(g),
  memberCount: g._count?.members ?? g.members.length,
  members: g.members.map(toGroupMemberDTO),
})

import { User } from "@prisma/client";
import { toISO } from "../../../utils/date.utils";
import { UserDTO } from "../user.dto";

export const toUserDTO = (user: User): UserDTO => ({
  id : user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  birthDate: toISO(user.birthDate),
  createdAt: toISO(user.createdAt)!,
  pdpUrl : user.pdpUrl ?? '',
  roleId : user.roleId
});
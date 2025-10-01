import { User } from "../../../../generated/prisma";
import { toISO } from "../../../utils/date.utils";
import { UserDTO } from "../user.dto";

export const toUserDTO = (user: User): UserDTO => ({
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  birthDate: toISO(user.birthDate),
  createdAt: toISO(user.createdAt)!,
});
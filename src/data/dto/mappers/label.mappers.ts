import { Label } from "@prisma/client";
import { toISO } from "../../../utils/date.utils";
import { LabelDTO } from "../label.dto";

export const toLabelDTO = (label: Label): LabelDTO => ({
  id: label.id,
  projectId: label.projectId,
  name: label.name,
  color: label.color,
  createdAt: toISO(label.createdAt) ?? undefined,
});

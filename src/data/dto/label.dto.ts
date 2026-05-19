export interface LabelDTO {
  id: string
  projectId: string
  name: string
  color: string
  createdAt?: string
}

export interface CreateLabelRequestDTO {
  projectId: string
  name: string
  color?: string
}

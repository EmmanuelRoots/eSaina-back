export const buildTree = (flat: any[]) => {
  const map = new Map<string, any>()
  flat.forEach(c => map.set(c.id, { ...c, replies: [] }))

  const tree: any[] = []
  flat.forEach(c => {
    if (c.parentId) map.get(c.parentId)?.replies.push(map.get(c.id))
    else tree.push(map.get(c.id))
  })
  return tree
}

import pinataSDK from '@pinata/sdk'

export async function getListNames() {
  if (!process.env.PINATA_KEY || !process.env.PINATA_SECRET) {
    throw new Error('Pinata key missing')
  }

  const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET)

  const pinnedItems = await pinata.pinList({
    metadata: {
      keyvalues: {
        type: {
          value: 'module',
          op: 'eq',
        },
      },
    },
  })

  const allLists = new Set<string>()

  for (const item of pinnedItems.rows as any[]) {
    if (item.metadata.keyvalues.list) {
      const lists = item.metadata.keyvalues.list.split(',')
      for (const list of lists) {
        allLists.add(list)
      }
    }
  }

  return Array.from(allLists)
}

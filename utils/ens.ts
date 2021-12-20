import { getENSName } from "use-ens-name";

export async function getENSCache(addresses: string[]) {
  const names = await Promise.all(addresses.map(async (address: string) => {
    const name = await getENSName(address)
    return name ? { address, name } : null
  }))

  const filteredNames = names.filter(name => name)
  return filteredNames
}

export const IPFS_GATEWAY = 'https://cloudflare-ipfs.com'

export const getTextFileFromIPFS = async (cid: string) => {
  const resp = await fetch(`${IPFS_GATEWAY}/ipfs/${cid}`)
  const text = await resp.text()
  return text
}

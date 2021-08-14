export const getTextFileFromIPFS = async (cid: string) => {
  const resp = await fetch(`https://ipfs.io/ipfs/${cid}`)
  const text = await resp.text()
  return text
}

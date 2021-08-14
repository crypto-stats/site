import { useEffect, useState } from 'react'
import { getTextFileFromIPFS } from 'utils/ipfs'

interface File {
  file: string | null;
  loading: boolean;
}

const ipfsCache: { [cid: string]: string } = {};

export const setCache = (cid: string, text: string) => {
  ipfsCache[cid] = text;
}

export const useFile = (cid?: string | null) => {
  const [file, setFile] = useState<File>({
    file: cid && ipfsCache[cid] || null,
    loading: false,
  })

  useEffect(() => {
    if (cid) {
      setFile({ file: null, loading: true })
      getTextFileFromIPFS(cid)
        .then(text => setFile({ file: text, loading: false }))
        .catch((e: any) => {
          console.warn(e)
          setFile({ file: null, loading: false })
        })
    } else {
      setFile({ file: null, loading: false })
    }
  }, [cid])

  return file
}

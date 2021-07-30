import { useEffect, useState } from 'react'

interface File {
  file: string | null;
  loading: boolean;
}

export const useFile = (cid?: string | null) => {
  const [file, setFile] = useState<File>({ file: null, loading: false })

  useEffect(() => {
    if (cid) {
      setFile({ file: null, loading: true })
      fetch(`https://ipfs.io/ipfs/${cid}`)
        .then(resp => resp.text())
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

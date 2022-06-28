declare module 'react-gh-like-diff' {
  import React from 'react'

  interface ReactGhLikeDiffProps {
    past?: string
    current?: string
    options?: any
  }

  export const ReactGhLikeDiff: React.FC<ReactGhLikeDiffProps>
}

declare module 'ipfs-only-hash' {
  const Hash: {
    of(input: Buffer): Promise<string>
  }

  export default Hash
}

declare module 'react-gh-like-diff' {
  import React from 'react'

  interface ReactGhLikeDiffProps {
    past?: string
    current?: string
    options?: any
  }

  export const ReactGhLikeDiff: React.FC<ReactGhLikeDiffProps>
}

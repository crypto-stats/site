import { Fill, LeftResizable } from 'react-spaces'
import { Footer, SubgraphList, Title, Documentation } from '.'

interface LeftSideProps {
  subgraphId: string | null
  setSubgraphId: (val: string | null) => void
  setShowDocs: React.Dispatch<React.SetStateAction<boolean>>
  showDocs: boolean
}

export const LeftSide = (props: LeftSideProps) => {
  const { subgraphId, setSubgraphId, setShowDocs, showDocs } = props

  return (
    <LeftResizable size={!showDocs ? 298 : 500} style={{ backgroundColor: '#303030' }}>
      <Fill scrollable={true} style={{ display: 'flex', flexDirection: 'column' }}>
        <Title />
        {!showDocs ? (
          <>
            <SubgraphList selected={subgraphId} onSelected={setSubgraphId} />
            <Footer onDocsClick={() => setShowDocs(true)} />
          </>
        ) : (
          <Documentation closeDocs={() => setShowDocs(false)} />
        )}
      </Fill>
    </LeftResizable>
  )
}

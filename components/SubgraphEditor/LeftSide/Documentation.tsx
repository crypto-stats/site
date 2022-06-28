import styled from 'styled-components'
import { ChevronLeft } from 'lucide-react'

const Root = styled.div`
  padding: 40px 32px;
  color: var(--color-white);

  a {
    color: #cda9ef;
  }
  a:hover {
    color: #b279e6;
  }
`

const Title = styled.h1`
  font-size: 30px;
  margin: 0px;
`

const SubTitle = styled.h2`
  font-size: 24px;
  margin: 0px;
`

const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: var(--color-white);
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`

interface DocumentationProps {
  closeDocs: () => void
}

export const Documentation = (props: DocumentationProps) => {
  const { closeDocs } = props

  return (
    <Root>
      <BackLink onClick={closeDocs}>
        <ChevronLeft size={12} />
        Back to explorer
      </BackLink>
      <Title>Documentation</Title>
      <p>
        The Subeditor is the easiest tool for building and deploying subgraphs to the Graph
        Protocol, directly from your browser.
      </p>

      <SubTitle>1. Subgraph Configuration</SubTitle>
      <p>
        Insert the addresses of any smart contracts you’d like to index. The Subeditor will
        automatically fetch the ABI and deployment block number from Etherscan. However, if you’re
        indexing a contract that’s not verified on Etherscan, you’ll need to manually upload an ABI.
      </p>
      <p>
        Add any contract events that you’d like your subgraph to index, and select the function from
        your mapping that will handle this event. In most cases, you probably will want to select
        the option to “create a new function”, and let the editor create a stub function in your
        mapping file that you can fill in.
      </p>

      <SubTitle>2. Schema</SubTitle>
      <p>
        Next, visit the “Schema” tab, where you can define the data schema for the data your
        subgraph will store.
      </p>
      <p>For more information about writing schemas, visit The Graph’s official documentation.</p>

      <SubTitle>3. Mapping</SubTitle>
      <p>
        Next, open the “Mapping” tab, where you can write the code for handling events and updating
        entities.
      </p>
      <p>
        The mapping file is written in AssemblyScript, a language that is generally a sub-set of
        TypeScript
      </p>

      <SubTitle>4. Deploy</SubTitle>
      <p>
        Before being able to deploy your subgraph, you'll first need to create the subgraph in the{' '}
        <a href="https://thegraph.com/studio/" target="studio">
          Subgraph Studio
        </a>
        . Once you create a subgraph, return to the Subeditor and click "Publish" in the top right.
        Paste the subgraph slug and deploy key from the Subgraph Studio.
      </p>
      <p>
        <i>
          Note: the subeditor also supports deploying to The Graph's depricated "hosted service".
        </i>
      </p>
      <p>
        Click "Next", and you will be promped to sign the subgraph with your Ethereum wallet. Once
        you complete the signature, your subgraph will be published to The Graph studio.
      </p>
      <p>
        Once your subgraph is deployed, you can test and manage your subgraph from the Subgraph
        Studio. Check the Graph documentation for more information about {}
        <a href="https://thegraph.com/docs/en/studio/billing/">billing and API keys</a>.
      </p>
    </Root>
  )
}

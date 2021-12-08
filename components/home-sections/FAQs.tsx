import Link from 'next/link'
import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 20px;
`

const QuestionHeader = styled.div`
  font-size: 24px;
  color: #002750;
  padding: 12px;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
`

const Answer = styled.div`
  font-size: 18px;
  color: #6f7275;
  margin: 8px 8px 8px 32px;
`

const Header = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #002750;
`

const Question: React.FC<{ question: string }> = ({ question, children }) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <QuestionHeader onClick={() => setOpen(!open)}>{question}</QuestionHeader>
      {open && (
        <Answer>{children}</Answer>
      )}
    </div>
  )
}


const FAQs: React.FC = () => {
  return (
    <Container>
      <Header>FAQs</Header>

      <Question question="1. Is CryptoStats data free?">
        Yes! Our data is and will always be free to access.
      </Question>

      <Question question="2. Is CryptoStats decentralized?">
        <p>
          CryptoStats aims to be a fully decentralized protocol, with adapter code stored in IPFS, {}
          adapter hashes registered on-chain, and queries executed locally.
        </p>

        <p>
          The protocol is currently undergoing progressive decentalization, and adapters are {}
          currently verified in a centralized manner.
        </p>
      </Question>

      <Question question="3. How is CryptoStats different from The Graph?">
        <p>
          We love The Graph Protocol! In fact, a majority of CryptoStats adapters have some interaction with The Graph.
        </p>

        <p>
          However, we see The Graph and CryptoStats as being two different layers of the data {}
          metrics pipeline, with different purposes.
        </p>

        <p>
          The Graph provides indexing infrastructure: powerful servers and large databases that can {}
          process the large amount of data produced by crypto protocols. CryptoStats, on the otherhand, {}
          has no infrastructure of it's own. CryptoStats aggregates data from indexers like The Graph, {}
          combines it, and provides trust assurances that the data is as accuate as possible.
        </p>
      </Question>

      <Question question="4. How can I contribute to CryptoStats?">
        <p>CryptoStats wouldn't be possible without support from community members like yourself!</p>

        <p>
          If you're a developer, you may be interested in building and updating adapters. Check out {}
          <a href="https://forum.cryptostats.community">our forum</a> to find protocols that need to {}
          be added or updated on CryptoStats, and then update them in <Link href="/editor">the editor</Link>.
        </p>

        <p>
          If you're into data, you might just want to look through the existing adapters, find adapters {}
          that can be improved, or just discuss new metrics that could be tracked on our forum.
        </p>

        <p>
          And if you build websites or do data visualization, you can support CryptoStats by just building {}
          cool stuff that uses our data (and share CryptoStats as a source :D).
        </p>
      </Question>
    </Container>
  )
}

export default FAQs

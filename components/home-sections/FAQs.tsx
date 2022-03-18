import Link from "next/link"
import React, { useState } from "react"
import styled from "styled-components"
import RowSection from "components/RowSection"
import ColumnSection from "components/ColumnSection"
import Text from "components/Text"

const QeA = styled.div`
  border-bottom: 1px solid var(--color-primary-800);
`

const QuestionHeader = styled.div`
  font-size: 24px;
  color: #002750;
  padding: 16px 24px;
  cursor: pointer;

  &:hover {
    color: var(--color-primary);
  }
`

const Answer = styled.div`
  font-size: 18px;
  color: #6f7275;
  padding: 24px;
`

const Question: React.FC<{ question: string }> = ({ question, children }) => {
  const [open, setOpen] = useState(false)

  return (
    <QeA>
      <QuestionHeader onClick={() => setOpen(!open)}>{question}</QuestionHeader>
      {open && <Answer>{children}</Answer>}
    </QeA>
  )
}

const FAQs: React.FC = () => {
  return (
    <>
      <RowSection mt='140' mb='150'>
        <ColumnSection from='2' to='12'>
          <Text tag='h3' type='title_highlight' mb='64'>
            Frequent answered questions
          </Text>

          <Question question='1. Is CryptoStats data free?'>
            <Text tag='p' type='description' mb='8'>
              Yes! Our data is and will always be free to access.
            </Text>
          </Question>

          <Question question='2. Is CryptoStats decentralized?'>
            <Text tag='p' type='description' mb='8'>
              CryptoStats aims to be a fully decentralized protocol, with adapter code stored in
              IPFS, {}
              adapter hashes registered on-chain, and queries executed locally.
            </Text>
            <Text tag='p' type='description' mb='8'>
              The protocol is currently undergoing progressive decentalization, and adapters are {}
              currently verified in a centralized manner.
            </Text>
          </Question>

          <Question question='3. How is CryptoStats different from The Graph?'>
            <Text tag='p' type='description' mb='8'>
              We love The Graph Protocol! In fact, a majority of CryptoStats adapters have some
              interaction with The Graph.
            </Text>
            <Text tag='p' type='description' mb='8'>
              However, we see The Graph and CryptoStats as being two different layers of the data {}
              metrics pipeline, with different purposes.
            </Text>
            <Text tag='p' type='description' mb='8'>
              The Graph provides indexing infrastructure: powerful servers and large databases that
              can {}
              process the large amount of data produced by crypto protocols. CryptoStats, on the
              otherhand, {}
              has no infrastructure of it's own. CryptoStats aggregates data from indexers like The
              Graph, {}
              combines it, and provides trust assurances that the data is as accuate as possible.
            </Text>
          </Question>

          <Question question='4. How can I contribute to CryptoStats?'>
            <Text tag='p' type='description' mb='8'>
              CryptoStats wouldn't be possible without support from community members like yourself!
            </Text>
            <Text tag='p' type='description' mb='8'>
              If you're a developer, you may be interested in building and updating adapters. Check
              out {}
              <a href='https://forum.cryptostats.community'>our forum</a> to find protocols that
              need to {}
              be added or updated on CryptoStats, and then update them in{" "}
              <Link href='/editor'>the editor</Link>.
            </Text>
            <Text tag='p' type='description' mb='8'>
              If you're into data, you might just want to look through the existing adapters, find
              adapters {}
              that can be improved, or just discuss new metrics that could be tracked on our forum.
            </Text>
            <Text tag='p' type='description' mb='8'>
              And if you build websites or do data visualization, you can support CryptoStats by
              just building {}
              cool stuff that uses our data (and share CryptoStats as a source :D).
            </Text>
          </Question>
        </ColumnSection>
      </RowSection>
    </>
  )
}

export default FAQs

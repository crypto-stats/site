import Button from 'components/Button'
import Link from 'next/link'
import styled from 'styled-components'

const Container = styled.div`
  background-image: linear-gradient(180deg, rgba(12, 10, 29, 0) 0%, #0c0a1d 78.16%),
    url(/subeditor-screenshot.png);
  background-position: center;
  height: 70vh;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding-bottom: 50px;
  justify-content: flex-end;
  box-sizing: border-box;
  margin: 50px 0;
  background-repeat: no-repeat;
  align-items: center;
`

const Title = styled.h1`
  font-weight: 700;
  font-size: 52px;
  line-height: 56px;
  margin: 8px 0;

  @media (max-width: 768px) {
    font-size: 42px;
  }
`

const Description = styled.div`
  font-weight: 400;
  font-size: 24px;
  line-height: 37px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const Sup = styled.sub`
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

export default function SubgraphHero() {
  return (
    <Container>
      <Title>
        Subgraph editor <Sup>Beta</Sup>
      </Title>
      <Description>
        Cut through the noise
        <br />
        Leverage The Graph Protocol to extract any on-chain data
      </Description>

      <Link href="/editor/subgraph" passHref>
        <Button size="large">Try it out</Button>
      </Link>
    </Container>
  )
}

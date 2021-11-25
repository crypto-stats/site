import styled from 'styled-components'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Hero from 'components/home-sections/Hero'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Column = styled.div`
  max-width: 1248px;
  width: calc(100% - 12px);
`

export default function Home() {
  return (
    <Container>
      <Column>
        <Header />
      </Column>

      <Hero />

      <Footer />
    </Container>
  )
}

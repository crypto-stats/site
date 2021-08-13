import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url('/logo.svg');
  background-color: #012042;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding-top: 120px;
  color: white;
  font-family: sans-serif;
  text-align: center;
  font-size: 20px;
  line-height: 28px;
`

const Title = styled.h1`
  color: red;
  font-size: 50px;
`

export default function Home() {
  return (
    <Container>
      One neutral source of truth for crypto metrics.<br />
      Used by everyone, managed by the community.
    </Container>
  )
}

import styled from 'styled-components'
import Layout from 'components/Layout'

const Title = styled.h1`
  color: red;
  font-size: 50px;
`

export default function Home() {
  return (
    <Layout>
      <Title>My page</Title>
    </Layout>
  )
}

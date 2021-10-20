import { GetServerSideProps } from 'next'

export default function NullPage() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("location", "https://discord.gg/JJP974c9")
  res.statusCode = 302
  res.end()
  return { props: {} }
}

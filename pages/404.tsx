import { NextPage } from 'next'
import TranquilLayout from 'components/layouts/TranquilLayout'

const NotFound: NextPage = () => {
  return (
    <TranquilLayout
      hero={<h2>404: Not found</h2>}
    />
  )
}

export default NotFound

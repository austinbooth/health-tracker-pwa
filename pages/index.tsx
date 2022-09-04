import type { NextPage } from 'next'
import AuthedPage from '../components/AuthedPage'
import DataInput from '../components/DataInput'

const Home: NextPage = () => {
  return (
    <AuthedPage>
      <DataInput />
    </AuthedPage>
  )
}

export default Home

'use client'

import type { NextPage } from 'next'
import withAuth from '../HOCs/withAuth'
import DataInput from '../components/DataInput'

const Home: NextPage = () => {
  const DataInputProtected = withAuth(DataInput)
  return (
    <DataInputProtected />
  )
}

export default Home

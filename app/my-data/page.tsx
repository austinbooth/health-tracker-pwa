'use client'

import type { NextPage } from 'next'
import withAuth from '../../HOCs/withAuth'
import MyData from '../../components/MyData'

const Home: NextPage = () => {
  const MyDataProtected = withAuth(MyData)
  return (
    <MyDataProtected />
  )
}

export default Home

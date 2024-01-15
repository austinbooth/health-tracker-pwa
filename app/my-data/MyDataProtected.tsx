'use client'

import withAuth from '../../HOCs/withAuth'
import MyData from '../../components/MyData'

const MyDataProtected = withAuth(MyData)

export default MyDataProtected

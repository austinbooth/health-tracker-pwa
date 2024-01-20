'use client'

import withAuth from '../../HOCs/withAuth'
import MyData from './MyData'

const MyDataProtected = withAuth(MyData)

export default MyDataProtected

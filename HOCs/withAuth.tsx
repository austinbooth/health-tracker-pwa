/* eslint-disable react/display-name */
import { FC } from 'react'
import { useAuth } from '../app/providers/AuthContext'
import HomeLinkButton from '../app/header/HomeLinkButton'
import MyDataLinkButton from '../app/header/MyDataLinkButton'
import SignOutButton from '../app/header/SignOutButton'
import { useRouter } from 'next/navigation'
import Loading from '../components/Loading'

export interface WithAuthPageProps {
  userId: string
}

const withAuth = (Page: FC<WithAuthPageProps>) => {
  return () => {
    const { result } = useAuth()
    const router = useRouter()

    if (result.state === 'Loading') {
      return <Loading />
    }

    if (result.state !== 'Authed') {
      router.push('/signin')
      return <Loading />
    }
    
    return (
      <div className="px-8">
        <header>
          <HomeLinkButton />
          <MyDataLinkButton />
          <SignOutButton />
        </header>

        <main className="flex flex-col justify-center items-center py-16 h-[90vh]">
          <Page userId={result.session.user.id} />
        </main>

        <footer className="flex justify-center items-center grow border-t-[1px]">
          Generic footer
        </footer>
      </div>
    )
  }
}

export default withAuth

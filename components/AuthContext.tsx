import { FC, PropsWithChildren, createContext, useContext, useState, useEffect } from "react"
import supabase from '../supabaseSingleton'
import { Session, AuthError } from '@supabase/supabase-js'
import { useRouter } from 'next/router'

type Loading = {
  state: 'Loading'
}

type Authed = {
  state: 'Authed',
  session: Session
}

type NotAuthed = {
  state: 'NotAuthed'
}

type InProgress = {
  state: 'InProgress',
  message: string
}

type Errored = {
  state: 'Error',
  error: AuthError | Error
}

type AuthResult = Loading | Authed | NotAuthed | InProgress | Errored

export type Auth = {
  result: AuthResult
  initiateSignIn: (email: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<Auth | undefined>(undefined)

const AuthProvider: FC<PropsWithChildren> = ({children}) => {
  const router = useRouter()
  const [state, setState] = useState<AuthResult>({state: 'Loading'})
  useEffect(() => {
    supabase.auth.getSession().then(({data: { session }}) => {
      session ? setState({state: 'Authed', session}) : setState({state: 'NotAuthed'})
    })

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('>>>> auth state change')
      session
        ? (
            setState({state: 'Authed', session}),
            router.push('/')
          )
        : setState({state: 'NotAuthed'})

    }).data
    return subscription.unsubscribe
  }, [])

  const initiateSignIn = async (email: string) => {
    try {
      setState({state: 'Loading'})
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) {
        setState({
          state: 'Error',
          error,
        })
      } else {
        setState({
          state: 'InProgress',
          message: 'Check your email for the login link!',
        })
        alert('Check your email for the login link!')
      }
    } catch (error) {
      setState({
        state: 'Error',
        error: error instanceof Error ? error : new Error('An unknown error occured.'),
      })
    }
  }
  const contextValue: Auth = {
    initiateSignIn,
    result: state,
    signOut: async () => await supabase.auth.signOut()
  } 
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within the AuthProvider') 
  }
  return context
}

export default AuthProvider

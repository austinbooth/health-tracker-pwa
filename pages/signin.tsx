import type { NextPage } from 'next'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useAuth } from '../components/AuthContext'

const Signin: NextPage = () => {
  const [email, setEmail] = useState<string>('')
  const { initiateSignIn, result } = useAuth()
  return (
    <div className="px-8">
      <main className="flex flex-col justify-center items-center py-16 h-[90vh]">
        <TextField
          label="Email"
          id="email-input"
          sx={{ m: 1, width: '25ch' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="text"
          onClick={() => initiateSignIn(email)}
          disabled={result.state === 'Loading'}
        >
          Sign in
        </Button>
      </main>
    </div>
  )
}

export default Signin

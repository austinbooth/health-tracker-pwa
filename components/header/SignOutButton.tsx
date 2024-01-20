import { useAuth } from "../providers/AuthContext"
import Button from '@mui/material/Button'

export default function SignOutButton() {
  const { signOut, result } = useAuth()
  return (
    <Button
      variant="outlined"
      onClick={signOut}
      disabled={result.state !== 'Authed'}
    >
      Sign out
    </Button>
  )
}

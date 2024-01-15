import { useRouter, usePathname } from 'next/navigation'
import Button from '@mui/material/Button'

export default function HomeLinkButton() {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <Button
      variant="text"
      onClick={() => router.push('/')}
      disabled={pathname === '/'}
    >
      Home
    </Button>
  )
}

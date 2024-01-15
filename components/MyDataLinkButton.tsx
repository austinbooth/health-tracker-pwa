import { useRouter, usePathname } from 'next/navigation'
import Button from '@mui/material/Button'

export default function MyDataLinkButton() {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <Button
      variant="text"
      onClick={() => router.push('/my-data')}
      disabled={pathname === '/my-data'}
    >
      Your data
    </Button>
  )
}

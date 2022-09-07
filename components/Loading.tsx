import CircularProgress from '@mui/material/CircularProgress'

export default function Loading() {
  return (
  <div className="flex flex-col justify-center items-center py-16 h-screen">
    <CircularProgress />
  </div>
  )
}

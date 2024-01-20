import { FC, PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const QueryProvider: FC<PropsWithChildren> = ({children}) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

export default QueryProvider

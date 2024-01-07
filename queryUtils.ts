import { useQuery, useMutation } from '@tanstack/react-query'
import { getValuesForUserAndDate, submitValuesToDb, getValuesForUser } from './subabaseUtils'
import { ValuesFromDB } from './types'

export const useGetValuesForUserAndDateQuery = ({ userId, date }: { userId: string, date: string }) => useQuery({
  queryKey: ['getValuesForUserAndDate', { userId, date }],
  queryFn: async () => {
    const dataFromDb = await getValuesForUserAndDate({ userId, date })
    return dataFromDb ?? {
      date: '',
      notes: '',
      steps: null,
      user: '',
      weight_kg: null,
    }
  },
})

export const useUpdateValuesForUserAndDateMutation = () => useMutation({
  mutationFn: submitValuesToDb
})

export const useGetValuesForUser = (userId: string) => useQuery({
  queryKey: ['getValuesForUser', { userId }],
  queryFn: async (): Promise<ValuesFromDB[]> => {
    const dataFromDb = await getValuesForUser(userId)
    return dataFromDb ?? []
  },
})

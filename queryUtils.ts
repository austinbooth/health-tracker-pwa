import { useQuery, useMutation } from '@tanstack/react-query'
import { getValuesForUserAndDate, submitValuesToDb } from './subabaseUtils'

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

import supabase from './supabaseSingleton'
import { PostgrestResponse } from '@supabase/supabase-js'
import { ValuesFromDB } from './types'

interface SubmitValuesToDbProps {userId: string, date: string, weight_kg: number, steps: number}
export const submitValuesToDb = async ({
  userId,
  date, // yyyy-mm-dd
  weight_kg, steps
}: SubmitValuesToDbProps): Promise<PostgrestResponse<undefined>> => await supabase.from('data').upsert({
    user: userId,
    date,
    weight_kg,
    steps,
})

export const getValuesForUserAndDate = async ({
  userId,
  date
}: { userId: string, date: string }): Promise<ValuesFromDB | void> => {
  const { data }: PostgrestResponse<ValuesFromDB> = await supabase.from('data').select().eq('user', userId).eq('date', date)
  if (data) {
    return data[0]
  }
}

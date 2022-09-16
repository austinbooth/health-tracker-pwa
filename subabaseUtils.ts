import supabase from './supabaseSingleton'
import { PostgrestResponse } from '@supabase/supabase-js'
import { ValuesFromDB } from './types'

interface SubmitValuesToDbProps {userId: string, date: string, weight_kg: number, steps: number, notes: string}
export const submitValuesToDb = async ({
  userId,
  date, // yyyy-mm-dd
  weight_kg,
  steps,
  notes,
}: SubmitValuesToDbProps): Promise<PostgrestResponse<undefined>> => await supabase.from('data').upsert({
    user: userId,
    date,
    weight_kg,
    steps,
    notes,
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

export const getValuesForUser = async (userId: string): Promise<ValuesFromDB[] | undefined> => {
  const { data }: PostgrestResponse<ValuesFromDB> = await supabase.from('data').select().eq('user', userId)
  return data
}
// TODO pagination
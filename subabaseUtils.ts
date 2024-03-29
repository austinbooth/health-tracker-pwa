import supabase from './supabaseSingleton'
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js'
import { ValuesFromDB } from './types'

export interface SubmitValuesToDbProps {userId: string, date: string, weight_kg: number, steps: number, notes: string}
export const submitValuesToDb = async ({
  userId,
  date, // yyyy-mm-dd
  weight_kg,
  steps,
  notes,
}: SubmitValuesToDbProps): Promise<PostgrestSingleResponse<null>> => await supabase.from('data').upsert({
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

export const getValuesForUser = async (userId: string): Promise<ValuesFromDB[] | null> => {
  const { data }: PostgrestResponse<ValuesFromDB> = await supabase
    .from('data')
    .select()
    .eq('user', userId)
    .order('date', { ascending: false })
  return data
}
// TODO pagination
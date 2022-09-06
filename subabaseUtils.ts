import supabase from './supabaseSingleton'
import { PostgrestResponse } from '@supabase/supabase-js'

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

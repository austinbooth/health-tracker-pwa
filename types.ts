export interface ValuesFromDB {
    user: string,
    date: string,
    weight_kg: string | null
    steps: string | null
}

export type Loading = {
    state: 'Loading',
  }
  
export type Complete = {
    state: 'Complete',
    data: ValuesFromDB[],
  }
  
export type Errored = {
    state: 'Errored',
    error: Error,
  }
  
export type State = Loading | Complete | Errored
  
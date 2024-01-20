export interface ValuesFromDB {
  user: string,
  date: string,
  weight_kg: string | null
  steps: string | null
  notes: string | null
}

export interface DataItemForTable {
  averageWeight: number;
  averageDailySteps: number;
  data: ValuesFromDB[];
  yearWeek: string;
  changeInAverageWeight: number | null;
}

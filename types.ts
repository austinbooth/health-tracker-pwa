export interface ValuesFromDB {
  user: string,
  date: string,
  weight_kg: string | null
  steps: string | null
  notes: string | null
}

export interface DataItemForTable {
  averageWeight: string;
  averageDailySteps: string;
  data: ValuesFromDB[];
  yearWeek: string;
  changeInAverageWeight: string | null;
}

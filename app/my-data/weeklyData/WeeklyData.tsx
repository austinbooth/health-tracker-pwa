import { FC, useMemo } from 'react'
import { useGetValuesForUser } from '../../../queryUtils'
import getWeeklyAverages, { GroupedDataWithAverages } from './groupData'
import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'
import { DataItemForTable } from '../../../types'
import Table from '../../../components/Table'

interface Props {
  userId: string
}

const WeeklyData: FC<Props> = ({userId}) => {
  const { data, isError, isLoading } = useGetValuesForUser(userId)

  const groupedAvgDataByWeek = useMemo(() => getWeeklyAverages(data ?? []), [data])
  const weightDecreases = useMemo(() => calculateWeeklyWeightDecrease(groupedAvgDataByWeek), [groupedAvgDataByWeek])

  const dataForTable: DataItemForTable[] = useMemo(() => Object.entries(groupedAvgDataByWeek).map(([yearWeek, averages]) => {
    return {
      yearWeek,
      averageWeight: averages.averageWeight?.toString() ?? null,
      averageDailySteps: averages.averageDailySteps.toString(),
      data: averages.data,
      changeInAverageWeight: weightDecreases[yearWeek] ?? null,
    }
  }), [groupedAvgDataByWeek, weightDecreases])

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching data</div>

  return <Table columns={columns} data={dataForTable} />
}

export default WeeklyData

const columnHelper = createColumnHelper<DataItemForTable>()

const columns: ColumnDef<DataItemForTable, string>[] = [
  columnHelper.accessor('yearWeek', {
    header: () => 'W/C',
    cell: info => DateTime.fromObject({
      weekYear: parseInt(info.row.original.yearWeek.slice(0, 4)),
      weekNumber: parseInt(info.row.original.yearWeek.slice(5, 7)),
    }).toFormat('dd LLL yy'),
  }),
  columnHelper.accessor('averageWeight', {
    header: () => 'Avg Weight (kg)',
  }),
  columnHelper.accessor('averageDailySteps', {
    header: () => 'Avg Daily Steps',
  }),
  columnHelper.accessor('changeInAverageWeight', {
    header: () => 'Weight change (kg)',
  }),
]

export function calculateWeeklyWeightDecrease(data: GroupedDataWithAverages): {[yearWeek: string]: string | null} {
  let weightDecreases: {[yearWeek: string]: string | null} = {}

  const sortedWeeks = Object.keys(data).sort((a, b) => {
    const [yearA, weekA] = a.split('-').map(Number);
    const [yearB, weekB] = b.split('-').map(Number);
    
    if (yearA !== yearB) {
      return yearA - yearB;
    }
    
    return weekA - weekB;
  })

  for (let i = 1; i < sortedWeeks.length; i++) {
    const currentWeek = sortedWeeks[i]
    const previousWeek = sortedWeeks[i - 1]

    const decrease = calculateDecrease(data[previousWeek].averageWeight, data[currentWeek].averageWeight)
    weightDecreases[currentWeek] = decrease?.toFixed(1) ?? null;
  }

  return weightDecreases
}

function calculateDecrease(previous: number | null, current: number | null): number | null {
  if (previous === null || current === null) return null
  return previous - current
}

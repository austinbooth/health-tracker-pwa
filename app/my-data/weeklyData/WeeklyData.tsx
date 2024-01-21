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
      averageWeight: averages.averageWeight.toString(),
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

export function calculateWeeklyWeightDecrease(data: GroupedDataWithAverages): {[yearWeek: string]: string} {
  let weightDecreases: {[yearWeek: string]: string} = {}
  
  const sortedWeeks = Object.keys(data).sort((a, b) => a.localeCompare(b))

  for (let i = 1; i < sortedWeeks.length; i++) {
    const currentWeek = sortedWeeks[i]
    const previousWeek = sortedWeeks[i - 1]

    const decrease = data[previousWeek].averageWeight - data[currentWeek].averageWeight
    weightDecreases[currentWeek] = parseFloat(decrease.toFixed(1)).toString()
  }

  return weightDecreases
}

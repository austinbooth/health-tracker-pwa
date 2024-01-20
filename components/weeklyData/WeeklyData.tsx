import { FC } from 'react'
import { useGetValuesForUser } from '../../queryUtils'
import getWeeklyAverages, { GroupedDataWithAverages } from './groupData'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { DateTime } from 'luxon'
import { DataItemForTable } from '../../types'

interface Props {
  userId: string
}

const WeeklyData: FC<Props> = ({userId}) => {
  const { data, isError, isLoading } = useGetValuesForUser(userId)

  const groupedAvgDataByWeek = getWeeklyAverages(data ?? [])

  console.log(groupedAvgDataByWeek)

  const dataEntries = Object.entries(groupedAvgDataByWeek)

  const weightDecreases = calculateWeeklyWeightDecrease(groupedAvgDataByWeek)
  console.log('weightDecrease:', weightDecreases)

  const dataForTable: DataItemForTable[] = dataEntries.map(([yearWeek, averages], index) => {
    return {
      yearWeek,
      ...averages,
      changeInAverageWeight: weightDecreases[yearWeek] ?? null,
    }
  })

  const table = useReactTable({
    data: dataForTable ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching data</div>

  return (
    <div className='flex justify-center'>
      <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="bg-white odd:bg-gray-100 hover:bg-gray-200">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} style={{textAlign: 'center'}}>
                    {flexRender(cell.column.columnDef.cell as any, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer as any,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
  )
}

export default WeeklyData

const columnHelper = createColumnHelper<DataItemForTable>()

const columns = [
  columnHelper.accessor('yearWeek', {
    header: () => 'W/C',
    cell: info => DateTime.fromObject({
      weekYear: parseInt(info.row.original.yearWeek.slice(0, 4)),
      weekNumber: parseInt(info.row.original.yearWeek.slice(5, 7)),
    }).toFormat('dd-MM-yy'),
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

function calculateWeeklyWeightDecrease(data: GroupedDataWithAverages): {[yearWeek: string]: number} {
  let weightDecreases: {[yearWeek: string]: number} = {};
  
  const sortedWeeks = Object.keys(data).sort((a, b) => a.localeCompare(b)); // is sorting needed here?

  for (let i = 1; i < sortedWeeks.length; i++) {
    const currentWeek = sortedWeeks[i];
    const previousWeek = sortedWeeks[i - 1];

    const decrease = data[previousWeek].averageWeight - data[currentWeek].averageWeight;
    weightDecreases[currentWeek] = parseFloat(decrease.toFixed(1));
  }

  return weightDecreases;
}

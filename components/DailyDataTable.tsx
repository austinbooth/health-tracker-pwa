import { FC } from 'react'
import { useGetValuesForUser } from '../queryUtils'
import { DateTime } from 'luxon'
import { ValuesFromDB } from '../types'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

interface Props {
  userId: string
}
const DailyDataTable: FC<Props> = ({userId}) => {
  const { data, isError, isLoading } = useGetValuesForUser(userId)
  
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching data</div>

  return (
    <div className='flex justify-center'>
      <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                          header.column.columnDef.footer,
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

export default DailyDataTable

const columnHelper = createColumnHelper<ValuesFromDB>()

const columns = [
  columnHelper.accessor('date', {
    header: () => 'Date',
    cell: info => DateTime.fromFormat(info.getValue(), 'yyyy-LL-dd').toFormat('dd LLL yy'),  
  }),
  columnHelper.accessor('weight_kg', {
    header: () => 'Weight (kg)',
    cell: info => info.renderValue(),
  }),
  columnHelper.accessor('steps', {
    header: () => 'Steps',
  }),
  columnHelper.accessor('notes', {
    header: () => 'Notes',
  }),
]

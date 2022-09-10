import { FC, useState, useEffect } from 'react'
import { getValuesForUser } from '../subabaseUtils'
import { DateTime } from 'luxon'
import { ValuesFromDB, State } from '../types'
import Loading from './Loading'
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
  const [result, setResult] = useState<State>({ state: 'Loading'})

  useEffect(() => {
    getValuesForUser(userId)
      .then((data) => {
        setResult({ state: 'Complete', data: data ?? []})
      })
      .catch((error: unknown) => {
        setResult({
          state: 'Errored',
          error: error instanceof Error ? error : new Error('An unknown error occured')
        })
      })
  }, [])

  const table = useReactTable({
    data: result.state === 'Complete' ? result.data : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (result.state === 'Loading') {
    return <Loading />
  }

  if (result.state === 'Errored') {
    return <p>{`Error: ${result.error.message}`}</p>
  }

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
    cell: info => DateTime.fromFormat(info.getValue(), 'yyyy-LL-dd').toFormat('d LLL'),  
  }),
  columnHelper.accessor('weight_kg', {
    header: () => 'Weight (kg)',
    cell: info => info.renderValue(),
  }),
  columnHelper.accessor('steps', {
    header: () => 'Steps',
  }),
]

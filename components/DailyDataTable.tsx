import { FC } from 'react'
import { useGetValuesForUser } from '../queryUtils'
import { DateTime } from 'luxon'
import { ValuesFromDB } from '../types'
import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import Table from './Table'

interface Props {
  userId: string
}
const DailyDataTable: FC<Props> = ({userId}) => {
  const { data, isError, isLoading } = useGetValuesForUser(userId)

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching data</div>

  return <Table columns={columns} data={data} />
}

export default DailyDataTable

const columnHelper = createColumnHelper<ValuesFromDB>()

const columns: ColumnDef<ValuesFromDB, string>[] = [
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

import { Dispatch, SetStateAction } from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { DateTime } from 'luxon'

interface Props {
  selectedDate: DateTime
  setSelectedDate: Dispatch<SetStateAction<DateTime>>
}
export default function DateDisplayWithControls({ selectedDate, setSelectedDate }: Props) {
  return (
    <>
      <h1 className="text-2xl font-bold py-4 ">
        {selectedDate.toFormat('cccc d LLLL')}
      </h1>
      <div className="flex flex-row items-center gap-4">
        <ArrowBackIosNewIcon onClick={() => setSelectedDate(selectedDate.minus({day: 1}))} />
        <ArrowForwardIosIcon onClick={() => setSelectedDate(selectedDate.plus({day: 1}))} />
      </div>
    </>
  )
}

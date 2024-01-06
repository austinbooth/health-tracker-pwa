import { FC, useState, forwardRef } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import NumberFormat, { InputAttributes } from 'react-number-format'
import Button from '@mui/material/Button'
import { useGetValuesForUserAndDateQuery, useUpdateValuesForUserAndDateMutation } from '../queryUtils'
import { WithAuthPageProps } from '../HOCs/withAuth'
import DateDisplayWithControls from './DateDisplayWithControls'
import { DateTime } from 'luxon'

interface Values {
  weight: string
  steps: string
  notes: string
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumberFormatCustom = forwardRef<
    NumberFormat<InputAttributes>,
    CustomProps
  >(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
      />
    );
  });

const getPostgresDate = (dateTime: DateTime): string => dateTime.toFormat('yyyy-LL-dd') // yyyy-mm-dd

const DataInput: FC<WithAuthPageProps> = ({userId}) => {
  const [newValues, setNewValues] = useState<Values>({
    weight: '',
    steps: '',
    notes: '',
  })
  const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.now())
  
  const handleChange = (prop: keyof Values) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewValues((current) => ({ ...current, [prop]: event.target.value }))
  } 

  const { data: values, isLoading, isError } = useGetValuesForUserAndDateQuery({ userId, date: getPostgresDate(selectedDate) })
  const updateValuesForUserAndDateMutation = useUpdateValuesForUserAndDateMutation()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching data</div>
  
  return (
    <>
      <DateDisplayWithControls selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <TextField
        label="Weight"
        id="weight-input"
        InputProps={{
          inputComponent: NumberFormatCustom as any,
          endAdornment: <InputAdornment position="end">kg</InputAdornment>,
        }}
        sx={{ m: 1, width: '12ch' }}
        value={newValues.weight.length ? newValues.weight : values?.weight_kg ?? ''}
        onChange={handleChange('weight')}
      />
      <TextField
        label="Steps"
        id="steps-input"
        sx={{ m: 1, width: '12ch' }}
        value={newValues.steps.length ? newValues.steps : values?.steps  ?? ''}
        onChange={handleChange('steps')}
        name="numberformat"
        InputProps={{ inputComponent: NumberFormatCustom as any }}
      />
      <TextField
        label="Notes"
        id="notes-input"
        sx={{ m: 1, width: '12ch' }}
        value={newValues.notes.length ? newValues.notes : values?.notes ?? ''}
        onChange={handleChange('notes')}
      />
      <Button
        variant="text"
        onClick={() => {
          const date = getPostgresDate(selectedDate)
          const weight_kg = newValues.weight.length ? parseFloat(newValues.weight) : parseFloat(values?.weight_kg ?? '')
          const steps = newValues.steps.length ? parseInt(newValues.steps) : parseFloat(values?.steps ?? '')
          const notes = newValues.notes.length ? newValues.notes : values?.notes ?? ''

          updateValuesForUserAndDateMutation.mutate({
              date,
              userId,
              weight_kg,
              steps,
              notes,
            })
          alert(`Weight: ${weight_kg}, steps: ${steps} - submitted to DB`)
        }}
      >
        Submit
      </Button>
    </>
  )
}

export default DataInput

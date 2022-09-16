import { FC, useState, forwardRef, useEffect } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import NumberFormat, { InputAttributes } from 'react-number-format'
import Button from '@mui/material/Button'
import { submitValuesToDb, getValuesForUserAndDate } from '../subabaseUtils'
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
  const [values, setValues] = useState<Values>({
    weight: '',
    steps: '',
    notes: '',
  })
  const [selectedDate, setSelectedData] = useState<DateTime>(DateTime.now())
  
  const handleChange = (prop: keyof Values) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [prop]: event.target.value }))
  }
  
  useEffect(() => {
    getValuesForUserAndDate({ userId, date: getPostgresDate(selectedDate)})
      .then((data) => {
        setValues({
          weight: data?.weight_kg ?? '',
          steps: data?.steps ?? '',
          notes: data?.notes ?? '',
        })
      })
  }, [selectedDate])

  return (
    <>
      <DateDisplayWithControls selectedDate={selectedDate} setSelectedDate={setSelectedData} />
      <TextField
        label="Weight"
        id="weight-input"
        InputProps={{
          inputComponent: NumberFormatCustom as any,
          endAdornment: <InputAdornment position="end">kg</InputAdornment>,
        }}
        sx={{ m: 1, width: '12ch' }}
        value={values.weight}
        onChange={handleChange('weight')}
      />
      <TextField
        label="Steps"
        id="steps-input"
        sx={{ m: 1, width: '12ch' }}
        value={values.steps}
        onChange={handleChange('steps')}
        name="numberformat"
        InputProps={{ inputComponent: NumberFormatCustom as any }}
      />
      <TextField
        label="Notes"
        id="notes-input"
        sx={{ m: 1, width: '12ch' }}
        value={values.notes}
        onChange={handleChange('notes')}
      />
      <Button
        variant="text"
        onClick={() => {
          const date = getPostgresDate(selectedDate)
          submitValuesToDb({
            date,
            userId,
            weight_kg: parseFloat(values.weight),
            steps: parseInt(values.steps),
            notes: values.notes,
          })
          alert(`Weight: ${values.weight}, steps: ${values.steps} - submitted to DB`)
        }}
      >
        Submit
      </Button>
    </>
  )
}

export default DataInput

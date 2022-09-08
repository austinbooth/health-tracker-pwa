import { FC, useState, forwardRef, useEffect } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import NumberFormat, { InputAttributes } from 'react-number-format'
import Button from '@mui/material/Button'
import { submitValuesToDb, getValuesForUserAndDate } from '../subabaseUtils'
import { WithAuthPageProps } from '../HOCs/withAuth'

interface Values {
  weight: string
  steps: string
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

const getPostgresDate = (): string => {
  const dateObj = new Date()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  const year = dateObj.getFullYear()
  const date = year + "-" + month + "-" + day
  return date
}

const DataInput: FC<WithAuthPageProps> = ({userId}) => {
  const [values, setValues] = useState<Values>({
    weight: '',
    steps: ''
  })
  
  const todaysDate = new Date().toLocaleString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })
  const handleChange = (prop: keyof Values) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [prop]: event.target.value }))
  }
  
  useEffect(() => {
    getValuesForUserAndDate({ userId, date: getPostgresDate()})
      .then((data) => {
        if (data) {
          setValues({
            weight: data.weight_kg ?? '',
            steps: data.steps ?? '',
          })
        }
      })
  }, [todaysDate])

  return (
    <>
      <h1 className="text-2xl font-bold py-4">
          {todaysDate}
      </h1>
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
      <Button
        variant="text"
        onClick={() => {
          const date = getPostgresDate()
          submitValuesToDb({
            date,
            userId,
            weight_kg: parseFloat(values.weight),
            steps: parseInt(values.steps),
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

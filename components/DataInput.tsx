import { FC, useState, forwardRef } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import NumberFormat, { InputAttributes } from 'react-number-format'
import Button from '@mui/material/Button'

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

const DataInput: FC = () => {
  const [values, setValues] = useState<Values>({
    weight: '',
    steps: ''
  })
  
  const todaysDate = new Date().toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const handleChange = (prop: keyof Values) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [prop]: event.target.value }))
  }
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
          alert(`Weight: ${values.weight}, steps: ${values.steps}`)
        }}
      >
        Submit
      </Button>
    </>
  )
}

export default DataInput

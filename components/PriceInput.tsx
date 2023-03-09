import { Stack, TextField, InputAdornment } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { RentalModel } from '../types/rentals';

export default function PriceInput({
  control,
}: {
  control: Control<RentalModel>;
}): JSX.Element {
  return (
    <Stack direction="row" spacing={2}>
      <Controller
        name={'price.oneDay'}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="1 Day"
            type="number"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        )}
      />

      <Controller
        name={'price.threeDay'}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="3 Day"
            type="number"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        )}
      />

      <Controller
        name={'price.sevenDay'}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="7 Day"
            type="number"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        )}
      />
    </Stack>
  );
}

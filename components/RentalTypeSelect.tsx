import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  OutlinedInput,
  Box,
  Chip,
  FormHelperText,
} from '@mui/material';
import { Control, useFieldArray } from 'react-hook-form';
import { RENTAL_TYPE } from '../constants/rentals';
import { RentalModel } from '../types/rentals';

export default function RentalTypeSelect({
  control,
  error,
}: {
  control: Control<RentalModel>;
  error?: string;
}): JSX.Element {
  const { fields, replace } = useFieldArray({
    control,
    name: 'types',
  });

  const types: string[] = fields.map(({ type }) => type);

  const handleTypeChange = (event: SelectChangeEvent<typeof types>) => {
    const {
      target: { value },
    } = event;
    const newTypes = typeof value === 'string' ? value.split(',') : value;
    replace(newTypes.map((type) => ({ type })));
  };

  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel>Type</InputLabel>
      <Select
        error={!!error}
        label="Type"
        fullWidth
        value={types}
        onChange={handleTypeChange}
        multiple
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {Object.values(RENTAL_TYPE).map((rentalType) => (
          <MenuItem key={rentalType} value={rentalType}>
            {rentalType}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{error || ''}</FormHelperText>
    </FormControl>
  );
}

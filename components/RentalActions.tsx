import { Search, Clear } from '@mui/icons-material';
import {
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import { ChangeEvent } from 'react';
import { LOCATION } from '../constants/locations';
import { Location } from '../types/locations';

type Props = {
  location: Location;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onLocationChange: (location: Location) => void;
};

export default function RentalActions({
  location,
  searchValue,
  onSearchChange,
  onLocationChange,
}: Props): JSX.Element {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleClearClick = () => onSearchChange('');

  const handleLocationChange = (e: SelectChangeEvent) => {
    const newLocation: Location = JSON.parse(e.target.value);
    onLocationChange(newLocation);
  };

  return (
    <Stack
      direction="row"
      my={2}
      justifyContent="space-between"
      alignItems="flex-end"
    >
      <FormControl variant="standard">
        <Select
          fullWidth
          value={JSON.stringify(location)}
          onChange={handleLocationChange}
        >
          {Object.values(LOCATION).map((l) => (
            <MenuItem key={JSON.stringify(l)} value={JSON.stringify(l)}>
              {l.city}, {l.state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        placeholder="Search by name"
        variant="standard"
        onChange={handleSearchChange}
        value={searchValue}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {searchValue ? (
                <IconButton onClick={handleClearClick}>
                  <Clear />
                </IconButton>
              ) : (
                <Search />
              )}
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}

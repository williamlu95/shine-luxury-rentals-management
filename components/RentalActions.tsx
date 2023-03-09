import { Search, Clear, Add } from '@mui/icons-material';
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { ChangeEvent } from 'react';

type Props = {
  searchValue: string;
  hideAddButton: boolean;
  onSearchChange: (value: string) => void;
  onAddRentalClick: () => void;
};

export default function RentalActions({
  hideAddButton,
  searchValue,
  onSearchChange,
  onAddRentalClick,
}: Props): JSX.Element {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleClearClick = () => onSearchChange('');

  return (
    <Stack
      direction="row"
      my={2}
      justifyContent="space-between"
      alignItems="flex-end"
    >
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

      {!hideAddButton && (
        <Button onClick={onAddRentalClick}>
          <Add />
          Add Rental
        </Button>
      )}
    </Stack>
  );
}

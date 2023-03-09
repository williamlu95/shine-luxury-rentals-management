import { Search, Clear } from '@mui/icons-material';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { ChangeEvent } from 'react';

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export default function UserActions({
  searchValue,
  onSearchChange,
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
        placeholder="Search by name or email"
        variant="standard"
        sx={{ width: 250 }}
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

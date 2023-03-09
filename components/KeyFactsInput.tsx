import { Delete } from '@mui/icons-material';
import { TextField, Stack, IconButton } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { RentalModel } from '../types/rentals';

export default function KeyFactsInput({
  index,
  control,
  hideRemoveButton,
  onRemoveClick,
}: {
  index: number;
  control: Control<RentalModel>;
  hideRemoveButton?: boolean;
  onRemoveClick: (index: number) => void;
}): JSX.Element {
  const handleRemoveClick = () => onRemoveClick(index);

  return (
    <>
      <Stack>
        <Stack direction="row" spacing={2}>
          <Controller
            name={`keyFacts.${index}.fact`}
            control={control}
            render={({ field }) => <TextField {...field} fullWidth />}
          />

          {hideRemoveButton ? (
            <></>
          ) : (
            <IconButton onClick={handleRemoveClick}>
              <Delete />
            </IconButton>
          )}
        </Stack>
      </Stack>
    </>
  );
}

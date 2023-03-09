import { Close } from '@mui/icons-material';
import { Drawer, Typography, Button, Stack, IconButton } from '@mui/material';
import { useState } from 'react';
import useRentalService from '../hooks/useRentalService';
import { RentalModel } from '../types/rentals';
import ConfirmationPopup from './ConfirmationPopup';
import RentalForm from './RentalForm';

type Props = {
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
};

export default function AddRentalOverlay({ isOpen, onClose }: Props) {
  const { createRental } = useRentalService();
  const [isUnsavedConfirmOpen, setIsUnsavedConfirmOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const onSubmit = async (data: RentalModel) => {
    const isCreated = await createRental(data);

    if (isCreated) {
      onClose(true);
    }
  };

  const handleDrawerClose = () => {
    if (!isFormDirty) {
      onClose(false);
      return;
    }

    setIsUnsavedConfirmOpen(true);
  };

  const handleFormDirty = (isDirty: boolean) => {
    setIsFormDirty(isDirty);
  };

  const handleUnsavedConfirm = (isConfirmed: boolean) => {
    setIsUnsavedConfirmOpen(false);

    if (!isConfirmed) {
      return;
    }

    onClose(false);
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleDrawerClose}
      PaperProps={{ sx: { width: { xs: '100%', md: '50%' } } }}
    >
      <ConfirmationPopup
        isOpen={isUnsavedConfirmOpen}
        title="You have unsaved changes."
        description="All unsaved changes will be lost."
        onConfirm={handleUnsavedConfirm}
      />
      <Stack p={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography variant="h6" pb={2}>
            Add Rental
          </Typography>

          <IconButton onClick={() => onClose(false)}>
            <Close />
          </IconButton>
        </Stack>
        <RentalForm onSubmit={onSubmit} onDirty={handleFormDirty}>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </RentalForm>
      </Stack>
    </Drawer>
  );
}

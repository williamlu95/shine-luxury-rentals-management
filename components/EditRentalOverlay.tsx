import { Drawer, Typography, Button, Stack, IconButton } from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import useRentalService from '../hooks/useRentalService';
import { RentalModel } from '../types/rentals';
import RentalForm from './RentalForm';
import ConfirmationPopup from './ConfirmationPopup';
import { useState } from 'react';
import { Location } from '../types/locations';

type Props = {
  rental?: RentalModel;
  location: Location;
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
};

export default function EditRentalOverlay({
  rental,
  location,
  isOpen,
  onClose,
}: Props) {
  const { updateRental, deleteRental } = useRentalService();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isUnsavedConfirmOpen, setIsUnsavedConfirmOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const onSubmit = async (data: RentalModel) => {
    if (!rental?._id) {
      return;
    }

    const isUpdated = await updateRental(rental._id, data, location);

    if (isUpdated) {
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

  const handleDeleteConfirm = async (hasConfirmed: boolean) => {
    setIsDeleteConfirmOpen(false);

    if (!rental?._id || !hasConfirmed) {
      return;
    }

    const isDeleted = await deleteRental(rental._id);

    if (isDeleted) {
      onClose(true);
    }
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
      open={rental && isOpen}
      onClose={handleDrawerClose}
      PaperProps={{ sx: { width: { xs: '100%', md: '50%' } } }}
    >
      <ConfirmationPopup
        isOpen={isDeleteConfirmOpen}
        title={`Delete ${rental?.name}?`}
        description="This will permanently remove this rental from the customer website as well."
        onConfirm={handleDeleteConfirm}
      />
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
          pb={2}
        >
          <Stack direction="row" alignItems="center">
            <Typography variant="h6">Edit Rental</Typography>
            <IconButton onClick={() => setIsDeleteConfirmOpen(true)}>
              <Delete />
            </IconButton>
          </Stack>

          <IconButton onClick={() => onClose(false)}>
            <Close />
          </IconButton>
        </Stack>

        <RentalForm
          rental={rental}
          onDirty={handleFormDirty}
          onSubmit={onSubmit}
        >
          <Button variant="contained" type="submit">
            Save
          </Button>
        </RentalForm>
      </Stack>
    </Drawer>
  );
}

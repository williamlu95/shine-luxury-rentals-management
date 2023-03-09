import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  DialogContentText,
  DialogContent,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useState } from 'react';
import { USER_ROLE } from '../constants/users';
import useUserService from '../hooks/useUserService';
import { UserModel } from '../types/user';

type Props = {
  user?: UserModel;
  pageUserRole: string;
  isOpen: boolean;
  onConfirm: (hasConfirmed: boolean) => void;
};

export default function EditRolePopup({
  user,
  isOpen,
  pageUserRole,
  onConfirm,
}: Props): JSX.Element {
  const { updateUserRole } = useUserService();
  const [role, setRole] = useState(user?.role || '');

  const handleCancel = () => {
    onConfirm(false);
  };

  const handleConfirm = async () => {
    await updateUserRole(user?._id || '', role);
    onConfirm(true);
  };

  const handleUserRoleChange = (e: SelectChangeEvent) => {
    setRole(e.target.value);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Edit User Role</DialogTitle>
      <DialogContent>
        <DialogContentText pb={2} id="alert-dialog-description">
          Choose from the dropdown below to change a users given role.
        </DialogContentText>

        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            fullWidth
            value={role}
            onChange={handleUserRoleChange}
          >
            <MenuItem value="member">Member</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            {pageUserRole === USER_ROLE.SUPER_ADMIN && (
              <MenuItem value="super_admin">Super Admin</MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleConfirm} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

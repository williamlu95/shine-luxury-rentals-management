import {
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  TableSortLabel,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useState } from 'react';
import { UserModel } from '../types/user';

type Props = {
  users: UserModel[];
  onUserEditRoleClick: (user: UserModel) => void;
};

export default function UserTable({ users, onUserEditRoleClick }: Props) {
  const [isAscendingName, setIsAscendingName] = useState(true);
  const [contextUser, setContextUser] = useState<UserModel>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleUserEditRoleClick = () => {
    setAnchorEl(null);

    if (!contextUser) {
      return;
    }

    onUserEditRoleClick(contextUser);
    setContextUser(undefined);
  };

  const handleClick =
    (user: UserModel) => (event: React.MouseEvent<HTMLElement>) => {
      setContextUser(user);
      setAnchorEl(event.currentTarget);
    };

  const handleClose = () => {
    setAnchorEl(null);
    setContextUser(undefined);
  };

  const getSorterdUsers = () =>
    [...users].sort((a, b) =>
      isAscendingName
        ? `${a.givenName}${a.familyName}`.localeCompare(
            `${b.givenName}${b.familyName}`,
          )
        : `${b.givenName}${b.familyName}`.localeCompare(
            `${a.givenName}${a.familyName}`,
          ),
    );

  const formatRole = (role: string) => {
    const roles = role.split('_');

    return roles
      .map((role) => `${role[0].toUpperCase()}${role.slice(1)}`)
      .join(' ');
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="Table of users">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={true}
                  direction={isAscendingName ? 'asc' : 'desc'}
                  onClick={() =>
                    setIsAscendingName((isAscendingName) => !isAscendingName)
                  }
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {getSorterdUsers().map((user) => (
              <TableRow
                key={user._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.givenName} {user.familyName}
                </TableCell>
                <TableCell component="th" scope="row">
                  {user.email}
                </TableCell>
                <TableCell component="th" scope="row">
                  {formatRole(user.role)}
                </TableCell>
                <TableCell component="th" scope="row">
                  <IconButton
                    id="long-button"
                    aria-haspopup="true"
                    onClick={handleClick(user)}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    PaperProps={{ elevation: 1 }}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleUserEditRoleClick}>
                      Edit Role
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

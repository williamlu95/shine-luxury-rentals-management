import {
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Typography,
  Stack,
  TableSortLabel,
  Box,
} from '@mui/material';
import { RentalModel } from '../types/rentals';
import { ChevronRight, Add } from '@mui/icons-material';
import { format } from 'date-fns';
import { useState } from 'react';

type Props = {
  isEditable: boolean;
  rentals: RentalModel[];
  onRentalClick: (rental: RentalModel) => void;
  onAddRentalClick: () => void;
};

export default function RentalTable({
  isEditable,
  rentals,
  onRentalClick,
  onAddRentalClick,
}: Props) {
  const [isAscendingName, setIsAscendingName] = useState(true);

  const handleRentalClick = (rental: RentalModel) => () => {
    onRentalClick(rental);
  };

  const renderEmptyMessage = () =>
    !rentals.length ? (
      <Stack height={100} alignItems="center" justifyContent="center">
        <Typography>
          You have no rentals. Add some to see it in this list!
        </Typography>
      </Stack>
    ) : (
      <></>
    );

  const getSortedRentals = () =>
    [...rentals].sort((a, b) =>
      isAscendingName
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );

  return (
    <>
      <TableContainer component={Paper}>
        <Table
          stickyHeader
          aria-label="Table of rentals"
          sx={{ tableLayout: 'fixed' }}
        >
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
              <TableCell>Description</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell padding="checkbox">
                {isEditable && (
                  <IconButton onClick={onAddRentalClick}>
                    <Add />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSortedRentals().map((rental) => (
              <TableRow
                key={rental._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {rental.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Box
                    sx={{
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {rental.description}
                    {rental.description}
                  </Box>
                </TableCell>
                <TableCell component="th" scope="row">
                  {format(new Date(rental.updatedAt || ''), 'P')}
                </TableCell>
                <TableCell component="th" scope="row">
                  {isEditable && (
                    <IconButton
                      onClick={handleRentalClick(rental)}
                      sx={{ p: 0 }}
                    >
                      <ChevronRight />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {renderEmptyMessage()}
    </>
  );
}

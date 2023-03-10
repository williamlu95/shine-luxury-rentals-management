import {
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Box,
} from '@mui/material';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd';
import { RentalModel } from '../types/rentals';
import { ChevronRight, Add, DragIndicator } from '@mui/icons-material';
import { format } from 'date-fns';

type Props = {
  isEditable: boolean;
  rentals: RentalModel[];
  onRentalClick: (rental: RentalModel) => void;
  onAddRentalClick: () => void;
  onReorder: (fromId?: string, toId?: string) => void;
};

export default function RentalTable({
  isEditable,
  rentals,
  onRentalClick,
  onAddRentalClick,
  onReorder,
}: Props) {
  const handleRentalClick = (rental: RentalModel) => () => {
    onRentalClick(rental);
  };

  const handleDragEnd = (result: DropResult) => {
    const fromIndex = result.source.index;
    const toIndex = result.destination?.index;

    if (toIndex === undefined) {
      return;
    }

    onReorder(rentals[fromIndex]._id, rentals[toIndex]._id);
  };

  const renderTableRow =
    (rental: RentalModel) => (provided: DraggableProvided) =>
      (
        <TableRow
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            '&:last-child td, &:last-child th': { border: 0 },
          }}
        >
          <TableCell {...provided.dragHandleProps}>
            <DragIndicator />
          </TableCell>
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
            </Box>
          </TableCell>
          <TableCell component="th" scope="row">
            {format(new Date(rental.updatedAt || ''), 'P')}
          </TableCell>
          <TableCell component="th" scope="row">
            {isEditable && (
              <IconButton onClick={handleRentalClick(rental)} sx={{ p: 0 }}>
                <ChevronRight />
              </IconButton>
            )}
          </TableCell>
        </TableRow>
      );

  const renderTable = (provided: DroppableProvided) => (
    <TableBody {...provided.droppableProps} ref={provided.innerRef}>
      {rentals.map((rental, index) => (
        <Draggable
          draggableId={rental._id || ''}
          index={index}
          key={rental._id}
        >
          {renderTableRow(rental)}
        </Draggable>
      ))}
      {provided.placeholder}
    </TableBody>
  );

  return (
    <TableContainer component={Paper} sx={{ height: '100%' }}>
      <Table
        stickyHeader
        aria-label="Table of rentals"
        sx={{ tableLayout: 'fixed' }}
      >
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell>Name</TableCell>
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

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">{renderTable}</Droppable>
        </DragDropContext>
      </Table>
    </TableContainer>
  );
}

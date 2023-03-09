import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

type Props = {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: (hasConfirmed: boolean) => void;
};

export default function ConfirmationPopup({
  isOpen,
  title,
  description,
  onConfirm,
}: Props): JSX.Element {
  const handleDisagree = () => {
    onConfirm(false);
  };

  const handleAgree = () => {
    onConfirm(true);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree}>Disagree</Button>
        <Button onClick={handleAgree} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

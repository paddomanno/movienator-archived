import React from 'react';
import { Review } from '../../types/Review';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type Props = {
  open: boolean;
  review: Review;
  openSetter(open: boolean): void;
};

export default function ReviewDetailsPopup({
  open,
  review,
  openSetter,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        openSetter(false);
      }}
      aria-labelledby="PopUpTitle"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{review.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {review.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant={'contained'}
          onClick={() => {
            openSetter(false);
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import React from 'react';
import { Review } from '../../types/Review';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import ReviewCardDetailed from '../SingleItemComponents/ReviewCardDetailed';

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
      maxWidth={'lg'}
      fullWidth={true}
      onClose={() => {
        openSetter(false);
      }}
      aria-labelledby="PopUpTitle"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <ReviewCardDetailed showUser={true} showMovie={true} review={review} />
      </DialogContent>
      <DialogActions>
        <Button
          variant={'outlined'}
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

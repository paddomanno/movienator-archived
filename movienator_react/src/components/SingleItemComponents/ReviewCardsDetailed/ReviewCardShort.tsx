import React, { useState } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ReviewDetailsPopup from '../../GeneralComponents/ReviewDetailsPopup';
import { SingleReviewProps } from '../../../props/ReviewProps';
import RatingStars from './RatingStars';

export default function ReviewCardShort({ review }: SingleReviewProps) {
  const SIZE_PROFILEIMAGE = 50;
  const [showPopup, setShowPopup] = useState<boolean>(false);

  function setOpenPopup(open: boolean): void {
    setShowPopup(open);
  }

  const avatar = (
    <Paper>
      {review.review_user != null ? (
        <Paper>
          {review.review_user.profileImage?.ressourceLink !== undefined ? (
            <Avatar
              alt={review.review_user.userName}
              sx={{ width: SIZE_PROFILEIMAGE, height: SIZE_PROFILEIMAGE }}
              src={`${process.env.PUBLIC_URL}/Images/ProfileImages/${review.review_user.profileImage.ressourceLink}.png`}
            ></Avatar>
          ) : (
            <Avatar>
              {review.review_user.firstName.at(0)}
              {review.review_user.lastName.at(0)}
            </Avatar>
          )}
        </Paper>
      ) : (
        <Paper></Paper>
      )}
    </Paper>
  );

  return (
    <Paper>
      <ReviewDetailsPopup
        review={review}
        open={showPopup}
        openSetter={setOpenPopup}
      />
      <IconButton
        onClick={() => {
          setShowPopup(true);
        }}
      >
        <Card sx={{ maxWidth: 200, minWidth: 200 }}>
          {review.review_movie != null && review.review_user != null ? (
            <Paper>
              <CardMedia
                component="img"
                alt={
                  review.review_movie.imagePath != null
                    ? review.review_movie.title
                    : 'No image available'
                }
                height="275"
                image={`https://image.tmdb.org/t/p/w342${review.review_movie.imagePath}`}
              />
              <CardContent>
                <Typography
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  variant={'body2'}
                >
                  {review.review_movie.title}
                </Typography>
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  {avatar}
                  <RatingStars rating={review.rating} max={5} />
                </Stack>
              </CardContent>
            </Paper>
          ) : (
            <Paper>
              <CardMedia />
              <CardContent />
            </Paper>
          )}
        </Card>
      </IconButton>
    </Paper>
  );
}

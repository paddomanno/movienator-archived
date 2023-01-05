import React, { useState } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ReviewDetailsPopup from '../../GeneralComponents/ReviewDetailsPopup';
import { SingleReviewProps } from '../../../props/ReviewProps';

export default function ReviewCardShort({ review }: SingleReviewProps) {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  function setOpenPopup(open: boolean): void {
    setShowPopup(open);
  }

  let stars = (
    <Stack direction={'row'}>
      {[...Array(review.rating)].map((x, i) => (
        <StarIcon />
      ))}
      {[...Array(5 - review.rating)].map((x, i) => (
        <StarBorderIcon />
      ))}
    </Stack>
  );

  let avatar = (
    <>
      {review.review_user != null ? (
        <>
          {review.review_user.profileImage?.ressourceLink !== undefined ? (
            <Avatar
              alt={review.review_user.userName}
              src={review.review_user.profileImage.ressourceLink}
            ></Avatar>
          ) : (
            <Avatar>
              {review.review_user.firstName.at(0)}
              {review.review_user.lastName.at(0)}
            </Avatar>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );

  return (
    <>
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
            <>
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
                  {stars}
                </Stack>
              </CardContent>
            </>
          ) : (
            <>
              <CardMedia />
              <CardContent />
            </>
          )}
        </Card>
      </IconButton>
    </>
  );
}

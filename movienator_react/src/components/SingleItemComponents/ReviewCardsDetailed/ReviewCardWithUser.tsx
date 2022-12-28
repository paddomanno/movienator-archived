import { Card, CardContent, Paper, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import OtherUserAvatar from '../OtherUserAvatar';
import { SingleReviewProps } from '../../../props/ReviewProps';
import MovieCard from '../MovieCard';
import UserCard from '../UserCard';
import React from 'react';

export default function ReviewCardWithUser({ review }: SingleReviewProps) {
  let avatar;
  let titleAndDate;
  let stars;
  if (review.review_user != null) {
    titleAndDate = (
      <Stack direction={'column'}>
        <Typography variant={'body2'}>
          {new Date(review.lastUpdated).toDateString()}
        </Typography>
        <Typography variant={'body1'}>{review.title}</Typography>
      </Stack>
    );
    stars = (
      <Stack direction={'row'}>
        {[...Array(review.rating)].map((x, i) => (
          <StarIcon />
        ))}
        {[...Array(5 - review.rating)].map((x, i) => (
          <StarBorderIcon />
        ))}
      </Stack>
    );
    avatar = <OtherUserAvatar user={review.review_user} />;
  }
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        {review.review_movie != null && review.review_user != null ? (
          <Stack direction={'row'} id={'wholeCardStack'} spacing={2}>
            <Stack
              direction={'column'}
              id={'middleColumn'}
              spacing={2}
              flexGrow={1}
            >
              <Stack
                direction={'row'}
                spacing={2}
                id={'rightSideTopRow'}
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Typography variant={'h5'}>{review.title}</Typography>
                {stars}
              </Stack>
              <Paper
                sx={{
                  maxHeight: 255,
                  minHeight: 255,
                  overflow: 'auto',
                  padding: 1,
                }}
              >
                <Typography variant={'body1'}>{review.content}</Typography>
              </Paper>
            </Stack>
            <Stack direction={'column'} id={'middleColumn'} spacing={0}>
              <Typography>
                {new Date(review.lastUpdated).toDateString()}
              </Typography>
              <UserCard user={review.review_user} />
            </Stack>
          </Stack>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}

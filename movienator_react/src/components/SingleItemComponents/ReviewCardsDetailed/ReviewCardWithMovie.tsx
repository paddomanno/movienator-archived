import { SingleReviewProps } from '../../../props/ReviewProps';
import { Card, CardContent, Paper, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import React from 'react';
import { grey } from '@mui/material/colors';
import MovieCard from '../MovieCard';

export default function ReviewCardWithMovie({ review }: SingleReviewProps) {
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
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        {review.review_movie != null && review.review_user != null ? (
          <Stack direction={'row'} id={'wholeCardStack'} spacing={2}>
            <MovieCard movie={review.review_movie} />
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
                <Typography variant={'h4'}>{review.title}</Typography>
                {stars}
                <Typography>
                  {new Date(review.lastUpdated).toDateString()}
                </Typography>
              </Stack>
              <Paper
                sx={{
                  maxHeight: 245,
                  minHeight: 245,
                  overflow: 'auto',
                  padding: 1,
                }}
              >
                <Typography variant={'body1'}>{review.content}</Typography>
              </Paper>
            </Stack>
          </Stack>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}

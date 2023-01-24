import { Card, CardContent, Paper, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { SingleReviewProps } from '../../../props/ReviewProps';
import UserCard from '../UserCard';
import RatingStars from './RatingStars';

export default function ReviewCardWithUser({ review }: SingleReviewProps) {
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
                <RatingStars rating={review.rating} max={5} />
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
              <UserCard user={review.review_user} clickable={true} />
            </Stack>
          </Stack>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}

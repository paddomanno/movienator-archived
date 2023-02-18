import { Card, CardContent, Typography } from '@mui/material';
import ReviewCardDetailed from '../SingleItemComponents/ReviewCardDetailed';
import { ReviewListProps } from '../../props/ReviewProps';
import Grid2 from '@mui/material/Unstable_Grid2';

export default function MovieFollowingReviewsList({
  reviews,
}: ReviewListProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography>
          {reviews.length} of the Users you are following have reviewed this
          movie:
        </Typography>
        <Grid2 container spacing={1}>
          {reviews.map((review) => (
            <Grid2
              minWidth={'50%'}
              maxWidth={'50%'}
              key={`${review.reviewMovieMovieId}.${review.reviewUserUserId}`}
            >
              <ReviewCardDetailed
                showMovie={false}
                showUser={true}
                review={review}
              />
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
}

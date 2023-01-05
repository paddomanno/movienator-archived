import { Card, CardContent, Typography, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import ReviewCardDetailed from '../SingleItemComponents/ReviewCardDetailed';
import { ReviewListProps } from '../../props/ReviewProps';
import Grid2 from '@mui/material/Unstable_Grid2';

export default function MovieFollowingReviewsList({
  reviews,
}: ReviewListProps) {
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Typography>
          {reviews.length} of the Users you are following have reviewed this
          movie:
        </Typography>
        <Grid2 container spacing={1}>
          {reviews.map((review) => (
            <Grid2 minWidth={'50%'} maxWidth={'50%'}>
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

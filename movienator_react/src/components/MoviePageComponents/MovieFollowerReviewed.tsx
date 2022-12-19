import { Review } from '../../types/Review';
import { grey } from '@mui/material/colors';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import SingleUserFrameComponent from '../SingleItemComponents/SingleUserFrameComponent';
import MovieReviewDetails from './MovieReviewDetails';

export default function MovieFollowerReviewed(props: any) {
  const reviews: Review[] = props.data as Review[];

  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Typography>
          {reviews.length} of the Users you are following have reviewed this
          movie:
        </Typography>
        <Stack direction={'column'} spacing={1}>
          {reviews.map((review) => (
            <MovieReviewDetails data={review} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

import { Review } from '../../types/Review';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import MovieReviewDetails from './MovieReviewDetails';

export default function MovieOthersReviews(props: any) {
  const reviews: Review[] = props.data as Review[];

  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Typography>
          {reviews.length} other Users have reviewed this movie:
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

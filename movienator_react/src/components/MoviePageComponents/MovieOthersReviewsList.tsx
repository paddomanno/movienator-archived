import { Card, CardContent, Typography, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import ReviewCardDetailed from '../SingleItemComponents/ReviewCardDetailed';
import { ReviewListProps } from '../../props/ReviewProps';

export default function MovieOthersReviewsList({ reviews }: ReviewListProps) {
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Typography>
          {reviews.length} other Users have reviewed this movie:
        </Typography>
        <Stack direction={'column'} spacing={1}>
          {reviews.map((review) => (
            <ReviewCardDetailed
              showMovie={false}
              showUser={true}
              review={review}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

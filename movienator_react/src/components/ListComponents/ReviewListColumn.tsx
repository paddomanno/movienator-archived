import { Review } from '../../types/Review';
import { grey } from '@mui/material/colors';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import ReviewCardDetailed from '../SingleItemComponents/ReviewCardDetailed';

type Props = {
  reviews: Review[];
  showMovie: boolean;
  showUser: boolean;
  title: string;
};
export default function ReviewListColumn({
  reviews,
  showMovie,
  showUser,
  title,
}: Props) {
  return (
    <>
      <Card sx={{ backgroundColor: grey.A200 }}>
        <CardContent>
          <Typography>{title}</Typography>
          <Stack direction={'column'} spacing={1}>
            {reviews.map((review) => (
              <ReviewCardDetailed
                showUser={showUser}
                showMovie={showMovie}
                review={review}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

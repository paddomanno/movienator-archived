import { Review } from '../../types/Review';
import { grey } from '@mui/material/colors';
import { Card, CardContent, Typography } from '@mui/material';
import ReviewCardDetailed from '../SingleItemComponents/ReviewCardDetailed';
import Grid2 from '@mui/material/Unstable_Grid2';

type Props = {
  reviews: Review[];
  showMovie: boolean;
  showUser: boolean;
  title: string;
};
export default function ReviewListWithText({
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
          <Grid2 container spacing={1}>
            {reviews.map((review) => (
              <Grid2
                maxWidth={'50%'}
                minWidth={'50%'}
                key={`${review.reviewMovieMovieId}.${review.reviewUserUserId}`}
              >
                <ReviewCardDetailed
                  showUser={showUser}
                  showMovie={showMovie}
                  review={review}
                />
              </Grid2>
            ))}
          </Grid2>
        </CardContent>
      </Card>
    </>
  );
}

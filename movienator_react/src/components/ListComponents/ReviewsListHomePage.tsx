import { Review } from '../../types/Review';
import { grey } from '@mui/material/colors';
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import MovieCard from '../SingleItemComponents/MovieCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReviewCardDetailed from '../SingleItemComponents/ReviewCardDetailed';
import { useNavigate } from 'react-router-dom';

type Props = {
  reviews: Review[];
};
export default function ReviewsListHomePage({ reviews }: Props) {
  const navigate = useNavigate();
  function handleClick(e: any) {
    e.preventDefault();
    navigate('/followingReviews');
  }

  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Typography>Your friends reviews</Typography>
        {reviews.length > 0 ? (
          <Stack direction={'row'} spacing={1} overflow={'auto'}>
            {reviews.map((review) => (
              <ReviewCardDetailed
                showUser={false}
                showMovie={false}
                review={review}
              />
            ))}
            <IconButton
              onClick={handleClick}
              size={'large'}
              sx={{ backgroundColor: grey.A400 }}
            >
              <ArrowForwardIcon sx={{ width: 100 }} />
            </IconButton>
          </Stack>
        ) : (
          <Typography>No reviews yet</Typography>
        )}
      </CardContent>
    </Card>
  );
}

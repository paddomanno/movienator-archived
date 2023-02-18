import { grey } from '@mui/material/colors';
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReviewCardDetailed from '../SingleItemComponents/ReviewCardDetailed';
import { useNavigate } from 'react-router-dom';
import { ReviewListProps } from '../../props/ReviewProps';

export default function ReviewsListHomePage({ reviews }: ReviewListProps) {
  const navigate = useNavigate();
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    navigate('/followingReviews');
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography>Your friends reviews</Typography>
        {reviews.length > 0 ? (
          <Stack direction={'row'} spacing={1} justifyContent={'space-between'}>
            <Stack direction={'row'} spacing={1} overflow={'auto'}>
              {reviews.map((review) => (
                <ReviewCardDetailed
                  showUser={false}
                  showMovie={false}
                  review={review}
                  key={`${review.reviewMovieMovieId}.${review.reviewUserUserId}`}
                />
              ))}
            </Stack>
            <IconButton onClick={handleClick} size={'large'} color="secondary">
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

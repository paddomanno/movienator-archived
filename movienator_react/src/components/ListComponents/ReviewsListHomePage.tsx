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
  function handleClick(e: any) {
    e.preventDefault();
    navigate('/followingReviews');
  }

  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
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
                />
              ))}
            </Stack>
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

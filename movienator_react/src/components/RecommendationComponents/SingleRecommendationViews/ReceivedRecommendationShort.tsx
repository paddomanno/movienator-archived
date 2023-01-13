import { Recommendation } from '../../../types/Recommendation';
import { deleteRecommendation } from '../../../services/RecommendationService';
import {
  Card,
  CardContent,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import MovieCard from '../../SingleItemComponents/MovieCard';
import OtherUserAvatar from '../../SingleItemComponents/OtherUserAvatar';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import React from 'react';

type Props = {
  rec: Recommendation;
  reloadRecs: () => void;
};
export default function ReceivedRecommendationShort({
  rec,
  reloadRecs,
}: Props) {
  function deleteRecommendationHandler(e: any) {
    e.preventDefault();
    deleteRecommendation(
      rec.sendingUserUserId,
      rec.receivingUserUserId,
      rec.recommendedMovieMovieId
    ).then((res) => {
      if (res) {
        reloadRecs();
      }
    });
  }

  return (
    <Card sx={{ minWidth: 400, maxWidth: 400 }}>
      <CardContent>
        <Stack direction={'row'}>
          <MovieCard movie={rec.recommendedMovie!!} />
          <Stack direction={'column'}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Stack direction={'row'} alignItems={'center'}>
                <OtherUserAvatar user={rec.sendingUser!!} />
                <Typography>{rec.sendingUser?.userName}</Typography>
              </Stack>
              <IconButton onClick={deleteRecommendationHandler}>
                <DeleteForeverIcon fontSize={'large'} />
              </IconButton>
            </Stack>
            <Paper
              sx={{
                minWidth: 175,
                maxWidth: 175,
                maxHeight: 237,
                minHeight: 237,
                overflow: 'auto',
                padding: 1,
                flexGrow: 1,
              }}
            >
              <Typography variant={'body1'}>{rec.message}</Typography>
            </Paper>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

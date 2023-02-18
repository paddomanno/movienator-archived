import {
  Card,
  CardContent,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Recommendation } from '../../../types/Recommendation';
import { deleteRecommendation } from '../../../services/RecommendationService';
import UserCard from '../../SingleItemComponents/UserCard';

type Props = {
  rec: Recommendation;
  reloadRecs: () => void;
};
export default function SentRecommendationCard({ rec, reloadRecs }: Props) {
  function deleteRecommendationHandler(
    e: React.MouseEvent<HTMLButtonElement>
  ): void {
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
    <Card variant="outlined">
      <CardContent>
        <Stack direction={'column'} spacing={1}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <UserCard user={rec.receivingUser} clickable={true} />
            <Card sx={{ flexGrow: 1 }}>
              <CardContent>
                <Typography variant={'h5'}>
                  {rec.recommendedMovie?.title}
                </Typography>
              </CardContent>
            </Card>
            <IconButton onClick={deleteRecommendationHandler}>
              <DeleteForeverIcon fontSize={'large'} />
            </IconButton>
          </Stack>
          <Paper
            sx={{
              maxHeight: 100,
              minHeight: 100,
              overflow: 'auto',
              padding: 1,
              flexGrow: 1,
            }}
          >
            <Typography variant={'body1'}>{rec.message}</Typography>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  );
}

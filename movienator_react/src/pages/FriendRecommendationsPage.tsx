import { useEffect, useState } from 'react';
import { Recommendation } from '../types/Recommendation';
import { getAllRecommendationsForUserId } from '../services/RecommendationService';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Paper, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import ReceivedRecommendationCard from '../components/RecommendationComponents/SingleRecommendationViews/ReceivedRecommendationCard';
import { grey } from '@mui/material/colors';

export default function FriendRecommendationsPage() {
  const navigate = useNavigate();
  const [friendRecs, setFriendRecs] = useState<Recommendation[] | null>(null);
  const [cookies] = useCookies(['userName', 'userId']);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    document.title = 'Recommendations by your friends';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllRecommendationsForUserId(cookies.userId as number).then((recs) => {
      setFriendRecs(recs);
    });
  }, [cookies.userId]);

  function reloadRecs() {
    getAllRecommendationsForUserId(cookies.userId as number).then((recs) => {
      setFriendRecs(recs);
    });
  }

  return (
    <Paper>
      <Card variant="outlined">
        <CardContent>
          <Stack direction={'column'} spacing={1}>
            <Typography>Recommendations by your friends</Typography>
            {friendRecs != null ? (
              <Paper>
                <Grid2 container spacing={1}>
                  {friendRecs.map((rec) => (
                    <Grid2
                      key={`${rec.sendingUserUserId}.${rec.recommendedMovieMovieId}`}
                    >
                      <ReceivedRecommendationCard
                        rec={rec}
                        reloadRecs={reloadRecs}
                      />
                    </Grid2>
                  ))}
                </Grid2>
              </Paper>
            ) : (
              <Typography> loading... </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Paper>
  );
}

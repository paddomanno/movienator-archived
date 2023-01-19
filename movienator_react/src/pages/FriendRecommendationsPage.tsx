import { useEffect, useState } from 'react';
import { Recommendation } from '../types/Recommendation';
import { getAllRecommendationsForUserId } from '../services/RecommendationService';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import ReceivedRecommendation from '../components/RecommendationComponents/SingleRecommendationViews/ReceivedRecommendation';
import { grey } from '@mui/material/colors';

export default function FriendRecommendationsPage() {
  const navigate = useNavigate();
  const [friendRecs, setFriendRecs] = useState<Recommendation[] | null>(null);
  const [cookies] = useCookies(['userName', 'userId']);

  useEffect(() => {
    //Rauswerfen wenn nicht eingeloggt
    if (!cookies.userName) {
      navigate('/login');
    }
    getAllRecommendationsForUserId(cookies.userId as number).then((recs) => {
      setFriendRecs(recs);
    });
  }, []);
  function reloadRecs() {
    getAllRecommendationsForUserId(cookies.userId as number).then((recs) => {
      setFriendRecs(recs);
    });
  }

  return (
    <>
      <Card sx={{ backgroundColor: grey.A200 }}>
        <CardContent>
          <Stack direction={'column'} spacing={1}>
            <Typography>Recommendations by your friends</Typography>
            {friendRecs != null ? (
              <>
                <Grid2 container spacing={1}>
                  {friendRecs.map((rec) => (
                    <Grid2>
                      <ReceivedRecommendation
                        rec={rec}
                        reloadRecs={reloadRecs}
                      />
                    </Grid2>
                  ))}
                </Grid2>
              </>
            ) : (
              <Typography> loading... </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

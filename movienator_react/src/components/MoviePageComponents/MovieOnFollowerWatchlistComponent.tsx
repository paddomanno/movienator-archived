import { User } from '../../types/User';
import { Card, CardContent, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import Grid2 from '@mui/material/Unstable_Grid2';
import SingleUserFrameComponent from '../SingleItemComponents/SingleUserFrameComponent';

export default function MovieOnFollowerWatchlistComponent(props: any) {
  const users: User[] = props.data as User[];

  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Typography>
          {users.length} of the Users you are following have this movie on their
          watchlist:
        </Typography>
        <Grid2 container spacing={1}>
          {users.map((user) => (
            <Grid2>
              <SingleUserFrameComponent data={user} />
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
}

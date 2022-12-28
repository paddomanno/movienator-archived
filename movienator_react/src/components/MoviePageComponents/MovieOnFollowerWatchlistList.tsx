import { Card, CardContent, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import UsersList from '../ListComponents/UsersList';
import { UserListProps } from '../../props/UserProps';

export default function MovieOnFollowerWatchlistList({ users }: UserListProps) {
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Typography>
          {users.length} of the Users you are following have this movie on their
          watchlist:
        </Typography>
        <UsersList users={users} />
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import UsersList from '../ListComponents/UsersList';
import { UserListProps } from '../../props/UserProps';

export default function MovieOnFollowerWatchlistList({ users }: UserListProps) {
  return (
    <Card sx={{ backgroundColor: grey.A200, flexGrow: 1 }}>
      <CardContent>
        <Typography>
          {users.length} users you are following have this movie on their
          watchlist:
        </Typography>
        <UsersList users={users} />
      </CardContent>
    </Card>
  );
}

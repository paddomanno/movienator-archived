import { Typography, CardContent, Box } from '@mui/material';
import { User } from '../../types/User';
import UsersList from '../ListComponents/UsersList';

type Props = {
  title: string;
  users: User[];
};

export default function OwnProfileUsersLists({ title, users }: Props) {
  return (
    <Box sx={{ flexGrow: 1 }} style={{ border: 'none', boxShadow: 'none' }}>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        {users.length != 0 ? (
          <UsersList users={users} />
        ) : (
          <Typography variant="body2">No users found</Typography>
        )}
      </CardContent>
    </Box>
  );
}

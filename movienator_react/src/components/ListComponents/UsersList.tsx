import Grid2 from '@mui/material/Unstable_Grid2';
import UserCard from '../SingleItemComponents/UserCard';
import { UserListProps } from '../../props/UserProps';
import { Stack } from '@mui/material';

function UsersList({ users }: UserListProps) {
  return (
    <Stack direction={'row'} spacing={2} overflow={'show'}>
      {users.map((user) => (
        <Grid2 key={user.userId}>
          <UserCard user={user} clickable={true} />
        </Grid2>
      ))}
    </Stack>
  );
}

export default UsersList;

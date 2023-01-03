import { Typography, Card } from '@mui/material';
import { grey } from '@mui/material/colors';
import { User } from '../../types/User';
import UsersList from '../ListComponents/UsersList';

type Props = {
  title: string;
  users: User[];
};

export default function OwnProfileUsersLists({ title, users }: Props) {
  return (
    <>
      <Card
        sx={{ backgroundColor: grey.A200 }}
        style={{ border: 'none', boxShadow: 'none' }}
      >
        <Typography variant="h5">{title}</Typography>
        {users.length != 0 ? (
          <UsersList users={users} />
        ) : (
          <Typography variant="body1">None</Typography>
        )}
      </Card>
    </>
  );
}

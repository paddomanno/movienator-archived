import { Typography, Card, CardContent } from '@mui/material';
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
        sx={{ backgroundColor: grey.A200, flexGrow: 1 }}
        style={{ border: 'none', boxShadow: 'none' }}
      >
        <CardContent>
          <Typography variant="h5">{title}</Typography>
          {users.length != 0 ? <UsersList users={users} /> : <></>}
        </CardContent>
      </Card>
    </>
  );
}

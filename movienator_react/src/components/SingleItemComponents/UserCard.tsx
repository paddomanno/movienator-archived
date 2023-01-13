import { Card, CardContent, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import OtherUserAvatar from './OtherUserAvatar';
import { SingleUserProps } from '../../props/UserProps';
import { useCookies } from 'react-cookie';
import { User } from '../../types/User';

type Props = {
  user: User;
  clickable: boolean;
};
export default function UserCard({ user, clickable }: Props) {
  const [cookies] = useCookies(['userName', 'userId']);
  return (
    <Card sx={{ backgroundColor: grey.A100 }}>
      <CardContent>
        <Stack direction={'column'} spacing={0} alignItems={'center'}>
          <OtherUserAvatar user={user} clickable={clickable} />
          <Typography>
            {user.userId == cookies.userId ? 'You' : user.userName}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

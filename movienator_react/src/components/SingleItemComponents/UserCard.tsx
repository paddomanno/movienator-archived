import { Card, CardContent, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import OtherUserAvatar from './OtherUserAvatar';
import { SingleUserProps } from '../../props/UserProps';
import { useCookies } from 'react-cookie';

export default function UserCard({ user }: SingleUserProps) {
  const [cookies] = useCookies(['userName', 'userId']);
  return (
    <Card sx={{ backgroundColor: grey.A100 }}>
      <CardContent>
        <Stack direction={'column'} spacing={0} alignItems={'center'}>
          <OtherUserAvatar user={user} />
          <Typography>
            {user.userId == cookies.userId ? 'You' : user.userName}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

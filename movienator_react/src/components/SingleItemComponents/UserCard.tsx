import { Card, CardContent, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import OtherUserAvatar from './OtherUserAvatar';
import { SingleUserProps } from '../../props/UserProps';

export default function UserCard({ user }: SingleUserProps) {
  const navigate = useNavigate();

  function handleClick() {
    navigate('/user/' + user.userName);
  }

  return (
    <Card sx={{ backgroundColor: grey.A100 }} onClick={handleClick}>
      <CardContent>
        <Stack direction={'column'} spacing={0} alignItems={'center'}>
          <OtherUserAvatar user={user} />
          <Typography>{user.userName}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

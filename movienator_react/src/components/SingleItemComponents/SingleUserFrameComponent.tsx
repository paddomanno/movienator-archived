import { User } from '../../types/User';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import OtherUserAvatar from './OtherUserAvatar';

export default function SingleUserFrameComponent(props: any) {
  const user: User = props.data as User;
  const navigate = useNavigate();

  function handleClick() {
    navigate('/user/' + user.userName);
  }

  return (
    <Card sx={{ backgroundColor: grey.A100 }} onClick={handleClick}>
      <CardContent>
        <Stack direction={'column'} spacing={0} alignItems={'center'}>
          <OtherUserAvatar data={user} />
          <Typography>{user.userName}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

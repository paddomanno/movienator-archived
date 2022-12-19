import { User } from '../../types/User';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

export default function SingleUserFrameComponent(props: any) {
  const user: User = props.data as User;
  const navigate = useNavigate();

  function handleClick() {
    navigate('/user/' + user.userName);
  }

  return (
    <Card sx={{ backgroundColor: grey.A100 }} onClick={handleClick}>
      <CardContent>
        <Stack direction={'column'} spacing={1} alignItems={'center'}>
          {user.profileImage ? (
            <Avatar
              alt={user.userName}
              src={user.profileImage.ressourceLink}
            ></Avatar>
          ) : (
            <Avatar>
              {user.firstName.at(0)}
              {user.lastName.at(0)}
            </Avatar>
          )}
          <Typography>{user.userName}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

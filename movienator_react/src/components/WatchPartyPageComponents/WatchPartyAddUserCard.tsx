import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { green, grey } from '@mui/material/colors';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { User } from '../../types/User';
import OtherUserAvatar from '../SingleItemComponents/OtherUserAvatar';

type Props = {
  user: User;
  onClick: (user: User) => void;
  selected: boolean;
};
export default function WatchPartyAddUserCard({
  user,
  onClick,
  selected,
}: Props) {
  const [cookies] = useCookies(['userName', 'userId']);
  return (
    <IconButton
      onClick={() => {
        onClick(user);
      }}
    >
      <Card sx={{ backgroundColor: selected ? green.A100 : grey.A100 }}>
        <CardContent>
          <Stack direction={'column'} spacing={0} alignItems={'center'}>
            <OtherUserAvatar user={user} clickable={false} />
            <Typography>
              {user.userId == cookies.userId ? 'You' : user.userName}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </IconButton>
  );
}

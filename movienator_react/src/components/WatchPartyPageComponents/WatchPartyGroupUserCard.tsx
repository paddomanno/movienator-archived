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
};
export default function WatchPartyGroupUserCard({ user, onClick }: Props) {
  const [cookies] = useCookies(['userName', 'userId']);
  return (
    <IconButton
      onClick={() => {
        onClick(user);
      }}
    >
      <Card
        sx={{
          backgroundColor: grey.A100,
          minHeight: '5rem',
          minWidth: '8rem',
        }}
      >
        <CardContent>
          <Stack direction={'column'} spacing={0} alignItems={'center'}>
            <OtherUserAvatar user={user} clickable={false} />
            <Typography fontSize={'24px'}>
              {user.userId == cookies.userId ? 'You' : user.userName}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </IconButton>
  );
}

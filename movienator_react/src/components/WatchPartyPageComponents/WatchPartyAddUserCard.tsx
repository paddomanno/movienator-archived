import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { green, grey } from '@mui/material/colors';
import { useCookies } from 'react-cookie';
import { User } from '../../types/User';
import OtherUserAvatar from '../SingleItemComponents/OtherUserAvatar';
import { useTheme } from '@mui/material';

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
  const theme = useTheme();
  return (
    <IconButton
      onClick={() => {
        onClick(user);
      }}
    >
      <Card
        sx={{
          backgroundColor: selected
            ? (theme) => theme.palette.success.main
            : (theme) => theme.palette.background.default,
        }}
      >
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

import Grid2 from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';
import WatchPartyGroupUserCard from './WatchPartyGroupUserCard';
import { User } from '../../types/User';
import WatchPartyAddUserCard from './WatchPartyAddUserCard';

type Props = {
  users: User[];
  usersInGroup: User[];
  onClickUser: (user: User) => void;
};
function WatchPartyAddUsersList({ users, usersInGroup, onClickUser }: Props) {
  return (
    <>
      <Stack direction={'row'} spacing={1} overflow={'auto'}>
        {users.map((user, index) => (
          <Grid2 key={index}>
            <WatchPartyAddUserCard
              user={user}
              onClick={onClickUser}
              selected={usersInGroup.includes(user)}
              key={index}
            />
          </Grid2>
        ))}
      </Stack>
    </>
  );
}

export default WatchPartyAddUsersList;

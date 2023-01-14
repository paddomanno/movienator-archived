import Grid2 from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';
import WatchPartyGroupUserCard from './WatchPartyGroupUserCard';
import { User } from '../../types/User';

type Props = {
  users: User[];
  onClickUser: (user: User) => void;
};
function WatchPartyGroupList({ users, onClickUser }: Props) {
  return (
    <>
      <Stack direction={'row'} spacing={1} overflow={'auto'}>
        {users.map((user, index) => (
          <Grid2 key={index}>
            <WatchPartyGroupUserCard
              user={user}
              onClick={onClickUser}
              key={index}
            />
          </Grid2>
        ))}
      </Stack>
    </>
  );
}

export default WatchPartyGroupList;

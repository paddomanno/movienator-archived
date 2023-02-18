import { Paper } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { User } from '../../types/User';
import WatchPartyAddUserCard from './WatchPartyAddUserCard';

type Props = {
  users: User[];
  usersInGroup: User[];
  onClickUser: (user: User) => void;
};
function WatchPartyAddUsersList({ users, usersInGroup, onClickUser }: Props) {
  return (
    <Grid2 container spacing={1}>
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
    </Grid2>
  );
}

export default WatchPartyAddUsersList;

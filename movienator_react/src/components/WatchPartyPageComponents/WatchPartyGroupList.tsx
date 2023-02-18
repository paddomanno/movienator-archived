import Grid2 from '@mui/material/Unstable_Grid2';
import WatchPartyGroupUserCard from './WatchPartyGroupUserCard';
import { User } from '../../types/User';

type Props = {
  users: User[];
  onClickUser: (user: User) => void;
};
function WatchPartyGroupList({ users, onClickUser }: Props) {
  return (
    <Grid2 container spacing={1}>
      {users.map((user, index) => (
        <Grid2 key={index}>
          <WatchPartyGroupUserCard
            user={user}
            onClick={onClickUser}
            key={index}
          />
        </Grid2>
      ))}
    </Grid2>
  );
}

export default WatchPartyGroupList;

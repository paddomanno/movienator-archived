import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import { User } from '../../types/User';
import UserCard from '../SingleItemComponents/UserCard';

type Props = {
  users: User[];
};

function UsersList({ users }: Props) {
  return (
    <>
      <Grid2 container spacing={1}>
        {users.map((user) => (
          <Grid2>
            <UserCard data={user} />
          </Grid2>
        ))}
      </Grid2>
    </>
  );
}

export default UsersList;

import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import UserCard from '../SingleItemComponents/UserCard';
import { UserListProps } from '../../props/UserProps';

function UsersList({ users }: UserListProps) {
  return (
    // TODO: lieber List mit ListItem's ?
    <>
      <Grid2 container spacing={1}>
        {users.map((user) => (
          <Grid2>
            <UserCard user={user} />
          </Grid2>
        ))}
      </Grid2>
    </>
  );
}

export default UsersList;

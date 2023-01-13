import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import UserCard from '../SingleItemComponents/UserCard';
import { UserListProps } from '../../props/UserProps';
import { Stack } from '@mui/material';

function UsersList({ users }: UserListProps) {
  return (
    // TODO: lieber List mit ListItem's ?
    <>
      <Stack direction={'row'} spacing={1} overflow={'auto'}>
        {users.map((user) => (
          <Grid2>
            <UserCard user={user} clickable={true} />
          </Grid2>
        ))}
      </Stack>
    </>
  );
}

export default UsersList;

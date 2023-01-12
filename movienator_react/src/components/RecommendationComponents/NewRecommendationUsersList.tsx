import { Card, CardContent, IconButton, Typography } from '@mui/material';
import { grey, orange } from '@mui/material/colors';
import UsersList from '../ListComponents/UsersList';
import { User } from '../../types/User';
import Grid2 from '@mui/material/Unstable_Grid2';
import UserCard from '../SingleItemComponents/UserCard';
import React from 'react';

type Props = {
  curUserId: number;
  users: User[];
  handleChange: (userId: number) => any;
};
export default function NewRecommendationUsersList({
  curUserId,
  users,
  handleChange,
}: Props) {
  return (
    <>
      <Card sx={{ backgroundColor: grey.A200, flexGrow: 1 }}>
        <CardContent>
          {users.length != 0 ? (
            <Grid2 container spacing={1}>
              {users.map((user) => (
                <Grid2>
                  <IconButton
                    sx={{
                      backgroundColor:
                        user.userId === curUserId ? orange.A200 : '',
                    }}
                    onClick={() => {
                      handleChange(user.userId != null ? user.userId : -1);
                    }}
                  >
                    <UserCard user={user} />
                  </IconButton>
                </Grid2>
              ))}
            </Grid2>
          ) : (
            <Typography variant="body1">None</Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
}

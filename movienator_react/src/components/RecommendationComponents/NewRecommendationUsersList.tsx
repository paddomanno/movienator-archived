import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { grey, orange } from '@mui/material/colors';
import { User } from '../../types/User';
import Grid2 from '@mui/material/Unstable_Grid2';
import UserCard from '../SingleItemComponents/UserCard';
import React from 'react';

type Props = {
  curUserId: number;
  users: User[];
  handleChange: (userId: number) => void;
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
            <Stack spacing={1} direction={'row'} overflow={'auto'}>
              {users.map((user) => (
                <Grid2 key={user.userId}>
                  <IconButton
                    sx={{
                      backgroundColor:
                        user.userId === curUserId ? orange.A200 : '',
                    }}
                    onClick={() => {
                      handleChange(user.userId != null ? user.userId : -1);
                    }}
                  >
                    <UserCard user={user} clickable={false} />
                  </IconButton>
                </Grid2>
              ))}
            </Stack>
          ) : (
            <Typography variant="body1">None</Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
}

//Route: movienator3000.com/profile
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { User } from '../types/User';
import { getOneUser } from '../services/UserService';
import OwnProfileDetails from '../components/OwnProfileComponents/OwnProfileDetails';
import OwnProfileUsersLists from '../components/OwnProfileComponents/OwnProfileUsersLists';

export default function OwnProfilePage() {
  const navigate = useNavigate();
  const [cookies] = useCookies(['userName']);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    getOneUser(cookies.userName).then((user) => {
      setUser(user);
    });
  }, []);

  return (
    <Stack direction={'column'} spacing={1}>
      {user != null ? (
        <>
          <OwnProfileDetails user={user} />
          <Stack direction={'row'} spacing={1} justifyContent={'space-evenly'}>
            <OwnProfileUsersLists
              title="Your Followers:"
              users={user.followers}
            />
            <OwnProfileUsersLists title="You follow:" users={user.following} />
          </Stack>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Stack>
  );
}

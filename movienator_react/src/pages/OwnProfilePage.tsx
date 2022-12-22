//Route: movienator3000.com/profile
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';
import { User } from '../types/User';
import { getOneUser } from '../services/UserService';
import { grey } from '@mui/material/colors';
import OwnProfileDetails from '../components/OwnProfileComponents/OwnProfileDetails';

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
        <OwnProfileDetails user={user} />
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Stack>
  );
}

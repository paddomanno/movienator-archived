//Route: movienator3000.com/
import { Outlet, useNavigate } from 'react-router-dom';
import { Avatar, Button, IconButton, Stack, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import LogoutIcon from '@mui/icons-material/Logout';
import React, { useEffect, useState } from 'react';
import { User } from '../types/User';
import { getOneUser } from '../services/UserService';

export default function RootPage() {
  const SIZE_PROFILEIMAGE = 50;
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['userName', 'userId']);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (cookies.userId) {
      getOneUser(cookies.userId).then((res) => {
        setUser(res);
      });
    }
  }, cookies.userId);
  function handleLogout(e: any) {
    e.preventDefault();
    if (cookies.userName) {
      removeCookie('userName');
      removeCookie('userId');
      setUser(null);
      navigate('/login');
    }
  }

  function homeClick(e: any) {
    e.preventDefault();
    navigate('/home');
  }

  function profileClick(e: any) {
    e.preventDefault();
    navigate('/profile');
  }

  return (
    <div>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <IconButton onClick={homeClick}>
          <LiveTvIcon />
        </IconButton>
        <Typography variant={'h3'}>Movienator3000</Typography>
        <Stack direction={'row'} spacing={1}>
          {user != null ? (
            <>
              {user.profileImage != null ? (
                <IconButton onClick={profileClick}>
                  <Avatar
                    alt={user.userName}
                    sx={{ width: SIZE_PROFILEIMAGE, height: SIZE_PROFILEIMAGE }}
                    src={`${process.env.PUBLIC_URL}/Images/ProfileImages/${user.profileImage.ressourceLink}.png`}
                  ></Avatar>
                </IconButton>
              ) : (
                <IconButton onClick={profileClick}>
                  <Avatar>
                    {user.firstName.at(0)}
                    {user.lastName.at(0)}
                  </Avatar>
                </IconButton>
              )}
              <IconButton onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <Typography>Please log in to use this website</Typography>
          )}
        </Stack>
      </Stack>
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}

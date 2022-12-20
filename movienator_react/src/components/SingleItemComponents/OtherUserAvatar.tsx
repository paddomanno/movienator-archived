import { Actor } from '../../types/Actor';
import { useNavigate } from 'react-router-dom';
import { Avatar, IconButton, Paper, Typography } from '@mui/material';
import { User } from '../../types/User';
import React from 'react';

export default function OtherUserAvatar(props: any) {
  let user: User = props.data as User;
  const navigate = useNavigate();
  function manageClick() {
    navigate('/user/' + user.userId);
  }
  return (
    <IconButton onClick={manageClick}>
      {user.profileImage?.ressourceLink != undefined ? (
        <Avatar
          alt={user.userName}
          src={user.profileImage.ressourceLink}
        ></Avatar>
      ) : (
        <Avatar>
          {user.firstName.at(0)}
          {user.lastName.at(0)}
        </Avatar>
      )}
    </IconButton>
  );
}

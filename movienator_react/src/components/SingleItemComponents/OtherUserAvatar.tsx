import { useNavigate } from 'react-router-dom';
import { Avatar, IconButton } from '@mui/material';
import React from 'react';
import { SingleUserProps } from '../../props/UserProps';

export default function OtherUserAvatar({ user }: SingleUserProps) {
  const navigate = useNavigate();
  function manageClick() {
    navigate('/user/' + user.userId);
  }
  return (
    <IconButton onClick={manageClick}>
      {user.profileImage?.ressourceLink !== undefined ? (
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

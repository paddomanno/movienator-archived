import { useNavigate } from 'react-router-dom';
import { Avatar, IconButton } from '@mui/material';
import React from 'react';
import { SingleUserProps } from '../../props/UserProps';

export default function OtherUserAvatar({ user }: SingleUserProps) {
  const IMAGE_SIZE = 50;
  const navigate = useNavigate();
  function manageClick() {
    navigate('/user/' + user.userId);
  }
  return (
    <IconButton onClick={manageClick}>
      {user.profileImage?.ressourceLink !== undefined ? (
        <Avatar
          sx={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
          alt={user.userName}
          src={`${process.env.PUBLIC_URL}/Images/ProfileImages/${user.profileImage.ressourceLink}.png`}
        ></Avatar>
      ) : (
        <Avatar sx={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}>
          {user.firstName.at(0)}
          {user.lastName.at(0)}
        </Avatar>
      )}
    </IconButton>
  );
}

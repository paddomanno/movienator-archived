import { useNavigate } from 'react-router-dom';
import { Avatar, IconButton } from '@mui/material';
import React from 'react';
import { User } from '../../types/User';

type Props = {
  user: User;
  clickable: boolean;
};
export default function OtherUserAvatar({ user, clickable }: Props) {
  const IMAGE_SIZE = 50;
  const navigate = useNavigate();
  function manageClick() {
    navigate('/user/' + user.userId);
  }

  const content =
    user.profileImage?.ressourceLink !== undefined ? (
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
    );

  return clickable ? (
    <IconButton {...(clickable && { onClick: manageClick })}>
      {content}
    </IconButton>
  ) : (
    <>{content}</>
  );
}

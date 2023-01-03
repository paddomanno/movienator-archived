import { SingleUserProps } from '../../props/UserProps';
import { useState, useEffect } from 'react';
import { Card, InputBase, Paper, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import OwnProfileUsersLists from './OwnProfileUsersLists';
import { User } from '../../types/User';
import { searchUsersByWord } from '../../services/UserService';

export default function OwnProfileUserSearch({ user }: SingleUserProps) {
  const [searchWord, setSearchWord] = useState<string | undefined>();
  const [users, setUsers] = useState<User[]>([]);

  function handleChange(e: any) {
    e.preventDefault();
    const { value } = e.target;
    setSearchWord(value);
  }

  useEffect(() => {
    if (searchWord !== undefined) {
      searchUsersByWord(searchWord).then((res) => {
        setUsers(res);
      });
    }
  }, [searchWord]);

  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <Typography variant="h5">Get to know other Movienators!</Typography>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search User"
          value={searchWord}
          onChange={handleChange}
        />
      </Paper>

      <OwnProfileUsersLists title={''} users={users} />
    </Card>
  );
}

import { IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  initialSearchWord: string;
};
export default function ActorMovieSearchBar({ initialSearchWord }: Props) {
  const [searchWord, setSearchWord] = useState<string | undefined>(
    initialSearchWord
  );
  const navigate = useNavigate();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value } = e.target;
    setSearchWord(value);
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    navigate('/search/actor/movie/' + searchWord);
  }
  function handlePress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == 'Enter') {
      e.preventDefault();
      navigate('/search/actor/movie/' + searchWord);
    }
  }

  return (
    <Paper
      color="secondary"
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Movie or Actor"
        value={searchWord}
        onChange={handleChange}
        onKeyDown={handlePress}
        color="primary"
      />
      <IconButton
        type="button"
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={handleClick}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

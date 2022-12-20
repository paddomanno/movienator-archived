import { IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function ActorSearchBar(props: any) {
  const [searchWord, setSearchWord] = useState<string | undefined>(props.data);
  const navigate = useNavigate();
  function handleChange(e: any) {
    e.preventDefault();
    const { name, value } = e.target;
    setSearchWord(value);
  }

  function handleClick(e: any) {
    e.preventDefault();
    navigate('/search/actor/' + searchWord);
  }
  function handlePress(e: any) {
    if (e.keyCode == 13) {
      e.preventDefault();
      navigate('/search/actor/' + searchWord);
    }
  }

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Actor"
        value={searchWord}
        onChange={handleChange}
        onKeyDown={handlePress}
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

import { IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  initialSearchWord: string;
};
export default function MovieSearchBar({ initialSearchWord }: Props) {
  const [searchWord, setSearchWord] = useState<string>(initialSearchWord);
  const navigate = useNavigate();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    const { value } = e.target;
    setSearchWord(value);
  }

  function handleClick(e: React.MouseEvent): void {
    e.preventDefault();
    navigate('/search/movie/' + searchWord);
  }
  function handlePress(e: React.KeyboardEvent): void {
    if (e.key == 'Enter') {
      e.preventDefault();
      navigate('/search/movie/' + searchWord);
    }
  }

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Movie"
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

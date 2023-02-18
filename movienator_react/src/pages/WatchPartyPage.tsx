//Route: movienator3000.com/recommendations
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  Card,
  CardContent,
  Grid,
  InputBase,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { User } from '../types/User';
import { getOneUserToUserId } from '../services/UserService';
import WatchPartyGroupList from '../components/WatchPartyPageComponents/WatchPartyGroupList';
import WatchPartyAddUsersList from '../components/WatchPartyPageComponents/WatchPartyAddUsersList';
import Fuse from 'fuse.js';

import { getRecommendationForUserList } from '../services/RecommendationService';
import { MovieWithScore } from '../types/Recommendation';
import WatchPartyResultsList from '../components/WatchPartyPageComponents/WatchPartyResultsList';
import Container from '@mui/material/Container/Container';
export default function WatchPartyPage() {
  const navigate = useNavigate();
  const [recommendedMovies, setRecommendedMovies] = useState<
    MovieWithScore[] | null
  >(null);
  const [cookies] = useCookies(['userName', 'userId']);
  const [user, setUser] = useState<User | null>(null);
  const [usersInGroup, setUsersInGroup] = useState<User[]>([]);
  const [usersInSearch, setUsersInSearch] = useState<User[]>([]);
  const [searchWord, setSearchWord] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fuse, setFuse] = useState<Fuse<User>>();

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    document.title = 'Plan Your Watchparty!';
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserData = useCallback(async () => {
    const user = await getOneUserToUserId(cookies.userName);
    if (!user) {
      navigate('/login');
      return;
    }
    setUser(user);
    setUsersInSearch(user.following);
    if (!usersInGroup.includes(user)) {
      addUserToGroup(user);
    }

    // init fuse for fuzzy search when searching users
    const fuseOptions = {
      keys: ['firstName', 'lastName', 'userName'],
    };
    const fuse = new Fuse<User>(user.following, fuseOptions);
    setFuse(fuse);

    // get results once for only the logged in user
    setLoading(true);
    handleSubmit().then(() => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.userName]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    const { value } = e.target;
    setSearchWord(value);
  }

  useEffect(() => {
    if (searchWord !== '' && fuse) {
      // filter users when searchword changes
      const searchResults = fuse
        .search(searchWord)
        .map((result: Fuse.FuseResult<User>) => result.item);
      setUsersInSearch(searchResults);
      return;
    }

    // when no searchword is given, show all users the logged in user is following
    if (user && user.following) {
      setUsersInSearch(user.following);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWord, user]);

  function addUserToGroup(addedUser: User) {
    setUsersInGroup((usersInGroup) => [...usersInGroup, addedUser]);
  }

  function removeUserFromGroup(removeUser: User) {
    if (removeUser === user) {
      return;
    }
    const newGroup = usersInGroup.filter(
      (user) => user.userId !== removeUser.userId
    );
    setUsersInGroup(newGroup);
  }

  function onClickUser(clickedUser: User) {
    if (usersInGroup.includes(clickedUser)) {
      removeUserFromGroup(clickedUser);
    } else {
      addUserToGroup(clickedUser);
    }
  }

  useEffect(() => {
    setLoading(true);
    handleSubmit().then(() => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersInGroup]);

  async function handleSubmit() {
    const newRecommendedMovies: MovieWithScore[] = [];

    // using recommendation service
    const res = await getRecommendationForUserList(usersInGroup);
    if (!res) {
      throw new Error('Error getting watch party movie recommendations');
    }
    res.forEach((movie) => {
      if (movie) {
        newRecommendedMovies.push(movie);
      }
    });
    newRecommendedMovies.sort((a, b) => b.score - a.score);
    setRecommendedMovies(newRecommendedMovies);
  }

  return (
    <Stack direction={'column'} spacing={1}>
      <Container>
        <Stack direction={'column'} spacing={1}>
          <Typography variant="h4">Watch Party</Typography>
          <Typography variant="h5">
            Get movie recommendations for you and your friends
          </Typography>
          <Grid direction="row" container spacing={2}>
            <Grid container item sm={6}>
              <Container sx={{ width: '100%' }}>
                <Typography>Your Group</Typography>
                <WatchPartyGroupList
                  users={usersInGroup}
                  onClickUser={onClickUser}
                />
                <Typography>{`${usersInGroup.length} users selected`}</Typography>
              </Container>
            </Grid>
            <Grid container item sm={6} spacing={2}>
              <Container sx={{ width: '100%' }}>
                <Typography>Choose from your friends</Typography>
                <Paper
                  component="form"
                  sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: 400,
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search User"
                    value={searchWord}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => {
                      e.key === 'Enter' && e.preventDefault();
                    }}
                  />
                </Paper>
                {user && user.following.length > 0 ? (
                  usersInSearch.length != 0 ? (
                    <WatchPartyAddUsersList
                      users={usersInSearch}
                      usersInGroup={usersInGroup}
                      onClickUser={onClickUser}
                    />
                  ) : (
                    <Typography>No results :&lt;</Typography>
                  )
                ) : (
                  <Typography>
                    Follow other Movienators to select them here!
                  </Typography>
                )}
              </Container>
            </Grid>
          </Grid>
        </Stack>
      </Container>
      {recommendedMovies && (
        <Card>
          <CardContent>
            <Stack direction={'column'} spacing={1}>
              <Typography variant="h5">
                Our Picks for You: {loading ? 'loading...' : ''}
              </Typography>
              <WatchPartyResultsList movies={recommendedMovies.slice(0, 5)} />
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}

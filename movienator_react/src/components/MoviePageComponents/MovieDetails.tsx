import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  removeMovieIdFromWatchlistOfUserId,
  insertMovieIdOnWatchlistToUserId,
} from '../../services/UserService';
import { useCookies } from 'react-cookie';
import {
  getWatchlistMoviesToUserId,
  createMovie,
} from '../../services/MovieService';
import { grey } from '@mui/material/colors';
import ActorCardSmall from '../SingleItemComponents/ActorCardSmall';
import { SingleMovieProps } from '../../props/MovieProps';
import NewRecommendationDialog from '../RecommendationComponents/NewRecommendationDialog';
import { getAllWatchProvidersForMovie } from '../../services/ExternService';
import { WatchProvider } from '../../types/WatchProvider';

export default function MovieDetails({ movie }: SingleMovieProps) {
  const countryOptions = [
    { value: 'DE', text: '🇩🇪' },
    { value: 'US', text: '🇺🇸' },
    { value: 'GB', text: '🇬🇧' },
  ];

  const navigate = useNavigate();
  const [isWatchlist, setIsWatchlist] = useState<boolean>(false);
  const [cookies] = useCookies(['userName', 'userId']);
  const [showRecDialog, setShowRecDialog] = useState<boolean>(false);
  const [country, setCountry] = useState<string>(countryOptions[0].value);
  const [providers, setProviders] = useState<WatchProvider[]>([]);

  // check once if the movie is already on the watchlist
  useEffect(() => {
    async () => await getIsWatchlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProviders = useCallback(async () => {
    const watchProvidersWithCountry = await getAllWatchProvidersForMovie(
      movie.movieId,
      country
    );
    setProviders(watchProvidersWithCountry.providers);
  }, [country, movie]);

  useEffect(() => {
    getProviders();
  }, [country, getProviders]);

  function handleGenreClick(genreId: number) {
    navigate('/genreMovies/' + genreId);
  }

  const handleCountryChange = (e: SelectChangeEvent<string>) => {
    setCountry(e.target.value);
  };

  async function getIsWatchlist() {
    const watchlistMovies = await getWatchlistMoviesToUserId(
      cookies.userId as number
    );
    for (const movie of watchlistMovies) {
      if (movie.movieId === movie.movieId) {
        setIsWatchlist(true);
      }
    }
  }

  function handleWatchlistClick(e: React.MouseEvent) {
    e.preventDefault();
    if (isWatchlist) {
      removeMovieIdFromWatchlistOfUserId(
        cookies.userId as number,
        movie.movieId
      ).then((res) => {
        if (res) {
          setIsWatchlist(false);
        }
      });
      return;
    }

    // save movie to db and add to watchlist
    createMovie(movie).then((movieRes) => {
      if (movieRes) {
        insertMovieIdOnWatchlistToUserId(
          cookies.userId as number,
          movie.movieId
        ).then((res) => {
          if (res) {
            setIsWatchlist(true);
          }
        });
      }
    });
  }

  function changeShowDialog(value: boolean) {
    setShowRecDialog(value);
  }

  const watchProviderComp = (
    <Paper>
      <Card variant="outlined">
        <CardContent>
          <Stack direction={'row'} spacing={1}>
            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="country-select-label">Country</InputLabel>
              <Select
                defaultValue={'DE'}
                labelId="country-select-label"
                id="country-select"
                value={country}
                label="Country"
                onChange={handleCountryChange}
              >
                {countryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction={'column'} spacing={1}>
              {providers.length != 0 ? (
                <Typography>Available for streaming on:</Typography>
              ) : (
                <Paper>
                  <Typography>
                    Currently not available for streaming in this country.
                  </Typography>
                </Paper>
              )}
              <Stack direction={'row'} spacing={1}>
                {providers.map((provider) => (
                  <Paper key={provider.providerId}>
                    <Typography>{provider.providerName}</Typography>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Paper>
  );

  const videoComp = (
    <Paper>
      {movie.videoPath !== 'null' ? (
        <Card variant="outlined">
          <CardContent>
            <iframe
              title={movie.title + ' Trailer'}
              width={500}
              height={315}
              allowFullScreen={true}
              src={'https://www.youtube.com/embed/' + movie.videoPath}
            />
          </CardContent>
        </Card>
      ) : (
        <Paper></Paper>
      )}
    </Paper>
  );
  const genreComp = (
    <Card variant="outlined">
      <CardContent>
        <Stack direction={'row'} spacing={0}>
          {movie.genres.map((genre, key) => (
            <IconButton
              key={key}
              onClick={() => {
                handleGenreClick(genre.genreId);
              }}
            >
              <Paper>
                <Typography>{genre.genreName}</Typography>
              </Paper>
            </IconButton>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
  const detailsComp = (
    <Card variant="outlined">
      <CardContent>
        <Stack direction={'row'} spacing={1}>
          <Paper>
            <Typography>{movie.lengthMinutes}min</Typography>
          </Paper>
          <Paper>
            <Typography>
              {new Date(movie.releaseDate).getTime() !== new Date(0).getTime()
                ? new Date(movie.releaseDate).getFullYear()
                : 'Date Not known'}
            </Typography>
          </Paper>
          <Paper>
            <Typography>Adult: {movie.adultContent ? 'Yes' : 'No'}</Typography>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  );

  const actorComp = (
    <Card variant="outlined">
      <CardContent>
        <Grid2 container spacing={0}>
          {movie.actors.map((actor) => (
            <Grid2 key={actor.actorId}>
              <ActorCardSmall actor={actor} />
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
  const leftColumn = (
    <Stack direction={'column'} width={'50%'} alignItems={'center'} spacing={2}>
      <img
        alt={movie.imagePath != null ? movie.title : 'No image available'}
        height={'auto'}
        width={300}
        src={`https://image.tmdb.org/t/p/w342${movie.imagePath}`}
      />
      {genreComp}
      {detailsComp}
      <Button variant={'contained'} onClick={handleWatchlistClick}>
        {isWatchlist ? 'Remove From Watchlist' : 'Add to Watchlist'}
      </Button>
      <Button
        variant={'contained'}
        onClick={() => {
          setShowRecDialog(true);
        }}
      >
        Send Recommendation
      </Button>
    </Stack>
  );
  const rightColumn = (
    <Stack
      direction={'column'}
      width={'50%'}
      alignItems={'center'}
      spacing={2}
      justifyContent={'space-between'}
    >
      <Card variant="outlined">
        <CardContent>
          <Typography>{movie.overview}</Typography>
        </CardContent>
      </Card>
      {videoComp}
      {actorComp}
      {watchProviderComp}
    </Stack>
  );

  return (
    <Paper>
      <Typography variant={'h4'}>{movie.title}</Typography>
      <Divider></Divider>
      <Card variant="outlined">
        <CardContent>
          <Stack direction={'row'} spacing={1}>
            {leftColumn}
            {rightColumn}
          </Stack>
        </CardContent>
      </Card>
      <NewRecommendationDialog
        open={showRecDialog}
        movie={movie}
        setOpen={changeShowDialog}
      />
    </Paper>
  );
}

import {
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
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

export default function MovieDetails({ movie }: SingleMovieProps) {
  const navigate = useNavigate();
  const [isWatchlist, setIsWatchlist] = useState<boolean>(false);
  const [cookies] = useCookies(['userName', 'userId']);
  const [showRecDialog, setShowRecDialog] = useState<boolean>(false);

  function changeShowDialog(value: boolean) {
    setShowRecDialog(value);
  }

  useEffect(() => {
    getWatchlistMoviesToUserId(cookies.userId as number).then((movies) => {
      movies.forEach((oneMovie) => {
        if (oneMovie.movieId === movie.movieId) {
          setIsWatchlist(true);
        }
      });
    });
  }, []);

  function handleWatchlistClick(e: any) {
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
    } else {
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
  }

  function handleGenreClick(genreId: number) {
    navigate('/genreMovies/' + genreId);
  }

  let watchProviderComp = (
    <>
      {movie.watchProviders.length != 0 ? (
        <Card sx={{ backgroundColor: grey.A100 }}>
          <CardContent>
            <Stack direction={'row'} spacing={0}>
              {movie.watchProviders.map((provider, key) => (
                <IconButton
                  key={key}
                  // onClick={() => {}}
                >
                  <Paper>
                    <Typography>{provider.providerName}</Typography>
                  </Paper>
                </IconButton>
              ))}
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <>
          <Typography>
            Currently not available for streaming in the US.
          </Typography>
        </>
      )}
    </>
  );

  let videoComp = (
    <>
      {movie.videoPath !== 'null' ? (
        <Card sx={{ backgroundColor: grey.A100 }}>
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
        <></>
      )}
    </>
  );
  let genreComp = (
    <Card sx={{ backgroundColor: grey.A100 }}>
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
  let detailsComp = (
    <Card sx={{ backgroundColor: grey.A100 }}>
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

  let actorComp = (
    <Card sx={{ backgroundColor: grey.A100 }}>
      <CardContent>
        <Grid2 container spacing={0}>
          {movie.actors.map((actor) => (
            <Grid2>
              <ActorCardSmall actor={actor} />
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
  let leftColumn = (
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
  let rightColumn = (
    <Stack
      direction={'column'}
      width={'50%'}
      alignItems={'center'}
      spacing={2}
      justifyContent={'space-between'}
    >
      <Card sx={{ backgroundColor: grey.A100 }}>
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
    <>
      <Typography variant={'h4'}>{movie.title}</Typography>
      <Divider></Divider>
      <Card sx={{ backgroundColor: grey.A200 }}>
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
    </>
  );
}

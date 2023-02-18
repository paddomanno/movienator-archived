import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { User } from '../../types/User';
import {
  getFollowingOfUserIdInFollowers,
  searchUsersByUserNameQuery,
} from '../../services/UserService';
import NewRecommendationUsersList from './NewRecommendationUsersList';
import { AlertColor } from '@mui/material/Alert';
import { postOrUpdateRecommendation } from '../../services/RecommendationService';
import { useCookies } from 'react-cookie';
import { CreateRecommendationDTO } from '../../types/Recommendation';
import { Movie } from '../../types/Movie';
import { getContainsHateSpeech } from '../../services/ExternService';
import { createMovie } from '../../services/MovieService';
import FeedbackSnackbar from '../GeneralComponents/FeedbackSnackbar';

type props = {
  open: boolean;
  movie: Movie;
  setOpen: (value: boolean) => void;
};
export default function NewRecommendationDialog({
  open,
  movie,
  setOpen,
}: props) {
  const [forUserId, setForUserId] = useState<number>(-1);
  const [curMessage, setCurMessage] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [cookies] = useCookies(['userId']);

  //To handle the hate speech reminder snackbar
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackColor, setFeedbackColor] = useState<AlertColor>('info');

  const MAX_MSG_LENGTH = 2000;

  useEffect(() => {
    if (cookies.userId) {
      getFollowingOfUserIdInFollowers(cookies.userId).then((mutualUsers) => {
        setUsers(mutualUsers);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit() {
    if (forUserId === -1) {
      setFeedbackMessage('Pick a user');
      setFeedbackColor('warning');
      setSnackbarOpen(true);
      return;
    }
    if (curMessage.length > MAX_MSG_LENGTH) {
      setFeedbackMessage(`Text is too long (max ${MAX_MSG_LENGTH} characters)`);
      setFeedbackColor('error');
      setSnackbarOpen(true);
      return;
    }
    const rec: CreateRecommendationDTO = {
      recommendedMovieMovieId: movie.movieId,
      sendingUserUserId: cookies.userId as number,
      receivingUserUserId: forUserId,
      message: curMessage,
    };

    // check for hatespeech
    const response = await getContainsHateSpeech(curMessage);
    if (response) {
      setFeedbackMessage('Profanity detected');
      setFeedbackColor('error');
      setSnackbarOpen(true);
      return;
    }

    // save movie to db
    const resMovie = await createMovie(movie);
    if (!resMovie) {
      setFeedbackMessage('Error sending recommendation');
      setFeedbackColor('error');
      setSnackbarOpen(true);
      return;
    }

    // save recommendation to db
    const res = await postOrUpdateRecommendation(rec);
    if (!res) {
      setFeedbackMessage('Error sending recommendation');
      setFeedbackColor('error');
      setSnackbarOpen(true);
      return;
    }

    // success
    setFeedbackMessage('Recommendation sent');
    setFeedbackColor('success');
    setSnackbarOpen(true);
    setForUserId(-1);
    setOpen(false);
  }

  function handleCancel() {
    setForUserId(-1);
    setOpen(false);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    const { value } = e.target;

    // when search field is empty, show all possible mutual users
    if (value === '') {
      if (cookies.userId) {
        getFollowingOfUserIdInFollowers(cookies.userId).then((mutualUsers) => {
          setUsers(mutualUsers);
        });
      }
      return;
    }

    // filter user list
    searchUsersByUserNameQuery(value).then((users) => {
      setUsers(users);
    });
  }

  function handleMessageChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    const { value } = e.target;
    setCurMessage(value);
  }

  function handleForUserChange(userId: number) {
    setForUserId(userId);
  }

  return (
    <Paper>
      <Dialog
        open={open}
        maxWidth={'lg'}
        fullWidth={true}
        onClose={() => {
          handleCancel();
        }}
      >
        <DialogTitle>Send Recommendation</DialogTitle>
        <DialogContent>
          <Stack direction={'column'} margin={1}>
            <TextField
              margin={'dense'}
              id={'search'}
              label={'Search User'}
              variant={'standard'}
              type={'text'}
              onChange={handleSearchChange}
            />
            <NewRecommendationUsersList
              curUserId={forUserId}
              users={users}
              handleChange={handleForUserChange}
            />
            <TextField
              margin={'dense'}
              id={'message'}
              label={'Message'}
              variant={'standard'}
              type={'text'}
              multiline={true}
              maxRows={5}
              onChange={handleMessageChange}
            />
          </Stack>
          <DialogActions>
            <Button
              onClick={() => {
                handleCancel();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSubmit();
              }}
            >
              Send
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <FeedbackSnackbar
        isOpen={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={feedbackMessage}
        severity={feedbackColor}
      />
    </Paper>
  );
}

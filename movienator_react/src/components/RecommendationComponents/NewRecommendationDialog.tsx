import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { User } from '../../types/User';
import {
  getFollowingOfUserIdInFollowers,
  searchUsersByUserNameQuery,
} from '../../services/UserService';
import NewRecommendationUsersList from './NewRecommendationUsersList';
import CustomizedSnackbars from '../GeneralComponents/FeedbackSnackbar';
import { AlertColor } from '@mui/material/Alert';
import { postOrUpdateRecommendation } from '../../services/RecommendationService';
import { useCookies } from 'react-cookie';
import { CreateRecommendationDTO } from '../../types/Recommendation';
import { Movie } from '../../types/Movie';
import { getContainsHateSpeech } from '../../services/ExternService';
import { createMovie } from '../../services/MovieService';

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
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>('');
  const [severity, setSeverity] = useState<AlertColor>('warning');
  const [cookies] = useCookies(['userId']);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms)); // eher nicht die beste Lösung https://timmousk.com/blog/typescript-sleep/
  const showMessage = async () => {
    setShowSnackBar(true);
    await sleep(1000);
    setShowSnackBar(false);
  };

  useEffect(() => {
    if (cookies.userId) {
      getFollowingOfUserIdInFollowers(cookies.userId).then((mutualUsers) => {
        setUsers(mutualUsers);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit() {
    if (forUserId === -1) {
      setSnackBarMessage('Pick a user');
      setSeverity('warning');
      showMessage();
      return;
    }
    if (curMessage.length > 1999) {
      setSnackBarMessage('Message to long');
      setSeverity('error');
      showMessage();
      return;
    }
    const rec: CreateRecommendationDTO = {
      recommendedMovieMovieId: movie.movieId,
      sendingUserUserId: cookies.userId as number,
      receivingUserUserId: forUserId,
      message: curMessage,
    };
    getContainsHateSpeech(curMessage).then((response) => {
      if (response) {
        setSnackBarMessage('Profanity detected');
        setSeverity('error');
        showMessage();
      } else {
        createMovie(movie).then((resMovie) => {
          if (resMovie) {
            postOrUpdateRecommendation(rec).then((res) => {
              if (!res) {
                setSnackBarMessage('Error Saving Recommendation');
                setSeverity('error');
                showMessage();
              } else {
                setSnackBarMessage('Recommendation sent');
                setSeverity('success');
                showMessage();
                setForUserId(-1);
                setOpen(false);
              }
            });
          } else {
            console.log('Error saving Movie');
          }
        });
      }
    });
  }

  function handleCancel() {
    setForUserId(-1);
    setOpen(false);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    const { value } = e.target;
    if (value != '') {
      searchUsersByUserNameQuery(value).then((users) => {
        setUsers(users);
      });
    } else {
      if (cookies.userId) {
        getFollowingOfUserIdInFollowers(cookies.userId).then((mutualUsers) => {
          setUsers(mutualUsers);
        });
      }
    }
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
    <>
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
      <CustomizedSnackbars
        activated={showSnackBar}
        message={snackBarMessage}
        severity={severity}
      />
    </>
  );
}

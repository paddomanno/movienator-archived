import React, { useEffect, useState } from 'react';
import { Review } from '../../types/Review';
import {
  deleteReviewToMovieIdAndUserId,
  getOneReviewToUserIdAndMovieId,
  createReview,
  updateReview,
} from '../../services/ReviewService';
import { useCookies } from 'react-cookie';
import {
  AlertColor,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { grey } from '@mui/material/colors';
import { createMovie } from '../../services/MovieService';
import { SingleMovieProps } from '../../props/MovieProps';
import { getContainsHateSpeech } from '../../services/ExternService';
import FeedbackSnackbar from '../GeneralComponents/FeedbackSnackbar';

type InputData = {
  title: string;
  comment: string;
  rating: number;
};
export default function MovieOwnReview({ movie }: SingleMovieProps) {
  const defaultData: InputData = {
    title: '',
    comment: '',
    rating: 0,
  };
  const [review, setReview] = useState<Review | null>(null);
  const [inputData, setInputData] = useState<InputData>(defaultData);
  const [editing, setEditing] = useState<boolean>(true);
  const [cookies] = useCookies(['userName', 'userId']);
  const [oldData, setOldData] = useState<InputData>(defaultData);

  //To handle the hate speech reminder snackbar
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackColor, setFeedbackColor] = useState<AlertColor>('info');

  const hateSpeechErrorMessage = 'Reviews are not allowed to contain profanity';
  const hateSpeechAlertColor: AlertColor = 'warning';
  const generalErrorMessage = 'Error saving review';
  const generalAlertColor: AlertColor = 'error';

  const MAX_COMMENT_LENGTH = 3000;

  useEffect(() => {
    // query db for already existing review
    getOneReviewToUserIdAndMovieId(
      cookies.userId as number,
      movie.movieId
    ).then((review) => {
      setReview(review);

      // if a review already exists, it is shown and editing is disabled
      if (review != null) {
        setInputData({
          ...inputData,
          ['title']: review.title,
          ['comment']: review.content,
          ['rating']: review.rating,
        });
        setEditing(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeRating(newRating: number) {
    if (editing) {
      setInputData({
        ...inputData,
        ['rating']: newRating,
      });
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value !== '') {
      const textField: HTMLElement | null = document.getElementById(
        `${name}-input`
      );
      if (textField != null) {
        textField.style.backgroundColor = grey.A200;
      }
    }
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  function startEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOldData(inputData);
    setEditing(true);
  }
  function cancelEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setInputData(oldData);
    setEditing(false);
  }

  function postReviewToBackend(newReview: Review) {
    createReview(newReview).then((result) => {
      if (!result) {
        setFeedbackMessage(generalErrorMessage);
        setFeedbackColor(generalAlertColor);
        setSnackbarOpen(true);
      } else {
        setReview(newReview);
        setEditing(false);
      }
    });
  }

  function updateReviewToBackend(newReview: Review) {
    updateReview(newReview).then((result) => {
      if (!result) {
        setFeedbackMessage('Error updating review');
        setFeedbackColor(generalAlertColor);
        setSnackbarOpen(true);
      } else {
        setReview(review);
        setEditing(false);
      }
    });
  }

  async function saveReview() {
    const newReview: Review = {
      reviewMovieMovieId: movie.movieId,
      reviewUserUserId: cookies.userId as number,
      title: inputData.title,
      content: inputData.comment,
      rating: inputData.rating,
      lastUpdated: new Date(),
      review_user: null,
      review_movie: null,
    };
    // getting hatespeech results
    try {
      const containsHatespeech = await getContainsHateSpeech(
        newReview.title + ' ' + newReview.content
      );

      if (containsHatespeech) {
        setFeedbackMessage(hateSpeechErrorMessage);
        setFeedbackColor(hateSpeechAlertColor);
        setSnackbarOpen(true);
        return;
      }

      // save movie to db
      const result = await createMovie(movie);
      if (!result) {
        throw 'Error saving movie';
      }

      // checking if review exists already
      const existingReview = await getOneReviewToUserIdAndMovieId(
        newReview.reviewUserUserId,
        newReview.reviewMovieMovieId
      );
      if (!existingReview) {
        postReviewToBackend(newReview);
      } else {
        updateReviewToBackend(newReview);
      }
    } catch (error) {
      setFeedbackMessage(generalErrorMessage);
      setFeedbackColor(generalAlertColor);
      setSnackbarOpen(true);
    }
  }

  function handleErrorTextToLong() {
    const textField: HTMLElement | null =
      document.getElementById(`comment-input`);
    if (textField != null) {
      textField.style.backgroundColor = 'orange';
    }
  }

  function handleErrorFieldsEmpty() {
    (Object.keys(inputData) as (keyof InputData)[]).forEach((key) => {
      if (inputData[key] === '') {
        const textField: HTMLElement | null = document.getElementById(
          `${key}-input`
        );
        if (textField != null) {
          textField.style.backgroundColor = 'orange';
        }
      }
    });
  }

  function saveEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (inputData.title === '' || inputData.comment === '') {
      handleErrorFieldsEmpty();
      return;
    }

    if (inputData.comment.length > MAX_COMMENT_LENGTH) {
      handleErrorTextToLong();
      return;
    }

    saveReview();
  }

  function delReview(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    deleteReviewToMovieIdAndUserId(
      movie.movieId,
      cookies.userId as number
    ).then((res) => {
      if (!res) {
        setFeedbackMessage('Error deleting review');
        setFeedbackColor(generalAlertColor);
        setSnackbarOpen(true);
        return;
      }
      setEditing(false);
      setInputData(defaultData);
      setReview(null);
    });
  }

  const stars = (
    <Stack direction={'row'}>
      {[...Array(inputData.rating)].map((_, i) => (
        <StarIcon
          key={i}
          fontSize={'large'}
          id={`star${i}`}
          onClick={() => {
            changeRating(i + 1);
          }}
        />
      ))}
      {[...Array(5 - inputData.rating)].map((_, i) => (
        <StarBorderIcon
          key={i}
          fontSize={'large'}
          id={`starBorder${i}`}
          onClick={() => {
            changeRating(inputData.rating + i + 1);
          }}
        />
      ))}
    </Stack>
  );

  const buttons = (
    <Stack direction={'column'} alignItems={'center'} spacing={1}>
      {editing ? (
        <Stack direction={'row'} spacing={1}>
          <Button variant={'contained'} onClick={cancelEdit}>
            Cancel
          </Button>
          <Button variant={'contained'} onClick={saveEdit}>
            Save
          </Button>
        </Stack>
      ) : (
        <Button variant={'contained'} onClick={startEdit}>
          {review == null ? 'Write Review' : 'Edit Review'}
        </Button>
      )}
      {review != null ? (
        <Button variant={'contained'} onClick={delReview}>
          Delete Review
        </Button>
      ) : (
        <></>
      )}
    </Stack>
  );

  const leftColumn = (
    <Stack
      direction={'column'}
      width={'30%'}
      alignItems={'center'}
      justifyContent={'space-between'}
      spacing={2}
    >
      <Typography>
        {review == null
          ? 'Watched the movie? Leave a review for it'
          : 'Edit your review by pressing the button'}
      </Typography>
      {buttons}
    </Stack>
  );
  const rightColumn = (
    <Stack direction={'column'} width={'70%'} alignItems={'center'} spacing={2}>
      {stars}
      <TextField
        sx={{ minWidth: '100%' }}
        id={'title-input'}
        name={'title'}
        label={'Title'}
        type={'text'}
        disabled={!editing}
        value={inputData.title}
        onChange={handleInputChange}
      />
      <TextField
        sx={{ minWidth: '100%' }}
        id={'comment-input'}
        name={'comment'}
        label={'Comment'}
        type={'text'}
        disabled={!editing}
        multiline={true}
        minRows={7}
        maxRows={12}
        value={inputData.comment}
        onChange={handleInputChange}
      />
    </Stack>
  );

  return (
    <Card sx={{ backgroundColor: grey.A200, flexGrow: 1 }}>
      <CardContent>
        <Stack direction={'row'} spacing={1}>
          {leftColumn}
          <Divider orientation={'vertical'} variant={'middle'} flexItem />
          {rightColumn}
        </Stack>
      </CardContent>
      <FeedbackSnackbar
        isOpen={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={feedbackMessage}
        severity={feedbackColor}
      />
    </Card>
  );
}

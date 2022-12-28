import React, { useEffect, useState } from 'react';
import { Review } from '../../types/Review';
import {
  deleteReview,
  getOneReview,
  postNewReview,
  updateReview,
} from '../../services/ReviewService';
import { useCookies } from 'react-cookie';
import {
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
import { grey, red } from '@mui/material/colors';
import { saveMovie } from '../../services/MovieService';
import { SingleMovieProps } from '../../props/MovieProps';

type InputData = {
  title: string;
  comment: string;
  rating: number;
};
export default function MovieOwnReview({ movie }: SingleMovieProps) {
  let defaultData: InputData = {
    title: '',
    comment: '',
    rating: 0,
  };
  const [review, setReview] = useState<Review | null>(null);
  const [inputData, setInputData] = useState<InputData>(defaultData);
  const [editing, setEditing] = useState<boolean>(true);
  const [cookies] = useCookies(['userName', 'userId']);
  const [oldData, setOldData] = useState<InputData>(defaultData);

  useEffect(() => {
    getOneReview(cookies.userId as number, movie.movieId).then((review) => {
      setReview(review);
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
  }, []);

  function changeRating(newRating: number) {
    if (editing) {
      setInputData({
        ...inputData,
        ['rating']: newRating,
      });
    }
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (value !== '') {
      let textField: HTMLElement | null = document.getElementById(
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

  function startEdit(e: any) {
    e.preventDefault();
    setOldData(inputData);
    setEditing(true);
  }
  function cancelEdit(e: any) {
    e.preventDefault();
    setInputData(oldData);
    setEditing(false);
  }
  function saveEdit(e: any) {
    e.preventDefault();
    if (inputData.title !== '' && inputData.comment !== '') {
      let newReview: Review = {
        reviewMovieMovieId: movie.movieId,
        reviewUserUserId: cookies.userId as number,
        title: inputData.title,
        content: inputData.comment,
        rating: inputData.rating,
        lastUpdated: new Date(),
        review_user: null,
        review_movie: null,
      };
      saveMovie(movie).then((res) => {
        if (res) {
          getOneReview(
            newReview.reviewUserUserId,
            newReview.reviewMovieMovieId
          ).then((revRes) => {
            if (revRes == null) {
              postNewReview(newReview).then((r) => {
                if (!r) {
                  console.log('Error saving review');
                } else {
                  setReview(newReview);
                  setEditing(false);
                }
              });
            } else {
              updateReview(newReview).then((r) => {
                if (!r) {
                  console.log('Error updating review');
                } else {
                  setReview(review);
                  setEditing(false);
                }
              });
            }
          });
        } else {
          console.log('Error saving movie');
        }
      });
    } else {
      (Object.keys(inputData) as (keyof InputData)[]).forEach((key) => {
        if (inputData[key] === '') {
          let textField: HTMLElement | null = document.getElementById(
            `${key}-input`
          );
          if (textField != null) {
            textField.style.backgroundColor = 'orange';
          }
        }
      });
    }
  }

  function delReview(e: any) {
    e.preventDefault();
    deleteReview(movie.movieId, cookies.userId as number).then((res) => {
      if (res) {
        setEditing(false);
        setInputData(defaultData);
        setReview(null);
      }
    });
  }
  let stars = (
    <Stack direction={'row'}>
      {[...Array(inputData.rating)].map((x, i) => (
        <StarIcon
          fontSize={'large'}
          id={`star${i}`}
          onClick={(e) => {
            changeRating(i + 1);
          }}
        />
      ))}
      {[...Array(5 - inputData.rating)].map((x, i) => (
        <StarBorderIcon
          fontSize={'large'}
          id={`starBorder${i}`}
          onClick={(e) => {
            changeRating(inputData.rating + i + 1);
          }}
        />
      ))}
    </Stack>
  );

  let buttons = (
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

  let leftColumn = (
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
  let rightColumn = (
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
    </Card>
  );
}

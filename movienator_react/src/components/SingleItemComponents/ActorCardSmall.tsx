import { useNavigate } from 'react-router-dom';
import { IconButton, Paper, Typography } from '@mui/material';
import { SingleActorProps } from '../../props/ActorProps';

export default function ActorCardSmall({ actor }: SingleActorProps) {
  const navigate = useNavigate();
  function manageClick() {
    navigate('/actor/' + actor.actorId);
  }
  return (
    <IconButton onClick={manageClick}>
      <Paper
        elevation={0}
        variant={'outlined'}
        sx={{
          minWidth: 100,
          maxWidth: 100,
          minHeight: 75,
          maxHeight: 75,
          textAlign: 'center',
          verticalAlign: 'middle',
        }}
      >
        <Typography>{actor.name}</Typography>
      </Paper>
    </IconButton>
  );
}

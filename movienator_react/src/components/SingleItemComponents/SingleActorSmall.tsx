import { Actor } from '../../types/Actor';
import { useNavigate } from 'react-router-dom';
import { IconButton, Paper, Typography } from '@mui/material';

export default function SingleActorSmall(props: any) {
  let actor: Actor = props.data as Actor;
  const navigate = useNavigate();
  function manageClick() {
    navigate('/actor/' + actor.actorId);
  }
  return (
    <IconButton onClick={manageClick}>
      <Paper
        elevation={6}
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

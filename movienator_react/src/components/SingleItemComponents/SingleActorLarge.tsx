import { Genre } from '../../types/Genre';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { Actor } from '../../types/Actor';

export default function SingleActorLarge(props: any) {
  let actor: Actor = props.data as Actor;
  const navigate = useNavigate();
  function manageClick() {
    navigate('/actor/' + actor.actorId);
  }
  return (
    <Paper
      onClick={manageClick}
      elevation={6}
      variant={'outlined'}
      sx={{
        minWidth: 100,
        maxWidth: 100,
        minHeight: 100,
        maxHeight: 100,
        textAlign: 'center',
        verticalAlign: 'middle',
      }}
    >
      <Typography>{actor.name}</Typography>
    </Paper>
  );
}

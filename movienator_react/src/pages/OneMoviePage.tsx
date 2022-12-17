//Route: movienator3000.com/movie/:movieId
import { useParams } from 'react-router-dom';

export default function OneMoviePage() {
  const { movieId } = useParams();
  return <div>Hier ist die One Movie Page von {movieId} </div>;
}

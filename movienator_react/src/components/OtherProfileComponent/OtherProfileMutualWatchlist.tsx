import { MovieListProps } from '../../props/MovieProps';

export default function OtherProfileMutualWatchlist({
  movies,
}: MovieListProps) {
  return (
    <div>
      List of movies both users have in their watchlist (can just use MoviesList
      with a title)
    </div>
  );
}

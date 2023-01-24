import { ProfileImage } from './ProfileImage';
import { Review } from './Review';
import { Movie } from './Movie';

export type User = {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  comment: string;
  birthday: Date;
  profileImage: ProfileImage | null;
  reviews: Review[];
  following: User[];
  followers: User[];
  watchlist: Movie[];
};

export type NullableUser = Omit<User, 'userId'> & { userId: number | null };

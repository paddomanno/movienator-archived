import Movie from '../entity/movie';
import User from '../entity/user';
import Fuse from 'fuse.js';
import expressUser from 'express';
const userRouter = expressUser.Router();

//Gets all users from the database
userRouter.get('/all', async (req, res) => {
  try {
    const allUsers = await User.find({
      relations: {
        reviews: true,
        following: true,
        followers: true,
        watchlist: true,
        profileImage: true,
      },
    });
    if (allUsers) {
      allUsers.sort((a, b) => a.lastName.localeCompare(b.lastName));
      return res.status(200).json({
        data: allUsers,
      });
    } else {
      return res.status(404).json();
    }
  } catch (e) {
    return res.status(500).json();
  }
});

//Get the user with that id
userRouter.get('/one/id/:id', async (req, res) => {
  try {
    const resultUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: [
        'reviews',
        'following',
        'followers',
        'watchlist',
        'profileImage',
        'followers.profileImage',
        'following.profileImage',
      ],
    });
    if (resultUser) {
      return res.status(200).json({
        data: resultUser,
      });
    } else {
      return res.status(404).json();
    }
  } catch (e) {
    return res.status(500).json();
  }
});

//Get the user with that username (should only be one)
userRouter.get('/one/username/:username', async (req, res) => {
  try {
    const resultUser = await User.findOne({
      where: { userName: req.params.username },
      relations: [
        'reviews',
        'following',
        'followers',
        'watchlist',
        'profileImage',
        'followers.profileImage',
        'following.profileImage',
      ],
    });
    if (resultUser) {
      return res.status(200).json({
        data: resultUser,
      });
    } else {
      return res.status(404).json();
    }
  } catch (e) {
    return res.status(500).json();
  }
});

//Get all the users where the username is fitting the search word (might be more than 1)
userRouter.get('/username/:word', async (req, res) => {
  try {
    const allUsers = await User.find({
      relations: {
        reviews: true,
        following: true,
        followers: true,
        watchlist: true,
        profileImage: true,
      },
    });

    if (!allUsers) {
      return res.status(404).json();
    }

    const query: string = req.params.word;

    // define fuse for fuzzy search
    const fuseOptions = {
      keys: ['firstName', 'lastName', 'userName'],
    };
    const fuse = new Fuse<User>(allUsers, fuseOptions);

    // filter users
    const matchingUsers: User[] = fuse
      .search(query)
      .map((result: Fuse.FuseResult<User>) => result.item);

    return res.status(200).json({
      data: matchingUsers,
    });
  } catch (e) {
    return res.status(500).json();
  }
});

//Gets all the users that are following a single user
userRouter.get('/followers/:id', async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: [
        'followers',
        'followers.reviews',
        'followers.following',
        'followers.followers',
        'followers.watchlist',
        'followers.profileImage',
      ],
    });
    if (requestedUser) {
      return res.status(200).json({
        data: requestedUser.followers,
      });
    } else {
      return res.status(404).json();
    }
  } catch (e) {
    return res.status(500).json();
  }
});

//Gets all the users that a single user is following
userRouter.get('/following/:id', async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: [
        'following',
        'following.reviews',
        'following.following',
        'following.followers',
        'following.watchlist',
        'followers.profileImage',
      ],
    });
    if (requestedUser) {
      return res.status(200).json({
        data: requestedUser.following,
      });
    } else {
      return res.status(404).json();
    }
  } catch (e) {
    return res.status(500).json();
  }
});

//Gets all the user that person is following that are also following back
userRouter.get('/followingMutual/:uId', async (req, res) => {
  try {
    if (isNaN(+req.params.uId)) {
      throw 'Not a number';
    }
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
      relations: [
        'following',
        'followers',
        'followers.reviews',
        'followers.following',
        'followers.followers',
        'followers.watchlist',
        'followers.profileImage',
      ],
    });
    if (!requestedUser) {
      return res.status(404).json();
    }
    // collect all users who are followers of the user
    // and who also follow them back
    const resUsers: User[] = [];
    requestedUser.followers.forEach((user) => {
      if (
        requestedUser.following.some((userB) => {
          return user.userId == userB.userId;
        })
      ) {
        resUsers.push(user);
      }
    });
    return res.status(200).json({
      data: resUsers,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json();
  }
});

//Gets all the users that the one user is following and have reviewed the movie
userRouter.get('/following/:id/rated/:mId', async (req, res) => {
  try {
    const resultUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: [
        'following',
        'following.reviews',
        'following.reviews.review_movie',
        'following.following',
        'following.followers',
        'following.watchlist',
        'following.profileImage',
      ],
    });
    const resultMovie = await Movie.findOne({
      where: { movieId: parseInt(req.params.mId) },
    });

    if (!resultUser || !resultMovie) {
      return res.status(404).json();
    }
    const matchingUsers: User[] = [];
    // collect all users that the user is following
    // and who also reviewed the given movie
    resultUser.following.forEach((currentUser) => {
      currentUser.reviews.forEach((currentReview) => {
        if (currentReview.review_movie.movieId === resultMovie.movieId)
          matchingUsers.push(currentUser);
      });
    });
    return res.status(200).json({
      data: matchingUsers,
    });
  } catch (e) {
    return res.status(500).json();
  }
});

//Gets all the users that the one user is following and have the movie on their watchlist
userRouter.get('/following/:id/watchlist/:mId', async (req, res) => {
  try {
    const resultUser: User = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: [
        'following',
        'following.watchlist',
        'following.following',
        'following.followers',
        'following.reviews',
        'following.profileImage',
      ],
    });
    const resultMovie: Movie = await Movie.findOne({
      where: { movieId: parseInt(req.params.mId) },
    });

    if (!resultUser || !resultMovie) {
      return res.status(404).json();
    }
    const matchingUsers: User[] = [];
    // collect all users that the user is following
    // and who also have the given movie on their watchlist
    resultUser.following.forEach((currentUser) => {
      currentUser.watchlist.forEach((oneMovie) => {
        if (oneMovie.movieId === resultMovie.movieId)
          matchingUsers.push(currentUser);
      });
    });
    return res.status(200).json({
      data: matchingUsers,
    });
  } catch (e) {
    return res.status(500).json();
  }
});

//Insert a new User, userId should be NULL when inserting
userRouter.post('/', async (req, res) => {
  try {
    if (req.body.userId == null) {
      const newUser: User = await User.save(req.body);
      return res.status(201).json({
        data: newUser,
      });
    } else {
      return res.status(500).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//User a is now following user b
//Only "following" should need to be updated. "followers" on b should be updated automatically through ORM
userRouter.post('/follow/:aId/:bId', async (req, res) => {
  try {
    const userA = await User.findOne({
      where: { userId: parseInt(req.params.aId) },
      relations: ['following'],
    });
    const userB = await User.findOne({
      where: { userId: parseInt(req.params.bId) },
    });
    if (userA && userB) {
      if (userA.following == null) {
        userA.following = [];
      }
      userA.following.push(userB);
      await userA.save();
      return res.status(201).json();
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Adds the movie with that Id to the watchlist of that user
userRouter.post('/watchlist/:uId/:mId', async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
      relations: ['watchlist'],
    });
    const requestedMovie = await Movie.findOne({
      where: { movieId: parseInt(req.params.mId) },
    });
    if (requestedUser && requestedMovie) {
      if (requestedUser.watchlist == null) {
        requestedUser.watchlist = [];
      }
      requestedUser.watchlist.push(requestedMovie);
      await requestedUser.save();
      return res.status(201).json();
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Updates the User send in the body. Do NOT update the primary key or Relations
userRouter.put('/', async (req, res) => {
  try {
    const updatedUser = req.body as User;
    const requestedUser = await User.findOne({
      where: { userId: updatedUser.userId },
      relations: {},
    });
    if (!requestedUser) {
      return res.status(404).json();
    }
    Object.keys(updatedUser).forEach((key) => {
      if (
        key != 'userId' &&
        key != 'reviews' &&
        key != 'following' &&
        key != 'followers' &&
        key != 'watchlist'
      ) {
        requestedUser[key] = req.body[key];
      }
    });
    await requestedUser.save();

    return res.status(201).json({
      data: requestedUser,
    });
  } catch (er) {
    return res.status(500).json();
  }
});

//Delete the user with that id.
//Make sure the reviews are delete too and he is removed from all following lists (play around with cascade annotation)
userRouter.delete('/:id', async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
    });
    if (requestedUser) {
      await requestedUser.remove();
      return res.status(204).json();
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    return res.status(500).json();
  }
});

//User a is now no more following user b
//Only "following" should need to be updated. "followers" on b should be updated automatically through ORM
userRouter.delete('/follow/:aId/:bId', async (req, res) => {
  try {
    const userA = await User.findOne({
      where: { userId: parseInt(req.params.aId) },
      relations: ['following'],
    });
    const userB = await User.findOne({
      where: { userId: parseInt(req.params.bId) },
    });
    if (userA && userB) {
      userA.following = userA.following.filter((user) => {
        return user.userId != userB.userId;
      });
      await userA.save();
      return res.status(204).json({
        data: userA,
      });
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Deletes the movie with that Id from that users watchlist
userRouter.delete('/watchlist/:uId/:mId', async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
      relations: ['watchlist'],
    });
    const requestedMovie = await Movie.findOne({
      where: { movieId: parseInt(req.params.mId) },
    });
    if (requestedUser && requestedMovie) {
      requestedUser.watchlist = requestedUser.watchlist.filter((movie) => {
        return movie.movieId != requestedMovie.movieId;
      });
      await requestedUser.save();
      return res.status(204).json();
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

export default userRouter;

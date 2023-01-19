import Movie from '../entity/movie';
import User from '../entity/user';
import ProfileImage from '../entity/profileImage';
import Fuse from 'fuse.js';
const expressUser = require('express');
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
      res.status(200).json({
        data: allUsers,
      });
    } else {
      res.status(404).json();
    }
  } catch (e) {
    res.status(500).json();
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
      res.status(200).json({
        data: resultUser,
      });
    } else {
      res.status(404).json();
    }
  } catch (e) {
    res.status(500).json();
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
      res.status(200).json({
        data: resultUser,
      });
    } else {
      res.status(404).json();
    }
  } catch (e) {
    res.status(500).json();
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

    if (allUsers) {
      let query: string = req.params.word;
      // allUsers.forEach((currentUser) => {
      //   //If the query is a substring of the current users username
      //   if (currentUser.userName.toLowerCase().includes(query.toLowerCase())) {
      //     matchingUsers.push(currentUser);
      //   }
      // });

      // define fuse for fuzzy search
      const fuseOptions = {
        keys: ['firstName', 'lastName', 'userName'],
      };
      const fuse = new Fuse<User>(allUsers, fuseOptions);

      // filter users
      const matchingUsers: User[] = fuse
        .search(query)
        .map((result: Fuse.FuseResult<User>) => result.item);

      res.status(200).json({
        data: matchingUsers,
      });
    } else {
      res.status(404).json();
    }
  } catch (e) {
    res.status(500).json();
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
      res.status(200).json({
        data: requestedUser.followers,
      });
    } else {
      res.status(404).json();
    }
  } catch (e) {
    res.status(500).json();
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
      res.status(200).json({
        data: requestedUser.following,
      });
    } else {
      res.status(404).json();
    }
  } catch (e) {
    res.status(500).json();
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
    if (requestedUser != null) {
      let resUsers: User[] = [];
      requestedUser.followers.forEach((user) => {
        if (
          requestedUser.following.some((userB) => {
            return user.userId == userB.userId;
          })
        ) {
          resUsers.push(user);
        }
      });
      res.status(200).json({
        data: resUsers,
      });
    } else {
      res.status(404).json();
    }
  } catch (e) {
    console.log(e);
    res.status(500).json();
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

    if (resultUser && resultMovie) {
      let matchingUsers: User[] = [];
      //Iterate over all users the requested user is following
      resultUser.following.forEach((currentUser) => {
        //Iterate over all reviews of the current user
        currentUser.reviews.forEach((currentReview) => {
          if (currentReview.review_movie.movieId === resultMovie.movieId)
            matchingUsers.push(currentUser);
        });
      });
      res.status(200).json({
        data: matchingUsers,
      });
    } else {
      res.status(404).json();
    }
  } catch (e) {
    res.status(500).json();
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

    if (resultUser && resultMovie) {
      let matchingUsers: User[] = [];
      //Iterate over all users the requested user is following
      resultUser.following.forEach((currentUser) => {
        //Iterate over all reviews of the current user
        currentUser.watchlist.forEach((oneMovie) => {
          if (oneMovie.movieId === resultMovie.movieId)
            matchingUsers.push(currentUser);
        });
      });
      res.status(200).json({
        data: matchingUsers,
      });
    } else {
      res.status(404).json();
    }
  } catch (e) {
    res.status(500).json();
  }
});

//Insert a new User, userId should be NULL when inserting
userRouter.post('/', async (req, res) => {
  try {
    if (req.body.userId == null) {
      const newUser: User = await User.save(req.body);
      res.status(201).json({
        data: newUser,
      });
    } else {
      res.status(500).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
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
      res.status(201).json();
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
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
      res.status(201).json();
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Updates the User send in the body. Do NOT update the primary key or Relations
userRouter.put('/', async (req, res) => {
  try {
    let updatedUser = req.body as User;
    const requestedUser = await User.findOne({
      where: { userId: updatedUser.userId },
      relations: {},
    });
    if (requestedUser) {
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

      res.status(201).json({
        data: requestedUser,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    res.status(500).json();
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
      res.status(204).json();
    } else {
      res.status(404).json();
    }
  } catch (er) {
    res.status(500).json();
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
      res.status(204).json({
        data: userA,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
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
      res.status(204).json();
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

module.exports = userRouter;

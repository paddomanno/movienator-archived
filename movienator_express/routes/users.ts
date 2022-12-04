import Movie from "../entity/movie";
import User from "../entity/user";
const expressUser = require("express");
const userRouter = expressUser.Router();

//TODO Routing implementieren

//Gets all users from the database
userRouter.get("/all", async (req, res) => {
  console.log("Requested all users");
  try {
    const allUsers = await User.find({
      relations: ["reviews", "following", "followers", "watchlist"],
    });
    if (allUsers) {
      allUsers.sort((a, b) => a.lastName.localeCompare(b.lastName));

      res.status(200).json({
        reply: "Found " + allUsers.length + " users",
        user: allUsers,
      });
    } else {
      res.status(404).json({
        reply: "No users found",
      });
    }
  } catch (e) {
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//Get the user with that id
userRouter.get("/one/id/:id", async (req, res) => {
  console.log("User with id" + parseInt(req.params.id) + "requested");
  try {
    const resultUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: ["reviews", "following", "followers", "watchlist"],
    });
    if (resultUser) {
      res.status(200).json({
        reply: "User found with ID " + parseInt(req.params.id),
        user: resultUser,
      });
    } else {
      res.status(404).json({
        reply: "No user with ID " + parseInt(req.params.id),
      });
    }
  } catch (e) {
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//Get the user with that username (should only be one)
userRouter.get("/one/username/:username", async (req, res) => {
  console.log(
    "User with username" + parseInt(req.params.username) + "requested"
  );
  try {
    const resultUser = await User.findOne({
      where: { userName: req.params.username },
      relations: ["reviews", "following", "followers", "watchlist"],
    });
    if (resultUser) {
      res.status(200).json({
        reply: "User found with username " + req.params.username,
        user: resultUser,
      });
    } else {
      res.status(404).json({
        reply: "No user with username " + req.params.username,
      });
    }
  } catch (e) {
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//Get all the users where the username is fitting the search word (might be more than 1)
//TODO: Find a good fuzzy search library
userRouter.get("/username/:word", async (req, res) => {});

//Gets all the users that a following a single user
userRouter.get("/followers/:id", async (req, res) => {
  console.log(
    "All followers of user with id" + parseInt(req.params.id) + "requested"
  );
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: ["followers"],
    });
    if (requestedUser) {
      res.status(200).json({
        reply:
          "Found these followers of user found with ID " +
          parseInt(req.params.id),
        followers: requestedUser.followers,
      });
    } else {
      res.status(404).json({
        reply: "No user with ID " + parseInt(req.params.id),
      });
    }
  } catch (e) {
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//Gets all the users that a single user is following
userRouter.get("/following/:id", async (req, res) => {
  console.log(
    "All users that the user with id" +
      parseInt(req.params.id) +
      " follows requested"
  );
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: ["following"],
    });
    if (requestedUser) {
      res.status(200).json({
        reply:
          "Users the user with with ID " +
          parseInt(req.params.id) +
          " is following",
        following: requestedUser.following,
      });
    } else {
      res.status(404).json({
        reply: "No user with ID " + parseInt(req.params.id),
      });
    }
  } catch (e) {
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//Gets all the users that the one user is following and have reviewed the movie
userRouter.get("/following/:id/rated/:mId", async (req, res) => {
  console.log(
    "All users that the user with ID " +
      parseInt(req.params.id) +
      " is following and that have reviewed the movie with ID " +
      req.params.mId +
      " requested"
  );

  try {
    const resultUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: ["reviews", "following"], //TODO: The reviews of the users contained in "following" is probably empty
    });
    const resultMovie = await Movie.findOne({
      where: { movieId: parseInt(req.params.mId) },
    });

    if (resultUser) {
      //If user exists
      if (resultMovie) {
        //If movie exists
        let matchingUsers: User[] = [];
        //Iterate over all users the requested user is following
        resultUser.following.forEach((currentUser) => {
          //Iterate over all reviews of the current user
          currentUser.reviews.forEach((currentReview) => {
            if (currentReview.movieMovieId === resultMovie.movieId)
              matchingUsers.push(currentUser);
          });
        });
        res.status(200).json({
          reply: "Found the following users",
          users: matchingUsers,
        });
      } else {
        res.status(404).json({
          reply: "No movie with ID " + parseInt(req.params.mId),
        });
      }
    } else {
      res.status(404).json({
        reply: "No user with ID " + parseInt(req.params.id),
      });
    }
  } catch (e) {
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//Gets all the users that the one user is following and have the movie on their watchlist
userRouter.get("/following/:id/watchlist/:mId", async (req, res) => {
  console.log(
    "All users that the user with ID " +
      parseInt(req.params.id) +
      " is following and that have the movie with ID " +
      req.params.mId +
      " on their watchlist requested"
  );

  try {
    const resultUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: ["watchlist", "following"], //TODO: The watchlist of the users contained in "following" is probably empty
    });
    const resultMovie = await Movie.findOne({
      where: { movieId: parseInt(req.params.mId) },
    });

    if (resultUser) {
      //If user exists
      if (resultMovie) {
        //If movie exists
        let matchingUsers: User[] = [];
        //Iterate over all users the requested user is following
        resultUser.following.forEach((currentUser) => {
          //Iterate over all reviews of the current user
          currentUser.watchlist.forEach((currentWatchlist) => {
            if (currentWatchlist.movieId === resultMovie.movieId)
              matchingUsers.push(currentUser);
          });
        });
        res.status(200).json({
          reply: "Found the following users",
          users: matchingUsers,
        });
      } else {
        res.status(404).json({
          reply: "No movie with ID " + parseInt(req.params.mId),
        });
      }
    } else {
      res.status(404).json({
        reply: "No user with ID " + parseInt(req.params.id),
      });
    }
  } catch (e) {
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//Insert a new User, userId should be NULL when inserting
userRouter.post("/", async (req, res) => {
  try {
    if (req.body.id == null) {
      const newUser: User = await User.save(req.body);
      res.status(200).json({
        reply: "User was saved",
        user: newUser,
      });
    } else {
      res.status(500).json({
        reply: "Request not successful",
      });
    }
  } catch (er) {
    console.log(er);
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//User a is now following user b
//Only "following" should need to be updated. "followers" on b should be updated automatically through ORM
userRouter.post("/follow/:aId/:bId", async (req, res) => {
  try {
    const userA = await User.findOne({
      where: { userId: parseInt(req.params.aId) },
      relations: ["following"],
    });
    const userB = await User.findOne({
      where: { userId: parseInt(req.params.bId) },
      //relations: ["watchlist", "following"]
      //TODO: TypeORM question: Do I need to load everything from user B in order to add him correctly to "following" of user A ?
    });
    if (userA && userB) {
      userA.following.push(userB);
      await userA.save(); //TODO: question: Is it the right way to save the user like that ?
      res.status(200).json({
        reply:
          "User with ID " +
          req.body.bId +
          " was added to following of user with ID " +
          req.params.aId,
        user: userA,
      });
    } else {
      res.status(404).json({
        reply: "At least one user does not exist",
      });
    }
  } catch (er) {
    console.log(er);
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//Adds the movie with that Id to the watchlist of that user
userRouter.post("/watchlist/:uId/:mId", async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
      relations: ["watchlist"],
    });
    const requestedMovie = await Movie.findOne({
      where: { movieId: parseInt(req.params.mID) },
    });
    if (requestedUser && requestedMovie) {
      requestedUser.watchlist.push(requestedMovie);
      await requestedUser.save(); //TODO: question: Is it the right way to save the user like that ?
      res.status(200).json({
        reply:
          "Movie with ID " +
          req.body.mId +
          " was added to the watchlist of user with ID " +
          req.params.uId,
        user: requestedUser,
      });
    } else {
      res.status(404).json({
        reply: "The requested user and/or the requested movie do not exist",
      });
    }
  } catch (er) {
    console.log(er);
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//Updates the User send in the body. Do NOT update the primary key or Relations
userRouter.put("/", async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.body.userId) },
    }); //TODO: Is req.body.userId the right call to get the id of the user that should be updated?
    if (requestedUser) {
      Object.keys(req.body).forEach((key) => {
        if (
          requestedUser.hasOwnProperty(key) &&
          req.body[key] != "" &&
          key != "userId" &&
          key != "reviews" &&
          key != "following" &&
          key != "followers" &&
          key != "watchlist"
        ) {
          requestedUser[key] = req.body[key];
        }
      });
      await requestedUser.save();

      res.status(200).json({
        reply: "Updated user with ID " + parseInt(req.body.userId), //TODO: Is req.body.userId the right call to get the id of the user that should be updated?
        recipe: requestedUser,
      });
    } else {
      res.status(404).json({
        reply: "No user with ID " + parseInt(req.body.userId), //TODO: Is req.body.userId the right call to get the id of the user that should be updated?
      });
    }
  } catch (er) {
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//Delete the user with that id.
//Make sure the reviews are delete too and he is removed from all following lists (play around with cascade annotation)
userRouter.delete("/:id", async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
    });
    if (requestedUser) {
      await requestedUser.remove(); //TODO: Add fitting cascade option
      res.status(200).json({
        reply: "Deleted user with ID " + parseInt(req.params.id),
        user: requestedUser,
      });
    } else {
      res.status(404).json({
        reply: "No user with ID " + parseInt(req.params.id),
      });
    }
  } catch (er) {
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//User a is now no more following user b
//Only "following" should need to be updated. "followers" on b should be updated automatically through ORM
userRouter.delete("/follow/:aId/:bId", async (req, res) => {
  try {
    const userA = await User.findOne({
      where: { userId: parseInt(req.params.aId) },
      relations: ["following"],
    });
    const userB = await User.findOne({
      where: { userId: parseInt(req.params.bId) },
      //relations: ["watchlist", "following"]
      //TODO: TypeORM question: Do I need to load everything from user B in order to add him correctly to "following" of user A ?
    });
    if (userA && userB) {
      for (let i = 0; i < userA.following.length; i++) {
        if (userA.following[i].userId === userB.userId) {
          userA.following.splice(i, 1);
          break;
        }
      }
      await userA.save(); //TODO: question: Is it the right way to save the user like that ?
      res.status(200).json({
        reply:
          "User with ID " +
          req.body.bId +
          " was added to following of user with ID " +
          req.params.aId,
        user: userA,
      });
    } else {
      res.status(404).json({
        reply: "At least one user does not exist",
      });
    }
  } catch (er) {
    console.log(er);
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

//Deletes the movie with that Id from that users watchlist
userRouter.delete("/follow/:uId/:mId", async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
      relations: ["watchlist"],
    });
    const requestedMovie = await Movie.findOne({
      where: { movieId: parseInt(req.params.mId) },
      //relations: ["watchlist", "following"]
      //TODO: TypeORM question: Do I need to load everything from user B in order to add him correctly to "following" of user A ?
    });
    if (requestedUser && requestedMovie) {
      for (let i = 0; i < requestedUser.watchlist.length; i++) {
        if (requestedUser.watchlist[i].movieId === requestedMovie.movieId) {
          requestedUser.watchlist.splice(i, 1);
          break;
        }
      }
      await requestedUser.save(); //TODO: question: Is it the right way to save the user like that ?
      res.status(200).json({
        reply:
          "Movie with ID " +
          req.body.mId +
          " was deleted from the watchlist of user with ID " +
          req.params.uId,
        user: requestedUser,
      });
    } else {
      res.status(404).json({
        reply: "The requested user and/or the requested movie do not exist",
      });
    }
  } catch (er) {
    console.log(er);
    res.status(500).json({
      reply: "Request not successful",
    });
  }
});

module.exports = userRouter;

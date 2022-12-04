import User from "../entity/user";
const expressUser = require("express");
const userRouter = expressUser.Router();

//TODO Routing implementieren

//Gets all users from the database
userRouter.get("/all", async (req, res) => {
  console.log("Requested all users");
  try {
    const allUsers = await User.find(); //Maybe here we need the relations of users following each other and reviews and watchlist
    if (allUsers) {
      allUsers.sort((a, b) => a.lastName.localeCompare(b.lastName));

      res.status(200).json({
        success: true,
        reply: "Found " + allUsers.length + " users",
        user: allUsers,
      });
    } else {
      res.status(404).json({
        success: false,
        reply: "No users found",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
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
      //Maybe here we need the relations of users following each other and reviews and watchlist
    });
    if (resultUser) {
      res.status(200).json({
        success: true,
        reply: "User found with ID " + parseInt(req.params.id),
        user: resultUser,
      });
    } else {
      res.status(404).json({
        success: false,
        reply: "No user with ID " + parseInt(req.params.id),
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
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
      //Maybe here we need the relations of users following each other and reviews and watchlist
    });
    if (resultUser) {
      res.status(200).json({
        success: true,
        reply: "User found with username " + req.params.username,
        user: resultUser,
      });
    } else {
      res.status(404).json({
        success: false,
        reply: "No user with username " + req.params.username,
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      reply: "Request not successful",
    });
  }
});

//Get all the users where the username is fitting the search word (might be more than 1)
userRouter.get("/username/:word", (req, res) => {});

//Gets all the users that a following a single user
userRouter.get("/followers/:id", (req, res) => {});

//Gets all the users that a single user is following
userRouter.get("/following/:id", (req, res) => {});

//Gets all the users that the one user is following and have reviewed the movie
userRouter.get("/following/:id/rated/:mId", (req, res) => {});

//Gets all the users that the one user is following and have the movie on their watchlist
userRouter.get("/following/:id/watchlist/:mId", (req, res) => {});

//Insert a new User, userId should be NULL when inserting
userRouter.post("/", async (req, res) => {
  try {
    if (req.body.id == null) {
      const newUser: User = await User.save(req.body);
      res.status(200).json({
        success: true,
        reply: "User was saved",
        user: newUser,
      });
    } else {
      res.status(500).json({
        success: false,
        reply: "Request not successful",
      });
    }
  } catch (er) {
    console.log(er);
    res.status(500).json({
      success: false,
      reply: "Request not successful",
    });
  }
});

//User a is now following user b
//Only "following" should need to be updated. "followers" on b should be updated automatically through ORM
userRouter.post("/follow/:aId/:bId", (req, res) => {});

//Adds the movie with that Id to the watchlist of that user
userRouter.post("/watchlist/:uId/:mId", (req, res) => {});

//Updates the User send in the body. Do NOT update the primary key or Relations
userRouter.put("/", (req, res) => {});

//Delete the user with that id.
//Make sure the reviews are delete too and he is removed from all following lists (play around with cascade annotation)
userRouter.delete("/:id", (req, res) => {});

//User a is now no more following user b
//Only "following" should need to be updated. "followers" on b should be updated automatically through ORM
userRouter.delete("/follow/:aId/:bId", (req, res) => {});

//Deletes the movie with that Id from that users watchlist
userRouter.delete("/follow/:uId/:mId", (req, res) => {});

module.exports = userRouter;

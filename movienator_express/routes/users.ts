
const expressUser = require("express")
const userRouter = expressUser.Router()

//TODO Routing implementieren

//Gets all users from the database
userRouter.get("/all",(req, res)=>{

})

//Get the user with that id
userRouter.get("/one/id/:id",(req, res)=>{

})

//Get the user with that username (should only be one)
userRouter.get("/one/username/:username",(req, res)=>{

})

//Get all the users where the username is fitting the search word (might be more than 1)
userRouter.get("/username/:word",(req, res)=>{

})

//Gets all the users that a following a single user
userRouter.get("/followers/:id",(req, res)=>{

})

//Gets all the users that a single user is following
userRouter.get("/following/:id",(req, res)=>{

})

//Gets all the users that the one user is following and have reviewed the movie
userRouter.get("/following/:id/rated/:mId",(req, res)=>{

})

//Gets all the users that the one user is following and have the movie on their watchlist
userRouter.get("/following/:id/watchlist/:mId",(req, res)=>{

})

//Insert a new User, userId should be NULL when inserting
userRouter.post("/",(req, res)=>{

})

//User a is now following user b
//Only "following" should need to be updated. "followers" on b should be updated automatically through ORM
userRouter.post("/follow/:aId/:bId",(req, res)=>{

})

//Adds the movie with that Id to the watchlist of that user
userRouter.post("/watchlist/:uId/:mId",(req, res)=>{

})

//Updates the User send in the body. Do NOT update the primary key or Relations
userRouter.put("/",(req, res)=>{

})

//Delete the user with that id.
//Make sure the reviews are delete too and he is removed from all following lists (play around with cascade annotation)
userRouter.delete("/:id",(req,res)=>{

})

//User a is now no more following user b
//Only "following" should need to be updated. "followers" on b should be updated automatically through ORM
userRouter.delete("/follow/:aId/:bId",(req,res)=>{

})

//Deletes the movie with that Id from that users watchlist
userRouter.delete("/follow/:uId/:mId",(req,res)=>{

})







module.exports = userRouter
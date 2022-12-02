
const expressReview = require("express")
const reviewRouter = expressReview.Router()

//TODO Routing implementieren

//Returns all reviews from the database, ordered by the last Updated value
reviewRouter.get("/all",(req, res)=>{

})

//Gets all reviews to that movie, ordered by the last Updated value
reviewRouter.get("/movie/:id",(req, res)=>{

})

//Gets all reviews done by that user, ordered by the last Updated value
reviewRouter.get("/user/own/:id",(req, res)=>{

})

//Gets all reviews done by users that user is following, ordered by last updated
reviewRouter.get("/user/following/:id", (req, res)=>{

})

//Gets all reviews done by users that user is following and having been updates since the timestamp, ordered by last updated
reviewRouter.get("/user/following/:id/:time", (req, res)=>{

})

//Gets all reviews that have been updates since the timestamp, ordered by last updated
reviewRouter.get("/time/:time",(req,res)=>{

})

//Saves a new review
//Check if it is automatically added to movie and user or if that needs to be done manually
reviewRouter.post("/",(req,res)=>{

})

//Update the specific review
//Make sure to NOT update the primary keys or relations
reviewRouter.put("/",(req,res)=>{

})

//Delete the review with that userId and movieId
reviewRouter.delete("/:uId/:mId",(req,res)=>{

})



module.exports = reviewRouter
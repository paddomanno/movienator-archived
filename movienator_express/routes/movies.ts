
const expressMovie = require("express")
const movieRouter = expressMovie.Router()

//TODO Routing implementieren

module.exports = movieRouter

//Get all the movies from the database
movieRouter.get("/all",(req,res)=>{

})

// Get one movie by its id
movieRouter.get("/one/:id",(req,res)=>{

})

//Gets all the movies that actor played in
movieRouter.get("/actor/:id",(req,res)=>{

})

//Gets all the movies that user has reviewed
movieRouter.get("/user/:id",(req,res)=>{

})

//Gets all movies with a min time
movieRouter.get("/time/min/:min",(req,res)=>{

})

//Gets all movies with a max time
movieRouter.get("/time/max/:max",(req,res)=>{

})

//Gets all movies released in this time span
movieRouter.get("/date/:min/:max",(req,res)=>{

})

//Gets all movies where the name matches the searched word
movieRouter.get("/name/:word",(req, res)=>{

})

//Gets all movies with a min average rating of x
movieRouter.get("/rating/:min",(req, res)=>{

})

//Gets all the movies that are on the watchlist of that user
movieRouter.get("/watchlist/:uId",(req, res)=>{

})

//Inserts a new movie from the body
//Probably automatically insert actors
movieRouter.post("/",(req,res?)=>{

})

//Update the movie in the body
//Make sure to NOT update the primary keys or relations
movieRouter.put("/",(req,res?)=>{

})

//Delete the movie with that id
movieRouter.delete("/:id",(req,res?)=>{

})




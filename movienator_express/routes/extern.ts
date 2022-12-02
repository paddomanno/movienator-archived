const expressExtern = require("express")
const externRouter = expressExtern.Router()

const API_KEY = "***REMOVED***"
const BASE_URL = "https://api.themoviedb.org/3"

/**
 * These routes should not communicate with our local database at all.
 * They should just receive the Data from the external API and put it into
 * Our own datatypes to return (again, without saving the data to the database)
 */


//Returns a list of movies that fit this search word
//The actors array should be filled
//see search/movies
externRouter.get("/search/movie/:word",(req, res)=>{

})

//Returns a list of movies where the searched actor has played in
//The actors array should be filled
//See search/people -> known for
externRouter.get("/search/actor/:name",(req, res)=>{

})

//Returns a list of movies that this user might like
//The actors array should be filled
//See movie/recommendation
//See also movie/similar
externRouter.get("/recommendations/:uId",(req,res)=>{

})

//Returns a list of the currently popular movies
//The actors array should be filled
//See movie/popular
externRouter.get("/popular",(req,res)=>{

})


module.exports = externRouter
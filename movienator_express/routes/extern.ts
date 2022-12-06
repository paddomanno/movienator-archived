import Movie from "../entity/movie";
import Actor from "../entity/actor";

const expressExtern = require("express")
const externRouter = expressExtern.Router()
const axios = require("axios")

const API_KEY = "fb73e59a39ce4d841ab2597bdf8b7003"
const BASE_URL = "https://api.themoviedb.org/3"

/**
 * These routes should not communicate with our local database at all.
 * They should just receive the Data from the external API and put it into
 * Our own datatypes to return (again, without saving the data to the database)
 */


//Returns a list of movies that fit this search word
//The actors array should be filled
//see search/movies
externRouter.get("/search/movie/:word",async (req, res)=>{
    try{
        let resMovies: Movie[] = [];
        let query: string = BASE_URL+"/search/movie/?"+`api_key=${API_KEY}`+`&query=${req.params.word}`
        console.log(query)
        let response = await axios.get(query, { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } })
        if(response.status == 200){
            let movieIds: number[] = []
            response.data.results.forEach(result =>{
                movieIds.push(result.id)
            })
            console.log(movieIds)
            for(const id of movieIds){
                let query: string = BASE_URL+`/movie/${id}?`+`api_key=${API_KEY}`
                console.log(query)
                let response = await axios.get(query, { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } })
                if(response.status == 200){
                    let genres: string[] = []
                    response.data.genres.forEach(genre => {
                        genres.push(genre.name)
                    })
                    let oneMovie: Movie = new Movie()
                    oneMovie.movieId= response.data.id,
                    oneMovie.genres= genres
                    oneMovie.title= response.data.original_title
                    oneMovie.overview= response.data.overview
                    oneMovie.releaseDate= response.data.release_Date
                    oneMovie.lengthMinutes= response.data.runtime
                    oneMovie.adultContent= response.data.adult
                    oneMovie.imagePath= response.data.poster_path
                    oneMovie.actors= []
                    oneMovie.reviews= []

                    let actorsQuery: string = BASE_URL+`/movie/${id}/credits?`+`api_key=${API_KEY}`
                    let actors = await axios.get(actorsQuery, { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } })
                    if(actors.status == 200){
                        actors.data.cast.forEach(castMember => {
                            let oneActor: Actor = new Actor()
                            oneActor.actorId = castMember.id
                            oneActor.name = castMember.original_name
                            if(oneMovie.actors.length <= 5) {
                                oneMovie.actors.push(oneActor)
                            }
                        })
                    }
                    resMovies.push(oneMovie)
                    }
                }
            }
        res.status(200).json({
            data: resMovies
        })
    } catch (er) {
        console.log(er)
        res.status(500).json()
    }
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
import Movie from "../entity/movie";
import Actor from "../entity/actor";
import Review from "../entity/review";
import Genre from "../entity/genre";

const expressExtern = require("express")
const externRouter = expressExtern.Router()
const axios = require("axios")

const API_KEY = "***REMOVED***"
const BASE_URL = "https://api.themoviedb.org/3"

/**
 * These routes should not communicate with our local database at all.
 * They should just receive the Data from the external API and put it into
 * Our own datatypes to return (again, without saving the data to the database)
 */

/**
 * Return an array of movies with the given Ids. Actors are not filled. Genres are filled
 * @param ids
 * @param maxAmount The maximum amount of movies that will be returned
 */
async function getMoviesToIds(ids: number[], maxAmount: number): Promise<Movie[]>{
    let resMovies: Movie[] = []
    for(const id of ids){
        let query: string = BASE_URL+`/movie/${id}?`+`api_key=${API_KEY}`
        //console.log(query)
        let response = await axios.get(query, { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } })
        if(response.status == 200){
            let genres: Genre[] = []
            response.data.genres.forEach(genre => {
                let oneGenre: Genre = new Genre();
                oneGenre.genreId = genre.id
                oneGenre.genreName = genre.name
                genres.push(oneGenre)
            })
            let oneMovie: Movie = new Movie()
            oneMovie.movieId= response.data.id
            oneMovie.title= response.data.original_title
            oneMovie.overview= response.data.overview
            oneMovie.releaseDate= response.data.release_Date
            oneMovie.lengthMinutes= response.data.runtime
            oneMovie.adultContent= response.data.adult
            oneMovie.imagePath= response.data.poster_path
            oneMovie.videoPath = "null"
            oneMovie.actors= []
            oneMovie.reviews= []
            oneMovie.genres= genres
            if(resMovies.length < maxAmount) {
                resMovies.push(oneMovie)
            }
        }
    }
    return resMovies
}

/**
 * Returns an Array of Movies that are returned by this query
 * @param query
 * @param maxAmount The maximum amount of movies that will be returned
 */
async function getMoviesToQuery(query: string, maxAmount: number):Promise<Movie[]>{
    let movieIds: number[] = []
    let response = await axios.get(query, { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } })
    if(response.status == 200) {
        response.data.results.forEach(result => {
            movieIds.push(result.id)
        })
    }
    return await getMoviesToIds(movieIds,maxAmount)
}

//Returns a list of movies that fit this search word
//The actors array is NOT filled
//The genre array IS filled
//see search/movies
externRouter.get("/search/movie/:word",async (req, res)=>{
    try{
        let query: string = BASE_URL+"/search/movie/?"+`api_key=${API_KEY}`+`&query=${req.params.word}`
        let resMovies: Movie[] = await getMoviesToQuery(query,20)
            res.status(200).json({
                data: resMovies
            })
    } catch (er) {
        console.log(er)
        res.status(500).json()
    }
})

//Returns the first X actors that are playing in a movie
externRouter.get("/actor/movie/:id", async (req,res)=>{
    const MAX_ACTORS: number = 8
    try {
        let resActors: Actor[] = []
        let actorsQuery: string = BASE_URL + `/movie/${req.params.id}/credits?` + `api_key=${API_KEY}`
        let actors = await axios.get(actorsQuery, {
            headers: {Accept: 'application/json', 'Accept-Encoding': 'identity'},
            params: {trophies: true}
        })
        if (actors.status == 200) {
            actors.data.cast.forEach(castMember => {
                let oneActor: Actor = new Actor()
                oneActor.actorId = castMember.id
                oneActor.name = castMember.original_name
                oneActor.movies = []
                if (resActors.length < MAX_ACTORS) {
                    resActors.push(oneActor)
                }
            })
        }
        res.status(200).json({
            data: resActors
        })
    } catch (er) {
        console.log(er)
        res.status(500).json()
    }
})

//Returns a list of actors fitting that search word
//The movies array is NOT filled
//See search/people -> known for
externRouter.get("/search/actor/:name",async (req, res)=>{
    try{
        let resActors: Actor[] = []
        let query: string = BASE_URL+"/search/person?"+`api_key=${API_KEY}`+`&query=${req.params.name}`
        let response = await axios.get(query, {
            headers: {Accept: 'application/json', 'Accept-Encoding': 'identity'},
            params: {trophies: true}
        })
        if(response.status == 200){
            response.data.results.forEach(result => {
                if(result.known_for_department == 'Acting') {
                    let newActor: Actor = new Actor();
                    newActor.actorId = result.id
                    newActor.name = result.name
                    newActor.movies = []
                    resActors.push(newActor)
                }
            })
        }
        res.status(200).json({
            data: resActors
        })
    }
    catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Returns a list of Movies that this actor has played in
//The actors array is NOT filled
//The genre array IS filled
externRouter.get("/movies/actor/:id",async (req,res)=>{
    try{
        let resMovies: Movie[] = []
        let query: string = BASE_URL+`/person/${req.params.id}/movie_credits?`+`api_key=${API_KEY}`
        let response = await axios.get(query, {
            headers: {Accept: 'application/json', 'Accept-Encoding': 'identity'},
            params: {trophies: true}
        })
        if(response.status == 200){
            let movieIds: number[] = []
            response.data.cast.forEach(cast => {
                movieIds.push(cast.id)
            })
            resMovies = await getMoviesToIds(movieIds,20)
        }
        res.status(200).json({
            data: resMovies
        })
    }
    catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Returns a list of movies that this user might like
//The actors array is NOT filled
//The genre array IS filled
externRouter.get("/user/:uId/recommendations",async (req,res)=>{
    const MAX_DIF_REVIEWS: number = 5
    const MAX_REC_PER_REVIEW: number = 2;
    try {
        let reviews: Review[] = await Review.find({where:{reviewUserUserId: parseInt(req.params.uId)}})
        reviews.sort((a,b)=>b.rating - a.rating)
        let movieIds:number[] = []

        //Get recommendations for the top-rated movies of that user
        let i:number = 0;
        while (i < reviews.length && i < MAX_DIF_REVIEWS){
            let query: string = BASE_URL+`/movie/${reviews[i].reviewMovieMovieId}/recommendations?`+`api_key=${API_KEY}`
            let thisMovieRec = await axios.get(query, {
                headers: {Accept: 'application/json', 'Accept-Encoding': 'identity'},
                params: {trophies: true}
            })

            if(thisMovieRec.status == 200) {
                //Collect Movie ids from the first 2 recommendations
                let x: number = 0;
                while (x < thisMovieRec.data.results.length && x < MAX_REC_PER_REVIEW) {
                    movieIds.push(thisMovieRec.data.results[x].id)
                    x++
                }
            }
            i++
        }
        let resMovies: Movie[] = await getMoviesToIds(movieIds,MAX_DIF_REVIEWS * MAX_REC_PER_REVIEW)
        res.status(200).json({
            data: resMovies
        })
    }catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Returns a list of recommendations for a movie
//The actors array is NOT filled
//The genre array IS filled
externRouter.get("/movie/:mId/recommendations/",async (req,res)=>{
    try {
        let resMovies: Movie[] = []
        let query: string = BASE_URL+`/movie/${req.params.mId}/recommendations?`+`api_key=${API_KEY}`
        let thisMovieRec = await axios.get(query, {
            headers: {Accept: 'application/json', 'Accept-Encoding': 'identity'},
            params: {trophies: true}
        })
        if(thisMovieRec.status == 200){
            let movieIds: number[] = []
            thisMovieRec.data.results.forEach(result => {
                movieIds.push(result.id)
            })
            resMovies = await getMoviesToIds(movieIds,20)
        }
        res.status(200).json({
            data: resMovies
        })
    }catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Returns a list of the currently popular movies
//The actors array is NOT filled
//The genre array IS filled
//See movie/popular
externRouter.get("/popular",async (req,res)=>{
    try {
        let query: string = BASE_URL + "/movie/popular?" + `api_key=${API_KEY}`
        let resMovies = await getMoviesToQuery(query,20)
        res.status(200).json({
            data: resMovies
        })
    }
    catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Returns a list of all genres there are
//Movies are not filled
externRouter.get("/genres", async (req,res)=>{
    try {
        let resGenres: Genre[] = []
        let query: string = BASE_URL+`/genre/movie/list?`+`api_key=${API_KEY}`
        let genreRes = await axios.get(query, {
            headers: {Accept: 'application/json', 'Accept-Encoding': 'identity'},
            params: {trophies: true}
        })
        if(genreRes.status == 200){
            genreRes.data.genres.forEach(genre=>{
                let newGen : Genre = new Genre()
                newGen.genreId = genre.id
                newGen.genreName = genre.name
                resGenres.push(newGen)
            })
            res.status(200).json({
                data: resGenres
            })
        }
        else {
            res.status(500).json()
        }

    }catch (er){
        console.log(er)
        res.status(500).json()
    }
})

externRouter.get("/movie/genre/:id", async (req,res)=>{
    try {
        let query: string = BASE_URL + "/discover/movie?" +`with_genres=${req.params.id}`+ `&api_key=${API_KEY}`
        let resMovies = await getMoviesToQuery(query,20)
        res.status(200).json({
            data: resMovies
        })
    }
    catch (er){
        console.log(er)
        res.status(500).json()
    }
})


module.exports = externRouter
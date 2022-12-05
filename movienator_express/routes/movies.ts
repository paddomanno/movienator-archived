import Movie from "../entity/movie";
import User from "../entity/user";
import Actor from "../entity/actor";
import {ArrayContains, Between, ILike, LessThanOrEqual, MoreThanOrEqual} from "typeorm";

const expressMovie = require("express")
const movieRouter = expressMovie.Router()

//TODO Routing implementieren

//Get all the movies from the database
movieRouter.get("/all", async (req,res)=>{
    try {
        const allMovies: Movie[] = await Movie.find({
            relations: {actors: true, reviews: true}})
        allMovies.sort((a,b)=> a.title.localeCompare(b.title))
        res.status(200).json({
            data: allMovies
        })
    } catch (er){
        console.log(er)
        res.status(500).json()
    }
})

// Get one movie by its id
movieRouter.get("/one/:id", async (req,res)=>{
    try {
        const oneMovie: Movie = await Movie.findOne({where:
            {movieId: parseInt(req.params.id)},
            relations: {actors: true, reviews: true}})
        if(oneMovie){
            res.status(200).json({
                data: oneMovie
            })
        }
        else {
            res.status(404).json()
        }
    } catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Gets all the movies that actor played in
//Better use the extern Api for this
movieRouter.get("/actor/:id", async (req,res)=>{
    try {
        const actor: Actor = await Actor.findOne({
            where: {actorId: parseInt(req.params.id)},
            relations:{movies: true}})
        if (actor!=null) {
            let actorMovies: Movie[] = actor.movies
            actorMovies.sort((a, b) => a.title.localeCompare(b.title))
            res.status(200).json({
                data: actorMovies
            })
        } else {
            res.status(404).json()
        }
    } catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Gets all the movies that user has reviewed
movieRouter.get("/user/:id", async (req,res)=>{
    try{
        const user: User = await User.findOne({
            where:{userId: parseInt(req.params.id)},
            relations: ['reviews','reviews.review_movie']})

        if (user!=null) {
            let userMovies: Movie[] = []
            user.reviews.forEach((review) => {
                userMovies.push(review.review_movie)
            })
            userMovies.sort((a, b) => a.title.localeCompare(b.title))
            res.status(200).json({
                data: userMovies
            })
        } else {
            res.status(404).json()
        }
    } catch (er) {
        console.log(er)
        res.status(500).json()
    }
})

//Gets all the movies that are on the watchlist of that user
movieRouter.get("/watchlist/:uId", async (req, res)=>{
    try{
        const user: User = await User.findOne({
            where:{userId: parseInt(req.params.id)},
            relations:{watchlist: true}})
        if (user!=null) {
            let userWatchlist: Movie[] = user.watchlist
            userWatchlist.sort((a, b) => a.title.localeCompare(b.title))
            res.status(200).json({
                data: userWatchlist
            })
        } else {
            res.status(404).json()
        }
    } catch (er) {
        console.log(er)
        res.status(500).json()
    }
})

//Gets all movies with a min time
movieRouter.get("/time/min/:min", async (req,res)=>{
    try{
        const movies: Movie[] = await Movie.find({
            where:{lengthMinutes: MoreThanOrEqual(parseInt(req.params.min))},
            relations:{reviews: true, actors: true}})
        movies.sort((a,b)=>a.title.localeCompare(b.title))
        res.status(200).json({
            data: movies
        })
    } catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Gets all movies with a max time
movieRouter.get("/time/max/:max", async (req,res)=>{
    try{
        const movies: Movie[] = await Movie.find({
            where:{lengthMinutes: LessThanOrEqual(parseInt(req.params.min))},
            relations:{reviews: true, actors: true}})
        movies.sort((a,b)=>a.title.localeCompare(b.title))
        res.status(200).json({
            data: movies
        })
    } catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Gets all movies released in this time span
movieRouter.get("/date/:min/:max", async (req,res)=>{
    try{
        const movies: Movie[] = await Movie.find({
            where:{releaseDate: Between<Date>(req.params.min as Date,req.params.max as Date)},
            relations:{reviews: true, actors: true}
        })
        movies.sort((a,b)=>a.title.localeCompare(b.title))
        res.status(200).json({
            data: movies
        })
    } catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Gets all movies where the name matches the searched word
movieRouter.get("/name/:word", async (req, res)=>{
    try{
        const movies: Movie[] = await Movie.find({
            where:{title: ILike(`%${req.params.word}%`)},
            relations:{reviews: true, actors: true}
        })
        movies.sort((a,b)=>a.title.localeCompare(b.title))
        res.status(200).json({
            data: movies
        })
    } catch (er) {
        console.log(er)
        res.status(500).json()
    }
})

//Gets all movies with a min average rating of x
movieRouter.get("/rating/:min", async (req, res)=>{
    try{
        const movies : Movie[] = await Movie.find({
            relations:{reviews: true, actors: true}
        })
        let minMovies: Movie[] = movies.filter((movie)=>{
            let numReviews: number = 0;
            let sumReviews: number = 0;
            movie.reviews.forEach((review)=>{
                sumReviews += review.rating
                numReviews++
            })
            return (numReviews/sumReviews) > parseInt(req.params.min)
        })
        minMovies.sort((a,b)=>a.title.localeCompare(b.title))
        res.status(200).json({
            data: minMovies
        })
    } catch (er) {
        console.log(er)
        res.status(500).json()
    }
})

//Gets all movies to that genre
movieRouter.get("/genre/:genre", async (req, res)=>{
    try {
        //TODO: ArrayContains not working in mysql. Find alternative or filter here
        const movies: Movie[] = await Movie.find({
            where:{genres: ArrayContains([req.params.genre])},
            relations:{reviews: true, actors: true}
        })
        movies.sort((a,b)=>a.title.localeCompare(b.title))
        res.status(200).json({
            data: movies
        })

    } catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Gets all movies than the two user both have on their watchlist and haven't reviewed yet
movieRouter.get("/mutual/:aId/:bId",async (req,res)=>{
    try{
        let userA = await User.findOne({
            where:{userId: parseInt(req.params.aId)},
            relations:{watchlist: true}
        })
        let userB = await User.findOne({
            where:{userId: parseInt(req.params.bId)},
            relations:{watchlist: true}
        })
        if(userA && userB){
            let resMovies = userA.watchlist.filter(movieA => userB.watchlist.some(movieB => movieB.movieId == movieA.movieId))
            res.status(200).json({
                data: resMovies
            })
        }
        else {
            res.status(404).json()
        }
    } catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Inserts a new movie from the body
//First check if the movie exists already, if not, insert it
//Actors should be set already and inserted / updated at the same time
movieRouter.post("/", async (req,res?)=>{
    try {
        let newMovie = req.body as Movie
        newMovie.actors.forEach((actor) => {
            actor.save()
        })
        await newMovie.save()
        newMovie = await Movie.findOne({
            where: {movieId: newMovie.movieId},
            relations: {actors: true, reviews: true}
        })
        res.status(201).json({
            data: newMovie
        })
    } catch (er) {
        console.log(er)
        res.status(500).json()
    }

})

//Update the movie in the body
//Make sure to NOT update the primary keys or relations
//We shouldnt really use this
movieRouter.put("/", async (req,res?)=>{
    try{
        let movieBody = req.body as Movie
        let movie: Movie = await Movie.findOne({
            where:{movieId: movieBody.movieId}
        })
        if(movie){
            Object.keys(movie).forEach(key =>{
                if(key != 'movieId' && key != 'reviews' && key!='actors'){
                    movie[key] = movieBody[key]
                }
            })
            await movie.save()
            movie = await Movie.findOne({
                where: {movieId: movie.movieId},
                relations: {actors: true, reviews: true}
            })
            res.status(200).json({
                data: movie
            })
        }
        else {
            res.status(404).json()
        }
    } catch (er){
        console.log(er)
        res.status(500).json()
    }
})

//Delete the movie with that id
movieRouter.delete("/:id", async (req,res?)=>{
    try {
        const movie: Movie = await Movie.findOne({
            where:{movieId: parseInt(req.params.id)}
        })
        if(movie){
            await movie.remove()
            res.status(204)
        }
        else{
            res.status(404).json()
        }

    } catch (er){
        console.log(er)
        res.status(500).json()
    }
})

module.exports = movieRouter


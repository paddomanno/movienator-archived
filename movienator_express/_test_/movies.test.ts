import {afterAll, beforeAll, describe, expect, it} from "@jest/globals";
import {TestDatabaseManager} from "./test_utils/TestDatabaseManager";
import Movie from "../entity/movie";
import Actor from "../entity/actor";
import Genre from "../entity/genre";
import User from "../entity/user";
import Review from "../entity/review";

import request from 'supertest'
import app from '../app'
import {response} from "express";
import exp from "constants";

beforeAll(async () => {
    await TestDatabaseManager.getInstance().connectTestDatabase()
    await TestDatabaseManager.getInstance().resetTestDatabase()

    await createTestData()

    console.log("Starting Movie Tests")
})

async function createTestData(){
    let actor1: Actor = Actor.create({
        name: "Maggus",
        actorId: 1
    })

    let genre1: Genre = Genre.create({
        genreName: "Fantasy",
        genreId: 1
    })

    let user1 = User.create({
        firstName: "Maggus",
        lastName: "Rühl",
        userName: "Roswita",
        password: "pw",
        comment: "Schwer und falsch",
        birthday: new Date(),
        following: [],
        followers: [],
    });
    await user1.save()

    let movie1: Movie = Movie.create({
        movieId: 1,
        title : "Aaaa",
        adultContent : false,
        actors : [actor1],
        genres : [genre1],
        reviews: []
    })
    await movie1.save()

    let review1: Review = Review.create({
        reviewMovieMovieId: 1,
        reviewUserUserId: 1,
        title: "Good",
        content: "Was good",
        rating: 1,
        lastUpdated: new Date()
    })
    await review1.save()

    let movie2: Movie = new Movie()
    movie2.movieId = 2;
    movie2.title = "Bbbb"
    movie2.adultContent = false
    movie2.actors = [actor1]
    await movie2.save()

    let movie3: Movie = new Movie()
    movie3.movieId = 3;
    movie3.title = "Ccccb"
    movie3.adultContent = true
    await movie3.save()
}

afterAll(async () => {
    await TestDatabaseManager.getInstance().resetTestDatabase()
    console.log("Finishing Movie Test")
})

describe("MovieTests",() => {

    //Ganz basic test
    it("getAllMovies", async ()=>{
        let response = await request(app)
            .get('/movie/all')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(3)
        expect(movies.at(0).title).toBe("Aaaa")
        expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1)
    })

    it("getOneMovie", async ()=>{
        let response = await request(app)
            .get('/movie/one/1')
        expect(response.statusCode).toBe(200)
        let movie: Movie = response.body.data as Movie
        expect(movie.movieId).toBe(1)
        expect(movie.genres.at(0).genreName).toBe("Fantasy")
        expect(movie.actors.at(0).name).toBe("Maggus")
        expect(movie.reviews.at(0).reviewUserUserId).toBe(1)
    })

    it("getOneMovieWrongID", async ()=>{
        let response = await request(app)
            .get('/movie/one/10')
        expect(response.statusCode).toBe(404)
    })

    it("getMoviesToActor", async ()=>{
        let response = await request(app)
            .get('/movie/actor/1')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(2)
        expect(movies.at(0).title).toBe("Aaaa")
        expect(movies.at(1).title).toBe("Bbbb")
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1)
    })

    it("getMoviesToActorWrongId", async ()=>{
        let response = await request(app)
            .get('/movie/actor/10')
        expect(response.statusCode).toBe(404)
    })

    it("getMoviesReviewedByUser", async ()=>{
        let response = await request(app)
            .get('/movie/user/1')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(1)
        expect(movies.at(0).title).toBe("Aaaa")
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1)
    })

    it("getMoviesReviewedByUserWrongId", async ()=>{
        let response = await request(app)
            .get('/movie/user/10')
        expect(response.statusCode).toBe(404)
    })

    it("getWatchlistByUser", async ()=>{
        let user1: User = await User.findOne({where:{userId: 1}})
        let movie1: Movie = await Movie.findOne({where:{movieId: 1}})
        let movie2: Movie = await Movie.findOne({where:{movieId: 2}})
        user1.watchlist = [movie1,movie2]
        await user1.save()

        let response = await request(app)
            .get('/movie/watchlist/1')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(2)
        expect(movies.at(0).title).toBe("Aaaa")
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1)
    })

    it("getWatchlistByUserWrongId", async ()=>{
        let response = await request(app)
            .get('/movie/watchlist/10')
        expect(response.statusCode).toBe(404)
    })

    it("getMovieMinTime", async ()=>{
        let movie1: Movie = await Movie.findOne({where:{movieId: 1}})
        let movie2: Movie = await Movie.findOne({where:{movieId: 2}})
        let movie3: Movie = await Movie.findOne({where:{movieId: 3}})
        movie1.lengthMinutes = 100
        movie2.lengthMinutes = 200
        movie3.lengthMinutes = 300
        await movie1.save()
        await movie2.save()
        await movie3.save()

        let response = await request(app)
            .get('/movie/time/min/200')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(2)
        expect(movies.at(0).movieId).toBe(2)
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(1).movieId).toBe(3)
        //Reviews, Actors, Genres filled
    })

    it("getMovieMinTimeNegativeValue", async ()=>{
        let response = await request(app)
            .get('/movie/time/min/-200')
        expect(response.statusCode).toBe(500)
    })

    it("getMovieMinTimeZero", async ()=>{
        let response = await request(app)
            .get('/movie/time/min/0')
        expect(response.statusCode).toBe(500)
    })

    it("getMovieMaxTime", async ()=>{
        let response = await request(app)
            .get('/movie/time/max/200')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(2)
        expect(movies.at(0).movieId).toBe(1)
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(1).movieId).toBe(2)
    })

    it("getMovieMaxTimeNegativeValue", async ()=>{
        let response = await request(app)
            .get('/movie/time/max/-200')
        expect(response.statusCode).toBe(500)
    })

    it("getMovieMaxTimeZero", async ()=>{
        let response = await request(app)
            .get('/movie/time/max/0')
        expect(response.statusCode).toBe(500)
    })

    it("getMoviesDateRange", async ()=>{
        //200 Code
        //filter correct
        //order correct
        //Reviews, Actors, Genres filled
    })

    it("getMoviesDateRangeBadData", async ()=>{
        //500 Code
    })

    it("getMoviesBySearchWord", async ()=>{
        //200 Code
        //filter correct
        //order correct
        //Reviews, Actors, Genres filled
    })

    it("getMoviesByMinRating", async ()=>{
        //200 Code
        //filter correct
        //order correct
        //Reviews, Actors, Genres filled
    })

    it("getMoviesByMinRatingBadData", async ()=>{
        //500
    })

    it("getMoviesByGenreId", async ()=>{
        //200 Code
        //filter correct
        //order correct
        //Reviews, Actors, Genres filled
    })

    it("getMoviesByGenreName", async ()=>{
        //200 Code
        //filter correct
        //order correct
        //Reviews, Actors, Genres filled
    })

    it("getMoviesMutualWatchlist", async ()=>{
        //200 Code
        //filter correct
        //order correct
        //Reviews, Actors, Genres filled
    })

    it("postNewMovie", async ()=>{
        let actor2: Actor = new Actor()
        actor2.name = "Maggus"
        actor2.actorId = 2

        //201 Code
        //Actors and Genres automatically set
    })

    it("updateMovie", async ()=>{
        //201 Code
        //Actors and Genres not updated
    })

    it("deleteMovie", async ()=>{
        //201 Code
        //Actors and Genres not updated
    })

})
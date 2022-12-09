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

    //console.log("Starting Movie Tests")
},(10_000))

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
    //console.log("Finishing Movie Test")
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
        let movie1: Movie = await Movie.findOne({where:{movieId: 1}})
        let movie2: Movie = await Movie.findOne({where:{movieId: 2}})
        let movie3: Movie = await Movie.findOne({where:{movieId: 3}})
        movie1.releaseDate = new Date('2022-01-01')
        movie2.releaseDate = new Date('2022-03-03')
        movie3.releaseDate = new Date('2022-05-05')
        await movie1.save()
        await movie2.save()
        await movie3.save()

        let dateMin = new Date('2022-02-02')
        let dateMax = new Date('2022-06-06')
        let response = await request(app)
            .get(`/movie/date/${dateMin}/${dateMax}`)
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(2)
        expect(movies.at(0).movieId).toBe(2)
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(1).movieId).toBe(3)
    })

    it("getMoviesDateRangeBadDate1", async ()=>{
        let dateMin = new Date('2022-02-02')
        let response = await request(app)
            .get(`/movie/date/${dateMin}/blabla`)
        expect(response.statusCode).toBe(500)
    })

    it("getMoviesDateRangeBadDate2", async ()=>{
        let dateMax = new Date('2022-02-02')
        let response = await request(app)
            .get(`/movie/date/blabla/${dateMax}`)
        expect(response.statusCode).toBe(500)
    })

    it("getMoviesDateRangeWrongOrder", async ()=>{
        let dateMin = new Date('2022-02-02')
        let dateMax = new Date('2022-06-06')
        let response = await request(app)
            .get(`/movie/date/${dateMax}/${dateMin}`)
        expect(response.statusCode).toBe(500)
    })

    it("getMoviesBySearchWord", async ()=>{
        let response = await request(app)
            .get('/movie/name/b')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(2)
        expect(movies.at(0).movieId).toBe(2)
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(1).movieId).toBe(3)
    })

    it("getMoviesBySearchWordNoResults", async ()=>{
        let response = await request(app)
            .get('/movie/name/xxx')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(0)
    })

    it("getMoviesByMinRating", async ()=>{
        let user2 = User.create({
            firstName: "Maggus",
            lastName: "Rühl",
            userName: "Roswita",
            password: "pw",
            comment: "Schwer und falsch",
            birthday: new Date(),
            following: [],
            followers: [],
        });
        await user2.save()
        let user3 = User.create({
            firstName: "Maggus",
            lastName: "Rühl",
            userName: "Roswita",
            password: "pw",
            comment: "Schwer und falsch",
            birthday: new Date(),
            following: [],
            followers: [],
        });
        await user3.save()
        //3 Users now in database 1,2,3
        //3 Movies now in database 1,2,3

        {
            let review1: Review = Review.create({
                reviewMovieMovieId: 1,
                reviewUserUserId: 1,
                title: "Good",
                content: "Was good",
                rating: 1,
                lastUpdated: new Date()
            })
            await review1.save()
            let review2: Review = Review.create({
                reviewMovieMovieId: 1,
                reviewUserUserId: 2,
                title: "Good",
                content: "Was good",
                rating: 2,
                lastUpdated: new Date()
            })
            await review2.save()
            let review3: Review = Review.create({
                reviewMovieMovieId: 1,
                reviewUserUserId: 3,
                title: "Good",
                content: "Was good",
                rating: 3,
                lastUpdated: new Date()
            })
            await review3.save()
        }
        // Movie 1 avg rating now 2
        {
            let review1: Review = Review.create({
                reviewMovieMovieId: 2,
                reviewUserUserId: 1,
                title: "Good",
                content: "Was good",
                rating: 3,
                lastUpdated: new Date()
            })
            await review1.save()
            let review2: Review = Review.create({
                reviewMovieMovieId: 2,
                reviewUserUserId: 2,
                title: "Good",
                content: "Was good",
                rating: 3,
                lastUpdated: new Date()
            })
            await review2.save()
            let review3: Review = Review.create({
                reviewMovieMovieId: 2,
                reviewUserUserId: 3,
                title: "Good",
                content: "Was good",
                rating: 4,
                lastUpdated: new Date()
            })
            await review3.save()
        }
        // Movie 2 avg rating 3,3
        {
            let review1: Review = Review.create({
                reviewMovieMovieId: 3,
                reviewUserUserId: 1,
                title: "Good",
                content: "Was good",
                rating: 5,
                lastUpdated: new Date()
            })
            await review1.save()
            let review2: Review = Review.create({
                reviewMovieMovieId: 3,
                reviewUserUserId: 2,
                title: "Good",
                content: "Was good",
                rating: 5,
                lastUpdated: new Date()
            })
            await review2.save()
            let review3: Review = Review.create({
                reviewMovieMovieId: 3,
                reviewUserUserId: 3,
                title: "Good",
                content: "Was good",
                rating: 5,
                lastUpdated: new Date()
            })
            await review3.save()
        }
        //Movie 3 rating 5

        //1 -> 2; 2 -> 3,3; 3 -> 5
        let response = await request(app)
            .get('/movie/rating/3')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(2)
        expect(movies.at(0).movieId).toBe(2)
        expect(movies.at(1).movieId).toBe(3)
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).reviews.length).toBe(3)
    })

    it("getMoviesByMinRatingNoNumber", async ()=>{
        let response = await request(app)
            .get('/movie/rating/blabla')
        expect(response.statusCode).toBe(500)
    })

    it("getMoviesByMinRatingNegativeNumber", async ()=>{
        let response = await request(app)
            .get('/movie/rating/-1')
        expect(response.statusCode).toBe(500)
    })


    //Existing Genre is: 1 - Fantasy
    it("getMoviesByGenreId", async ()=>{
        let response = await request(app)
            .get('/movie/genre/1')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(1)
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).genres.length).toBe(1)
        expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1)
    })

    it("getMoviesByGenreName", async ()=>{
        let response = await request(app)
            .get('/movie/genre/Fantasy')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(1)
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).genres.length).toBe(1)
        expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1)
    })

    it("getMovieByGenreWithNonExistId", async ()=>{
        let response = await request(app)
            .get('/movie/genre/10')
        expect(response.statusCode).toBe(404)
    })

    it("getMovieByGenreWithNonExistName", async ()=>{
        let response = await request(app)
            .get('/movie/genre/blabla')
        expect(response.statusCode).toBe(404)
    })

    it("getMoviesMutualWatchlist", async ()=>{
        let user1: User = await User.findOne({where:{userId: 1}})
        let user2: User = await User.findOne({where:{userId: 2}})
        let movie1: Movie = await Movie.findOne({where:{movieId: 1}})
        let movie2: Movie = await Movie.findOne({where:{movieId: 2}})
        user1.watchlist = [movie1,movie2]
        user2.watchlist = [movie1]
        await user1.save()
        await user2.save()

        let response = await request(app)
            .get('/movie/mutual/watchlist/1/2')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(1)
        expect(movies.at(0).movieId).toBe(1)
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).genres.length).toBe(1)
        expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1)
    })

    it("getMoviesMutualReview", async ()=>{let user1: User = await User.findOne({where:{userId: 1}})
        let response = await request(app)
            .get('/movie/mutual/review/1/2')
        expect(response.statusCode).toBe(200)
        let movies: Movie[] = response.body.data as Movie[]
        expect(movies.length).toBe(3)
        expect(movies.at(0).movieId).toBe(1)
        expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1)
        expect(movies.at(0).genres.length).toBe(1)
        expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1)
    })

    it("postNewMovie", async ()=>{
        let actor2: Actor = new Actor()
        actor2.name = "Maggus"
        actor2.actorId = 2

        let genre2: Genre = new Genre()
        genre2.genreId = 2
        genre2.genreName = "Krimi"

        let movie4: Movie = Movie.create({
            movieId: 4,
            title : "Aaaa",
            adultContent : false,
            actors : [actor2],
            genres : [genre2],
            reviews: []
        })

        let response = await request(app)
            .post('/movie/')
            .send(movie4)
        expect(response.statusCode).toBe(201)

        let newMovie = await Movie.findOne({
            where:{movieId: 4},
            relations:{genres: true,actors: true, reviews: true}
        })
        expect(newMovie.movieId).toBe(4)
        expect(newMovie.actors.length).toBe(1)
        expect(newMovie.genres.length).toBe(1)
    })

    it("postWithWrongData", async ()=>{
        let movie5: Movie = Movie.create({
            movieId: 5,
            title : "Aaaa",
            //Adult content missing
            actors : [],
            genres : [],
            reviews: []
        })

        let response = await request(app)
            .post('/movie/')
            .send(movie5)
        expect(response.statusCode).toBe(500)
    })


    it("postExistingRelationsNotOverwritten", async ()=>{
        let movie1: Movie = Movie.create({
            movieId: 1,
            title : "Aaaa",
            adultContent : false,
            actors : [],
            genres : [],
            reviews: []
        })

        let response = await request(app)
            .post('/movie/')
            .send(movie1)
        expect(response.statusCode).toBe(201)

        let movie: Movie = await Movie.findOne({
            where:{movieId: 1},
            relations:{genres: true, actors: true, reviews: true}
            })
        expect(movie.reviews.length).toBeGreaterThanOrEqual(1)
        expect(movie.actors.length).toBeGreaterThanOrEqual(1)
        expect(movie.genres.length).toBeGreaterThanOrEqual(1)
    })

    it("updateMovie", async ()=>{
        let movie1: Movie = Movie.create({
            movieId: 1,
            title : "Aaaa",
            adultContent : true,
            actors : [],
            genres : [],
            reviews: []
        })

        let response = await request(app)
            .put('/movie/')
            .send(movie1)
        expect(response.statusCode).toBe(201)

        let movie: Movie = await Movie.findOne({
            where:{movieId: 1},
            relations:{genres: true, actors: true, reviews: true}
        })
        expect(movie.adultContent).toBe(true)
        expect(movie.reviews.length).toBeGreaterThanOrEqual(1)
        expect(movie.actors.length).toBeGreaterThanOrEqual(1)
        expect(movie.genres.length).toBeGreaterThanOrEqual(1)
    })

    it("updateMovieWrongId", async ()=>{
        let movie1: Movie = Movie.create({
            movieId: 10,
            title : "Aaaa",
            adultContent : true,
            actors : [],
            genres : [],
            reviews: []
        })

        let response = await request(app)
            .put('/movie/')
            .send(movie1)
        expect(response.statusCode).toBe(404)
    })

    it("deleteMovie", async ()=>{
        let movieBefore: Movie = await Movie.findOne({where:{movieId: 4}})
        expect(movieBefore.movieId).toBe(4)

        let response = await request(app)
            .delete('/movie/4')
        expect(response.statusCode).toBe(204)

        let movieAfter: Movie = await Movie.findOne({where:{movieId: 4}})
        expect(movieAfter).toBeNull()
    })

    it("deleteMovieNonExsistent", async ()=>{
        let response = await request(app)
            .delete('/movie/40')
        expect(response.statusCode).toBe(404)
    })

    it("deleteMovieNan", async ()=>{
        let response = await request(app)
            .delete('/movie/blabla')
        expect(response.statusCode).toBe(500)
    })

})
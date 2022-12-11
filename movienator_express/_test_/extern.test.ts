import {afterAll, beforeAll, describe, expect, it} from "@jest/globals";
import {TestDatabaseManager} from "./test_utils/TestDatabaseManager";
import User from "../entity/user";
import request from 'supertest'
import app from '../app'
import Movie from "../entity/movie";
import Actor from "../entity/actor";
import Genre from "../entity/genre";
import Review from "../entity/review";
import {MigrationRevertCommand} from "typeorm/commands/MigrationRevertCommand";

beforeAll(async () => {
    await TestDatabaseManager.getInstance().connectTestDatabase()
    await TestDatabaseManager.getInstance().resetTestDatabase()

    await createTestData()

    //console.log("Starting Extern Tests")
},(10_000))

async function createTestData(){
    // 436270 is Black Adam
    // 724495 is The Woman Kind
    // 8784 is Daniel Craig
    // 28 is Action
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
}

afterAll(async () => {
    await TestDatabaseManager.getInstance().resetTestDatabase()
    //console.log("Finishing Extern Test")
})

describe("Externtest",() => {

    describe("Testing movieSearch Route",()=>{
        it("Should return an array of Movies with max length of 20", async ()=>{
            let response = await request(app)
                .get('/extern/search/movie/Harry')
            expect(response.statusCode).toBe(200)
            let movies: Movie[] = response.body.data as Movie[]
            expect(movies.length).toBeGreaterThanOrEqual(1)
            expect(movies.length).toBeLessThanOrEqual(20)
            expect(movies.at(0).movieId).toBeDefined()
            expect(movies.at(0).title).toBeDefined()
            expect(movies.at(0).adultContent).toBeDefined()
        })
        it("Should fill the genres array but not actors", async ()=>{
            let response = await request(app)
                .get('/extern/search/movie/Harry')
            expect(response.statusCode).toBe(200)
            let movies: Movie[] = response.body.data as Movie[]
            expect(movies.at(0).actors.length).toBe(0)
            expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1)
        })
    })

    describe("Testing actorSearch Route",()=>{
        it("Should return an Array of Actors",async ()=>{
            let response = await request(app)
                .get('/extern/search/actor/Daniel')
            expect(response.statusCode).toBe(200)
            let actors: Actor[] = response.body.data as Actor[]
            expect(actors.length).toBeGreaterThanOrEqual(1)
            expect(actors.at(0).actorId).toBeDefined()
            expect(actors.at(0).name).toBeDefined()
        })
        it("Should not fill the movies array of the actors",async ()=>{
            let response = await request(app)
                .get('/extern/search/actor/Daniel')
            expect(response.statusCode).toBe(200)
            let actors: Actor[] = response.body.data as Actor[]
            expect(actors.at(0).movies.length).toBe(0)
        })
    })

    describe("Testing getActorsToMovie Route",()=>{
        it("Should return an array of Actors",async ()=>{
            let response = await request(app)
                .get('/extern/actor/movie/436270')
            expect(response.statusCode).toBe(200)
            let actors: Actor[] = response.body.data as Actor[]
            expect(actors.length).toBeGreaterThanOrEqual(1)
            expect(actors.length).toBeLessThanOrEqual(8)
            expect(actors.at(0).name).toBeDefined()
            expect(actors.at(0).actorId).toBeDefined()
        })

        it("Should return 500 if the movie ID doesn't exist",async ()=>{
            let response = await request(app)
                .get('/extern/actor/movie/xxxx')
            expect(response.statusCode).toBe(500)
        })
    })

    describe("Testing getMoviesToActor Route",()=>{
        it("Should return an Array of Movies",async  () =>{
            let response = await request(app)
                .get('/extern/movies/actor/8784')
            expect(response.statusCode).toBe(200)
            let movies: Movie[] = response.body.data as Movie[]
            expect(movies.length).toBeGreaterThanOrEqual(1)
            expect(movies.length).toBeLessThanOrEqual(20)
            expect(movies.at(0).movieId).toBeDefined()
            expect(movies.at(0).title).toBeDefined()
            expect(movies.at(0).adultContent).toBeDefined()
        },10_000)

        it("Should fill the genres array but not the actors array",async  () =>{
            let response = await request(app)
                .get('/extern/movies/actor/8784')
            expect(response.statusCode).toBe(200)
            let movies: Movie[] = response.body.data as Movie[]
            expect(movies.at(0).actors.length).toBe(0)
            expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1)
        },10_000)

        it("Should return 500 if the actors doesn't exist",async  () =>{
            let response = await request(app)
                .get('/extern/movies/actor/xxxxx')
            expect(response.statusCode).toBe(500)
        },10_000)
    })

    describe("Testing userRecommendations Route",()=>{
        it("Should return an Array of Movies",async () => {
            // 436270 is Black Adam
            // 724495 is The Woman Kind
            let movie: Movie = Movie.create({
                movieId: 436270,
                title : "Black Adam",
                adultContent : false,
                actors : [],
                genres : [],
                reviews: []
            })
            await movie.save()
            movie = Movie.create({
                movieId: 724495,
                title : "The Woman Kind",
                adultContent : false,
                actors : [],
                genres : [],
                reviews: []
            })
            await movie.save()
            let review: Review = Review.create({
                reviewMovieMovieId: 436270,
                reviewUserUserId: 1,
                title: 'Bruddaler Film',
                content: 'Des wars mit dem Review',
                rating: 5,
                lastUpdated: new Date('2019-10-11'),
            })
            await review.save()
            review = Review.create({
                reviewMovieMovieId: 724495,
                reviewUserUserId: 1,
                title: 'Bruddaler Film',
                content: 'Des wars mit dem Review',
                rating: 5,
                lastUpdated: new Date('2019-10-11'),
            })
            await review.save()


            let response = await request(app)
                .get('/extern/user/1/recommendations')
            expect(response.statusCode).toBe(200)
            let movies: Movie[] = response.body.data as Movie[]
            expect(movies.length).toBeGreaterThanOrEqual(1)
            expect(movies.length).toBeLessThanOrEqual(20)
            expect(movies.at(0).actors.length).toBe(0)
            expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1)
            expect(movies.at(0).movieId).toBeDefined()
            expect(movies.at(0).title).toBeDefined()
            expect(movies.at(0).adultContent).toBeDefined()
        })

        it("Should return 404 if the User doesn't exist",async () => {
            // 436270 is Black Adam
            let response = await request(app)
                .get('/extern/user/10/recommendations')
            expect(response.statusCode).toBe(404)
        })

        it("Should return 500 if the param is not a number",async () => {
            // 436270 is Black Adam
            let response = await request(app)
                .get('/extern/user/blabla/recommendations')
            expect(response.statusCode).toBe(500)
        })
    })

    describe("Testing movieRecommendations",()=>{
        it("Should return an array of Movies",async () => {
            // 436270 is Black Adam
            let response = await request(app)
                .get('/extern/movie/436270/recommendations')
            expect(response.statusCode).toBe(200)
            let movies: Movie[] = response.body.data as Movie[]
            expect(movies.length).toBeGreaterThanOrEqual(1)
            expect(movies.length).toBeLessThanOrEqual(20)
            expect(movies.at(0).actors.length).toBe(0)
            expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1)
            expect(movies.at(0).movieId).toBeDefined()
            expect(movies.at(0).title).toBeDefined()
            expect(movies.at(0).adultContent).toBeDefined()
        })

        it("Should return 500 if the movie doesn't exist",async () => {
            // 436270 is Black Adam
            let response = await request(app)
                .get('/extern/movie/-1/recommendations')
            expect(response.statusCode).toBe(500)
        })

        it("Should return 500 if the param is not a number",async () => {
            // 436270 is Black Adam
            let response = await request(app)
                .get('/extern/movie/blabla/recommendations')
            expect(response.statusCode).toBe(500)
        })
    })

    describe("Testing getPopular Route",()=>{
        it("Should return an array of Movies", async ()=>{
            let response = await request(app)
                .get('/extern/popular')
            expect(response.statusCode).toBe(200)
            let movies: Movie[] = response.body.data as Movie[]
            expect(movies.length).toBeGreaterThanOrEqual(1)
            expect(movies.length).toBeLessThanOrEqual(20)
            expect(movies.at(0).movieId).toBeDefined()
            expect(movies.at(0).title).toBeDefined()
            expect(movies.at(0).adultContent).toBeDefined()
        })

        it("Should fill genres but not actors", async ()=>{
            let response = await request(app)
                .get('/extern/popular')
            expect(response.statusCode).toBe(200)
            let movies: Movie[] = response.body.data as Movie[]
            expect(movies.at(0).actors.length).toBe(0)
            expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1)
        })
    })

    describe("Testing getAllGenres",()=>{
        it("Should return an array of Genres",async () => {
            let response = await request(app)
                .get('/extern/genres')
            expect(response.statusCode).toBe(200)
            let genres: Genre[] = response.body.data as Genre[]
            expect(genres.length).toBeGreaterThanOrEqual(1)
            expect(genres.at(0).genreId).toBeDefined()
            expect(genres.at(0).genreName).toBeDefined()
        })
    })

    describe("Testing getMoviesToGenre Route",()=>{
        it("Should return an array of Movies",async () => {
            let response = await request(app)
                .get('/extern/movie/genre/28')
            expect(response.statusCode).toBe(200)
            let movies: Movie[] = response.body.data as Movie[]
            expect(movies.length).toBeGreaterThanOrEqual(1)
            expect(movies.length).toBeLessThanOrEqual(20)
            expect(movies.at(0).movieId).toBeDefined()
            expect(movies.at(0).title).toBeDefined()
            expect(movies.at(0).adultContent).toBeDefined()
        })

        it("Should fill the genres array but not actors",async () => {
            let response = await request(app)
                .get('/extern/movie/genre/28')
            expect(response.statusCode).toBe(200)
            let movies: Movie[] = response.body.data as Movie[]
            expect(movies.at(0).actors.length).toBe(0)
            expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1)
        })

        it("Should return 500 if the param is not a number",async () => {
            let response = await request(app)
                .get('/extern/movie/genre/xxx')
            expect(response.statusCode).toBe(500)
        })

        it("Should return 500 if the genre doesn't exist",async () => {
            let response = await request(app)
                .get('/extern/movie/genre/99999')
            expect(response.statusCode).toBe(404)
        })
    })
})
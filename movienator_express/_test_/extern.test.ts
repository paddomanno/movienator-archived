import {afterAll, beforeAll, describe, expect, it} from "@jest/globals";
import {TestDatabaseManager} from "./test_utils/TestDatabaseManager";
import User from "../entity/user";
import request from 'supertest'
import app from '../app'
import Movie from "../entity/movie";
import Actor from "../entity/actor";
import Genre from "../entity/genre";

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

    //Ganz basic test
    it("getForSearchWord", async ()=>{
        let response = await request(app)
            .get('/extern/search/movie/Harry')
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

    it("getActorsByMovieId",async ()=>{
        let response = await request(app)
            .get('/extern/actor/movie/436270')
        expect(response.statusCode).toBe(200)
        let actors: Actor[] = response.body.data as Actor[]
        expect(actors.length).toBeGreaterThanOrEqual(1)
        expect(actors.length).toBeLessThanOrEqual(8)
        expect(actors.at(0).name).toBeDefined()
        expect(actors.at(0).actorId).toBeDefined()
    })

    it("getActorsByMovieIdWrongId",async ()=>{
        let response = await request(app)
            .get('/extern/actor/movie/xxxx')
        expect(response.statusCode).toBe(500)
    })

    it("getActorBySearchName",async ()=>{
        let response = await request(app)
            .get('/extern/search/actor/Daniel')
        expect(response.statusCode).toBe(200)
        let actors: Actor[] = response.body.data as Actor[]
        expect(actors.length).toBeGreaterThanOrEqual(1)
        expect(actors.at(0).actorId).toBeDefined()
        expect(actors.at(0).name).toBeDefined()
        expect(actors.at(0).movies.length).toBe(0)
    })

    it("getMoviesOfActor",async  () =>{
        let response = await request(app)
            .get('/extern/movies/actor/8784')
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

    it("getRecommendationsForUser",async () => {

    })

    it("getRecommendationsForMovieId",async () => {

    })

    it("getPopular", async ()=>{
        let response = await request(app)
            .get('/extern/popular')
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

    it("getAllGenres",async () => {
        let response = await request(app)
            .get('/extern/genres')
        expect(response.statusCode).toBe(200)
        let genres: Genre[] = response.body.data as Genre[]
        expect(genres.length).toBeGreaterThanOrEqual(1)
        expect(genres.at(0).genreId).toBeDefined()
        expect(genres.at(0).genreName).toBeDefined()
    })

    it("getMoviesToGenre",async () => {
        let response = await request(app)
            .get('/extern/movie/genre/28')
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

})
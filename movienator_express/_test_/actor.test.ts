import {describe, expect,afterAll,beforeAll,it} from '@jest/globals';
import {TestDatabaseManager} from "./test_utils/TestDatabaseManager";
import Actor from "../entity/actor";
import app from '../app'
import request from 'supertest'
import {response} from "express";
import Movie from "../entity/movie";

beforeAll(async () => {
    await TestDatabaseManager.getInstance().connectTestDatabase()
    await TestDatabaseManager.getInstance().resetTestDatabase()

    await createTestData()

    //console.log("Starting Actor Tests")
},(10_000))

async function createTestData(){
    let actor1: Actor = new Actor()
    actor1.actorId = 1
    actor1.name = "Kevin"
    actor1.movies = []
    await actor1.save()

    let actor2: Actor = new Actor()
    actor2.actorId = 2
    actor2.name = "Andreas"
    actor2.movies = []
    await actor2.save()

    let movie1: Movie = new Movie()
    movie1.movieId = 1;
    movie1.title = "Movie"
    movie1.adultContent = false
    movie1.actors = [actor1]
    await movie1.save()
}

afterAll(async () => {
    await TestDatabaseManager.getInstance().resetTestDatabase()
    //console.log("Finishing Actor Test")
})

describe("ActorTest",() => {

    //Ganz basic test
    it("getAllActors", async ()=>{
        let response = await request(app)
            .get('/actor/all')
        expect(response.statusCode).toBe(200)
        const allActors: Actor[] = response.body.data
        expect(allActors.length).toBe(2)
        expect(allActors[0].name).toBe("Andreas")
    })

    it("movieArrayIsFilled", async ()=>{
        let response = await request(app)
            .get('/actor/all')
        expect(response.statusCode).toBe(200)
        const allActors: Actor[] = response.body.data
        expect(allActors.length).toBe(2)
        expect(allActors[1].movies.length).toBe(1)
    })

    it("getOneActor",async ()=>{
        let response = await request(app)
            .get('/actor/one/1')
        expect(response.statusCode).toBe(200)
        const actor: Actor = response.body.data
        expect(actor.actorId).toBe(1)
        expect(actor.movies.length).toBe(1)
    })

    it("getWrongActor",async ()=>{
        let response = await request(app)
            .get('/actor/one/10')
        expect(response.statusCode).toBe(404)
    })

    it("autoSaveActorOnMovieSave",async ()=>{
        let movie: Movie = await Movie.findOne({where: {movieId: 1}, relations:{actors: true}})
        let actor3: Actor = new Actor()
        actor3.actorId = 3
        actor3.name = "Nick"
        actor3.movies = []
        movie.actors.push(actor3)
        await movie.save()

        let response = await request(app)
            .get('/actor/one/3')
        expect(response.statusCode).toBe(200)
    })

    it("getActorsToMovie",async ()=>{
        let response = await request(app)
            .get('/actor/movie/1')
        expect(response.statusCode).toBe(200)
        let actors: Actor[] = response.body.data as Actor[]
        expect(actors.length).toBeGreaterThanOrEqual(1)
        expect(actors[0].name).toBe("Kevin")
        expect(actors[0].movies.length).toBeGreaterThanOrEqual(1)
    })

    it("updateActor",async ()=>{
        let actor: Actor = await Actor.findOne({where:{actorId: 1}})
        actor.name = "Gideon"
        let response = await request(app)
            .put('/actor/')
            .send(actor)
        expect(response.statusCode).toBe(201)
        expect(response.body.data.name).toBe("Gideon")
    })

    it("updateActorWrongId",async ()=>{
        let actor: Actor = await Actor.findOne({where:{actorId: 1}})
        actor.actorId = 10
        let response = await request(app)
            .put('/actor/')
            .send(actor)
        expect(response.statusCode).toBe(404)
    })

    it("deleteActor",async ()=>{
        let actorResponse = await request(app)
            .get('/actor/one/1')
        expect(actorResponse.statusCode).toBe(200)
        let response = await request(app)
            .delete('/actor/1')
        expect(response.statusCode).toBe(204)
        let actor = await Actor.findOne({where:{actorId: 1}})
        expect(actor).toBeNull()
    })

    it("deleteActorWrongId",async ()=>{
        let response = await request(app)
            .delete('/actor/10')
        expect(response.statusCode).toBe(404)
    })

})
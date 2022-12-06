import {describe, expect,afterAll,beforeAll,it} from '@jest/globals';
import {TestDatabaseManager} from "./test_utils/TestDatabaseManager";
import Actor from "../entity/actor";
import app from '../app'
import request from 'supertest'
import {response} from "express";

beforeAll(async () => {
    await TestDatabaseManager.getInstance().connectTestDatabase()
    await TestDatabaseManager.getInstance().resetTestDatabase()

    await createTestData()

    console.log("Starting Actor Tests")
})

async function createTestData(){
    let actor: Actor = new Actor()
    actor.actorId = 1
    actor.name = "Kevin"
    actor.movies = []
    await actor.save()
}

afterAll(async () => {
    await TestDatabaseManager.getInstance().resetTestDatabase()
    console.log("Finishing Actor Test")
})

describe("Actortest",() => {

    //Ganz basic test
    it("actortest", async ()=>{
        expect(1).toBe(1)
    })

    //Test der die Daten aus dem beforeALl holt
    it("actortest2",async ()=>{
        let response = await request(app)
            .get('/actor/one/1')
        expect(response.statusCode).toBe(200)
    })

    //Test der selbst daten speichert und dann abruft
    //Nur wenn nötig, ist glaub ich schöner wenn alle Daten im setup eingefügt werden
    it("actortest3",async ()=>{
        let actor: Actor = new Actor()
        actor.actorId = 2
        actor.name = "Kevin"
        actor.movies = []
        await actor.save()

        let response = await request(app)
            .get('/actor/one/2')
        expect(response.statusCode).toBe(200)
        expect(response.body.data.actorId).toBe(2)
    })

})
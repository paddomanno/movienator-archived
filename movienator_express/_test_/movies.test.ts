import {afterAll, beforeAll, describe, expect, it} from "@jest/globals";
import {TestDatabaseManager} from "./test_utils/TestDatabaseManager";

beforeAll(async () => {
    await TestDatabaseManager.getInstance().connectTestDatabase()
    await TestDatabaseManager.getInstance().resetTestDatabase()

    await createTestData()

    console.log("Starting Movie Tests")
})

async function createTestData(){

}

afterAll(async () => {
    await TestDatabaseManager.getInstance().resetTestDatabase()
    console.log("Finishing Movie Test")
})

describe("Movietest",() => {

    //Ganz basic test
    it("movietest", async ()=>{
        expect(1).toBe(1)
    })

})
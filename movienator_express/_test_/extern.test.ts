import {afterAll, beforeAll, describe, expect, it} from "@jest/globals";
import {TestDatabaseManager} from "./test_utils/TestDatabaseManager";

beforeAll(async () => {
    await TestDatabaseManager.getInstance().connectTestDatabase()
    await TestDatabaseManager.getInstance().resetTestDatabase()

    await createTestData()

    console.log("Starting Extern Tests")
})

async function createTestData(){

}

afterAll(async () => {
    await TestDatabaseManager.getInstance().resetTestDatabase()
    console.log("Finishing Extern Test")
})

describe("Externtest",() => {

    //Ganz basic test
    it("externtest", async ()=>{
        expect(1).toBe(1)
    })

})
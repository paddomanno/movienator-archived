import {afterAll, beforeAll, describe, expect, it} from "@jest/globals";
import {TestDatabaseManager} from "./test_utils/TestDatabaseManager";

beforeAll(async () => {
    await TestDatabaseManager.getInstance().connectTestDatabase()
    await TestDatabaseManager.getInstance().resetTestDatabase()

    await createTestData()

    //console.log("Starting ProfileImage Tests")
},(10_000))

async function createTestData(){

}

afterAll(async () => {
    await TestDatabaseManager.getInstance().resetTestDatabase()
    //console.log("Finishing ProfileImage Test")
})

describe("Imagetest",() => {

    //Ganz basic test
    it("imagetest", async ()=>{
        expect(1).toBe(1)
    })

})
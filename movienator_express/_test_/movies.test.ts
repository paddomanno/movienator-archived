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

describe("MovieTests",() => {

    //Ganz basic test
    it("getAllMovies", async ()=>{
        //200 Code
        //order correct
        //Reviews, Actors, Genres filled
    })

    it("getOneMovie", async ()=>{
        //200 Code
        //Reviews, Actors, Genres filled
    })

    it("getOneMovieWrongID", async ()=>{
        //404 Code
    })

    it("getMoviesToActor", async ()=>{
        //200 Code
        //order correct
        //Reviews, Actors, Genres filled
    })

    it("getMoviesToActorWrongId", async ()=>{
        //404 Code
    })

    it("getMoviesReviewedByUser", async ()=>{
        //200 Code
        //order correct
        //Reviews, Actors, Genres filled
    })

    it("getMoviesReviewedByUserWrongId", async ()=>{
        //404 Code
    })

    it("getWatchlistByUser", async ()=>{
        //200 Code
        //order correct
        //Reviews, Actors, Genres filled
    })

    it("getWatchlistByUserWrongId", async ()=>{
        //404 Code
    })

    it("getMovieMinTime", async ()=>{
        //200 Code
        //filter correct
        //order correct
        //Reviews, Actors, Genres filled
    })

    it("getMovieMinTimeNegativeValue", async ()=>{
        //500
    })

    it("getMovieMaxTime", async ()=>{
        //200 Code
        //filter correct
        //order correct
        //Reviews, Actors, Genres filled
    })

    it("getMovieMaxTimeNegativeValue", async ()=>{
        //500
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
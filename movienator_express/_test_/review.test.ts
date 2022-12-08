import {afterAll, beforeAll, describe, expect, it} from "@jest/globals";
import {TestDatabaseManager} from "./test_utils/TestDatabaseManager";
import Review from "../entity/review";
import Movie from "../entity/movie";
import User from "../entity/user";
import app from '../app'
import request from 'supertest'

beforeAll(async () => {
    await TestDatabaseManager.getInstance().connectTestDatabase()
    await TestDatabaseManager.getInstance().resetTestDatabase()

    await createTestData()

    //console.log("Starting Review Tests")
})

async function createTestData(){
    let movie: Movie = new Movie()
    movie.movieId = 1;
    movie.title = "Movie"
    movie.adultContent = false
    await movie.save()

    let user: User = new User()
    user.firstName = "Kevin"
    user.lastName = "Hasse"
    user.userName = "keha"
    user.password = "root"
    user.birthday = new Date()
    await user.save()
}

afterAll(async () => {
    await TestDatabaseManager.getInstance().resetTestDatabase()
    //console.log("Finishing Review Test")
})

describe("ReviewTests",() => {

    //Ganz basic test
    it("getAllReviews", async ()=>{
        //Correct Order
        //User and Movie filled
    })

    //Route Muss noch gemacht werden
    it("getSingleReview", async ()=>{
        //User and Movie are filled
    })

    it("getReviewsToMovie", async ()=>{
        //Correct Order
        //User and Movie are filled
    })

    it("getUserOwnReviews", async ()=>{
        //Correct Order
        //User and Movie are filled
    })

    it("getUserFollowingReviews", async ()=>{
        //Correct Order
        //User and Movie are filled
    })

    it("getUserFollowingReviewsSinceDate", async ()=>{
        //Filter Correct
        //Correct Order
        //User and Movie are filled
    })

    it("getAllSinceTime", async ()=>{
        //Filter Correct
        //Correct Order
        //User and Movie are filled
    })

    it("postNewReview", async ()=>{
        let review: Review = new Review()
        review.reviewUserUserId = 1
        review.reviewMovieMovieId = 1
        review.title = "Liked"
        review.content = "Was good"
        review.rating = 5
        review.lastUpdated = new Date()

        let response = await request(app)
            .post('/review/')
            .send(review)
        expect(response.statusCode).toBe(201)
        expect(response.body.data.title).toBe("Liked")
        //201 res code
        //Check values after
    })

    it("updateReview", async ()=>{
        //Correct Order
        //Check values after
    })

    it("deleteReview", async ()=>{
        //204 res
        //User not exisiting after
    })


})
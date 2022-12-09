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

    let movie2: Movie = new Movie()
    movie2.movieId = 2;
    movie2.title = "Movie2"
    movie2.adultContent = false
    await movie2.save()

    let user: User = new User()
    user.firstName = "Kevin"
    user.lastName = "Hasse"
    user.userName = "keha"
    user.password = "root"
    user.birthday = new Date()
    await user.save()

    let user2: User = new User()
    user2.firstName = "Isidora"
    user2.lastName = "Jankovic"
    user2.userName = "isij"
    user2.password = "root"
    user2.birthday = new Date()
    await user2.save()

    // review of keha
    let review: Review = new Review()
    review.reviewMovieMovieId = 1
    review.reviewUserUserId = 1
    review.title = "My first review"
    review.content = "Best movie ever"
    review.rating = 5
    review.lastUpdated = new Date()
    review.review_movie = movie
    review.review_user = user
    await review.save()

    // review of isij for movie
    let review2: Review = new Review()
    review2.reviewMovieMovieId = 1
    review2.reviewUserUserId = 2
    review2.title = "Nah"
    review2.content = "Could be better"
    review2.rating = 1
    review2.lastUpdated = new Date()
    review2.review_movie = movie
    review2.review_user = user2
    await review2.save()

    // review of isij for movie2
    let review3: Review = new Review()
    review3.reviewMovieMovieId = 2
    review3.reviewUserUserId = 2
    review3.title = "Liked it!"
    review3.content = "Pretty good"
    review3.rating = 8
    review3.lastUpdated = new Date()
    review3.review_movie = movie2
    review3.review_user = user2
    await review3.save()
}

afterAll(async () => {
    await TestDatabaseManager.getInstance().resetTestDatabase()
    //console.log("Finishing Review Test")
})

describe("ReviewTests",() => {

    //Ganz basic test
    it("getAllReviews", async ()=>{
        let response = await request(app)
            .get('/review/all')
        expect(response.statusCode).toBe(200) 
        const allReviews: Review[] = response.body.data
        expect(allReviews.length).toBe(3)
        expect(allReviews.at(0).title).toBe("My first review")
        // expect(allReviews.at(0).review_movie).toBe("Movie")
        // expect(allReviews.at(0).review_user.firstName).toBe("Kevin")
    })
 
    it("getSingleReview", async ()=>{
        let response = await request(app)
            .get('/review/one/1/2')
        expect(response.statusCode).toBe(200)
        const review: Review = response.body.data
        // expect(review.review_movie.title).toBe("Movie")
        // expect(review.review_user.firstName).toBe("Isidora")
    })

    it("getReviewsToMovie", async ()=>{
        let response = await request(app)
            .get('/review/movie/1')
        expect(response.statusCode).toBe(200)
        const allReviewsOfMovie: Review[] = response.body.data
        expect(allReviewsOfMovie.length).toBe(2)
        expect(allReviewsOfMovie.at(0).title).toBe("My first review")
        // expect(allReviewsOfMovie.at(0).review_movie.title).toBe("Movie")
        // expect(allReviewsOfMovie.at(0).review_user.firstName).toBe("Kevin")
    })

    it("getUserOwnReviews", async ()=>{
        let response = await request(app)
            .get('/review/user/own/2')
        expect(response.statusCode).toBe(200)
        const allReviewsOfMovie: Review[] = response.body.data
        expect(allReviewsOfMovie.length).toBe(2)
        expect(allReviewsOfMovie.at(0).title).toBe("Nah")
        // expect(allReviewsOfMovie.at(0).review_movie.title).toBe("Movie")
        // expect(allReviewsOfMovie.at(0).review_user.firstName).toBe("Isidora")
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
        let review: Review = await Review.findOne(
            {where: {reviewMovieMovieId: 1, reviewUserUserId: 1}})
        review.rating = 8
        let response = await request(app)
            .put('/review')
            .send(review)
        expect(response.statusCode).toBe(201)

        //Correct Order

        //Check values after
    })

    it("deleteReview", async ()=>{
        let response = await request(app)
            .delete('review/2/1')
        expect(response.statusCode).toBe(204)
        let reviewsOfMovie = await request(app)
            .get('/review/movie/1')
        expect(reviewsOfMovie.statusCode).toBe(200)
        const allReviewsOfMovie: Review[] = response.body.data
        expect(allReviewsOfMovie.length).toBe(1)
        //User not exisiting after
    })


})
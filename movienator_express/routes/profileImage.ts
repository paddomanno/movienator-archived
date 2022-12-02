
const expressProfileImage = require("express")
const profileImageRouter = expressProfileImage.Router()

//TODO Routing implementieren

//All images
profileImageRouter.get("/all", async (req,res) => {

})

//The image with that link
profileImageRouter.get("/ref/:ref", async (req,res) => {

})

//The Image of the User with that Id
profileImageRouter.get("/user/:id", async (req,res) => {

})

//Saves the image from the body
profileImageRouter.post("/", async (req,res)=>{

})

//Updates the image from the body
profileImageRouter.put("/", async (req,res) => {

})

//Deletes the image with that link
profileImageRouter.delete("/:ref", async (req,res) => {

})

module.exports = profileImageRouter
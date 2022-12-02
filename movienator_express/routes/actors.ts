
const expressActor = require("express")
const actorRouter = expressActor.Router()

//TODO Routing implementieren

module.exports = actorRouter

//Gets all actors from the database
actorRouter.get("/all", async (req,res) => {

})

//Gets one actor by his id
actorRouter.get("/one/:id", async (req,res) => {

})

//Gets all the actors to the movie with that id
actorRouter.get("/movie/:id", async (req,res) => {

})

//Updates the actor send in the body
//Make sure to NOT update the primary keys or relations
actorRouter.put("/", async (req,res)=>{

})

//Inserts the actor send in the body
actorRouter.post("/",async (req,res)=>{

})

//Deletes the actor with that id
actorRouter.delete("/:id",async (req,res)=>{

})
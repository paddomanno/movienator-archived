'use strict';

import "reflect-metadata"
import "body-parser"

import bodyParser = require("body-parser");
import cors = require("cors")
const express = require("express")
const app = express()
const actorRouter = require("./routes/actors")
const movieRouter = require("./routes/movies")
const profileImageRouter = require("./routes/profileImage")
const reviewRouter = require("./routes/reviews")
const userRouter = require("./routes/users")

//Use Body Parser to read http bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
//Use Cors to answer extern requests
app.use(cors())

//Anfragen an app mit /... werden an den importierten router weitergeleitet
app.use("/actor",actorRouter)
app.use("/movie",movieRouter)
app.use("/profileImage",profileImageRouter)
app.use("/review",reviewRouter)
app.use("/user",userRouter)

export default app



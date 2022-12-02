'use strict';

import "reflect-metadata"
import "body-parser"

import bodyParser = require("body-parser");
import cors = require("cors")
const express = require("express")
const app = express()
// const customRoutes = require("./routes/custom")

//Use Body Parser to read http bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
//Use Cors to answer extern requests
app.use(cors())

//Anfragen an app mit /... werden an den importierten router weitergeleitet
//app.use("/custom",customRoutes)
export default app



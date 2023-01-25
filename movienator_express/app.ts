'use strict';

import 'reflect-metadata';
import 'body-parser';


import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');
const actorRouter = require('./routes/actors');
const movieRouter = require('./routes/movies');
const profileImageRouter = require('./routes/profileImage');
const reviewRouter = require('./routes/reviews');
const userRouter = require('./routes/users');
const externRouter = require('./routes/extern');
const genreRouter = require('./routes/genres');
const recommendationRouter = require('./routes/recommendations');
const watchProvider = require('./routes/watchProviders');

const app = express();

//Use Body Parser to read http bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Use Cors to answer extern requests
app.use(cors());

//Anfragen an app mit /... werden an den importierten router weitergeleitet
app.use('/actor', actorRouter);
app.use('/movie', movieRouter);
app.use('/profileImage', profileImageRouter);
app.use('/review', reviewRouter);
app.use('/user', userRouter);
app.use('/extern', externRouter);
app.use('/genre', genreRouter);
app.use('/recommendation', recommendationRouter);
app.use('/watchProvider', watchProvider);

export default app;

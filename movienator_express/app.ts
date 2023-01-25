'use strict';

import 'reflect-metadata';
import 'body-parser';


import bodyParser = require('body-parser');
import cors from'cors';
import express from'express';
import actorRouter from './routes/actors';
import movieRouter from './routes/movies';
import profileImageRouter from'./routes/profileImage';
import reviewRouter from'./routes/reviews';
import userRouter from'./routes/users';
import externRouter from'./routes/extern';
import genreRouter from'./routes/genres';
import recommendationRouter from'./routes/recommendations';
import watchProvider from'./routes/watchProviders';

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

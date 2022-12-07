import Genre from "../entity/genre";

const expressGenres = require('express');
const genresRouter = expressGenres.Router();

//Returns all the genres there currently are in the database
//Movies array is filled
genresRouter.get("/all", async (req,res)=>{
    try {
        const allGenres: Genre[] = await Genre.find({
            relations: { movies: true },
        });
        if (allGenres) {
            allGenres.sort((a, b) => a.genreName.localeCompare(b.genreName));
        }
        res.status(200).json({
            data: allGenres,
        });
    } catch (er) {
        console.log(er);
        res.status(500).json();
    }
})



module.exports = genresRouter
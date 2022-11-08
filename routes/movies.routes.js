const router = require("express").Router()
const Movie = require("./../models/Movie.model")
const Celeb = require('./../models/Celeb.model')


/**
 * All of those routes are prefixed with
 * ! /movies
 */

router.get("/", async (req, res) => {
    const allMovies = await Movie.find()
    res.render("movies/movies", { allMovies })
})

router.get('/create', async (req, res, next) => {
    try {
        const allCelebs = await Celeb.find()
        res.render('movies/new-movie', { allCelebs })

    } catch (err) {
        next(err)
    }
})

router.post("/create", async (req, res, next) => {
    const { title, genre, plot, cast } = req.body
    try {
        await Movie.create({
            title,
            genre,
            plot,
            cast
        })
        res.redirect("/movies")

    } catch (err) {
        next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('cast')
        res.render("movies/movie-details", { movie })
    } catch (err) {
        next(err)
    }
})

router.post('/:id/delete', async (req, res) => {
    try {
        await Movie.findByIdAndRemove(req.params.id)
        res.redirect('/movies')
    } catch (error) {
        next(err)
    }
})


router.get('/:id/edit', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('cast')
        const allOtherCelebs = await Celeb.find({ $nor: movie.cast })

        res.render('movies/edit-movie', { movie, allCelebs: allOtherCelebs })
    } catch (error) {
        next(err)
    }
})

router.post("/:id/edit", async (req, res, next) => {
    try {
        await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        res.redirect("/movies")
    } catch (error) {
        next(error)
    }
})

module.exports = router
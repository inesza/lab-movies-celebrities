const router = require("express").Router()
const Celeb = require("./../models/Celeb.model")
const mongoose = require("mongoose")
const Movie = require("../models/Movie.model")


/**
 * All of those routes are prefixed with
 * ! /celebs
 */

router.get("/", async (req, res) => {
    const allCelebs = await Celeb.find()
    res.render("celebs/celebs", { allCelebs })
})

router.get('/create', async (req, res, next) => {
    try {
        res.render('celebs/new-celeb')

    } catch (err) {
        next(err)
    }
})

router.post("/create", async (req, res) => {
    const { name, occupation, catchPhrase } = req.body
    const newCeleb = await Celeb.create({
        name,
        occupation,
        catchPhrase
    })
    res.redirect(`/celebs`)
})

router.get("/:id", async (req, res, next) => {
    try {
        const celeb = await Celeb.findById(req.params.id)
        const starredIn = await Movie.find({ cast: { $in: [(req.params.id)] } })
        res.render("celebs/celeb-details", { celeb, starredIn })
    } catch (err) {
        next(err)
    }
})

router.post('/:id/delete', async (req, res) => {
    try {
        await Celeb.findByIdAndRemove(req.params.id)
        res.redirect('/celebs')
    } catch (error) {
        next(err)
    }
})


router.get('/:id/edit', async (req, res) => {
    try {
        const celeb = await Celeb.findById(req.params.id)

        res.render('celebs/edit-celeb', { celeb })
    } catch (error) {
        next(err)
    }
})

router.post("/:id/edit", async (req, res, next) => {
    try {
        await Celeb.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        res.redirect("/celebs")
    } catch (error) {
        next(error)
    }
})

module.exports = router
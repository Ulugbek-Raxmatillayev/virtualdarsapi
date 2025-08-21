const mongoose = require('mongoose')
const express = require('express');
const { validateCourse, Course } = require('../models/course');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const router = express.Router();

//courses qo'shish apisi
router.post('/', [auth, authAdmin], async (req, res) => {
    const { error } = validateCourse(req.body)
    if (error) {
        return res.status(400).send({
            message: 'Bad requiest, please fill all the fields correctly',
            error: error
        })
    }

    let course = new Course({
        tags: req.body.tags,
        title: req.body.title,
        category: req.body.category,
        trainer: req.body.trainer,
        status: req.body.status
    })
    course = await course.save();

    res.status(201).send(course);
})

//courslarni hammasini get qilish apisi
router.get('/', auth, async (req, res) => {
    const courses = await Course.find()
        .sort('title')
        .populate('category', 'name -_id') // category ichidan faqat kerakli fieldlarni chiqarish;
    if (!courses || courses.length === 0)
        return res.status(404).send('Courses is empty ');
    res.send(courses);
})

//courslarni id boyucha bitasini get qilish apisi
router.get('/:id', auth, async (req, res) => {
    let course = await Course.findById(req.params.id)
        .populate('category', 'name');
    if (!course)
        return res.status(404).send('Element not found of this id');

    res.send(course);
});


//courseni update qilish yangilash apisi
router.put('/:id', [auth, authAdmin], async (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const updatedCourse = {
        tags: req.body.tags,
        title: req.body.title,
        category: req.body.category,
        trainer: req.body.trainer,
        status: req.body.status
    }

    let course = await Course.findByIdAndUpdate(req.params.id, updatedCourse, { new: true });
    if (!course)
        return res.status(404).send('Element not found of this id');

    res.send(course);
});

//courseni delete qilish
router.delete('/:id', [auth, authAdmin], async (req, res) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course)
        return res.status(404).send('Element not found of this id');


    res.send(course);
});

module.exports = router
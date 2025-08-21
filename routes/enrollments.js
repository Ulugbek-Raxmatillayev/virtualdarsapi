const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();
const { Enrollment } = require('../models/enrollment');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

//enrollmentni qo'shish apisi
router.post('/', [auth, authAdmin], async (req, res) => {
    let enrollment = new Enrollment({
        customer: req.body.customerId,
        course: req.body.courseId,
        courseFee: req.body.courseFee,
    })
    enrollment = await enrollment.save();
    res.status(201).send(enrollment);
})


//enrollmentni hammasini get qilish apisi
router.get('/', auth, async (req, res) => {

    const enrollment = await Enrollment.find()
        .populate('customer', '_id, name')
        .populate('course', '_id, title')
        .sort('dateStart')

    if (!enrollment)
        return res.status(404).send('Element not found of this id')
    res.send(enrollment)
})

router.get('/:id', auth, async (req, res) => {
    const enrollment = await Enrollment.findById(req.params.id)
        .populate('customer', '_id, name')
        .populate('course', '_id, title')

    if (!enrollment)
        return res.status(404).send('Element not found of this id')

    res.send(enrollment)
})


//enrollmentni update qilish yangilash apisi
router.put('/:id', [auth, authAdmin], async (req, res) => {
    const updatedEnrollment = {
        customer: req.body.customerId,
        course: req.body.courseId,
        courseFee: req.body.courseFee,
    }

    let enrollment = await Enrollment.findByIdAndUpdate(req.params.id, updatedEnrollment, { new: true });
    if (!enrollment)
        return res.status(404).send('Element not found of this id');

    res.send(enrollment);
});

//enrollmentni delete qilish apisi
router.delete('/:id', [auth, authAdmin], async (req, res) => {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment)
        return res.status(404).send('Element not found of this id');


    res.send(enrollment);
});

module.exports = router
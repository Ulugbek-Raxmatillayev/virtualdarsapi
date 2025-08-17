const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    title: {
        type: String,
        required: true
    },
})
const coursesSchema = new mongoose.Schema({
    tags: {
        type: [String],
        required: true
    },
    title: String,
    category: categorySchema,
    trainer: {type: String, required: true},
    status: {type: [String], enum: ['Active', 'InActive']}
})

router.post('/', (req,res)=> {
    
})
// module.exports = router
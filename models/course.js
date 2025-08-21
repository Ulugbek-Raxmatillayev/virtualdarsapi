const Joi = require('joi');
const mongoose = require('mongoose');


const coursesSchema = new mongoose.Schema({
    tags: [String],
    title: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 255,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',   // Category modeliga reference
        required: true
    },
    trainer: { type: String, trim: true, required: true },
    status: { type: [String], enum: ['Active', 'InActive'] }
})

const Course = mongoose.model('Course', coursesSchema);


function validateCourse(course) {
    const schema = Joi.object({
        tags: Joi.array().items(Joi.string()).optional(), // array of strings
        title: Joi.string().required().min(3),
        category: Joi.string().required(), // bu yerda ObjectId string bo'ladi
        trainer: Joi.string().required(),
        status: Joi.string().valid('Active', 'InActive').required()
    });

    return schema.validate(course); // ✅ To‘g‘ri uslub
}

exports.validateCourse = validateCourse;
exports.Course = Course;
const mongoose = require('mongoose')

//enrollmentni sxemasi
const enrollmentSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'Customer',
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        trim: true,
        required: true
    },
    courseFee: {
        type: Number,
        required: true,
        min: 10,
        max: 10000
    },
    dateStart:  {
        type: Date,
        default: Date.now
    }
})

const Enrollment = mongoose.model('enrollments', enrollmentSchema)

exports.Enrollment = Enrollment;
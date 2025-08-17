const Joi = require('joi');
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    }
})

const Category = mongoose.model('Category', categorySchema);




function validateCategory(category) {
    const schema = Joi.object({
        name: Joi.string().required().min(3)
    });

    return schema.validate(category); // ✅ To‘g‘ri uslub
}


exports.Category = Category;
exports.validateCategory = validateCategory;
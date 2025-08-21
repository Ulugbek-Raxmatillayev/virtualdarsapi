const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    isVip: {
        type: Boolean,
        required: true,
        default: false
    },
    phone: {
        type: Number,
        required: true,
        validate: {
            validator: function (val) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const result = val && val.toString().length >= 9;
                        resolve(result);
                    }, 10)
                })
            },
            message: 'Phone number less must be 9 numbers please bitch.'
        }
    }
})

const Customer = mongoose.model('Customer', customerSchema);


function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().required().min(3),
        phone: Joi.number().required(),
        isVip: Joi.boolean().required()
    })

    return schema.validate(customer)
}


exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
const express = require('express');
const router = express.Router();
const{Customer, validateCustomer} = require('./models/customers')

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.status(200).send(customers)
});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let customer = new Customer({
        name: req.body.name,
        isVip: req.body.isVip,
        phone: req.body.phone
    })

    customer = await customer.save()
    res.status(201).send(customer)
});

router.get('/:id', async (req, res) => {
    let customer = await Customer.findById(req.params.id)
    if (!customer)
        return res.status(404).send('This customer is not found!');

    res.send(customer)
})

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name, isVip: req.body.isVip, phone: req.body.phone }, { new: true })
    if(!customer)
        return res.status(404).send('This updating customer is not found!')
    res.send(customer)
})

router.delete('/:id', async(req,res)=>{
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer)
        return res.status(404).send('this customer for delete is not found!, I\'m sorry bro.')

    res.send(customer)
})

module.exports = router;
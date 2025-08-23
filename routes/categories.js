
const express = require('express');
const router = express.Router();
const { Category, validateCategory } = require('../models/category');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const mongoose = require('mongoose')

//Categories
// #swagger.tags = ['Categories']
// #swagger.description = 'Yangi kategoriya qo‘shish'
router.get('/', async (req, res) => {
    // throw new Error('Kitlgan xatolik')
    const categories = await Category.find().sort('name');
    res.send(categories);
});

router.post('/', authAdmin, async (req, res) => {
    const { error } = validateCategory(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let category = new Category({
        name: req.body.name
    });
    category = await category.save();

    res.status(201).send(category);
});

router.get('/:id', auth, async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Yaroqsz id');
    let category = await Category.findById(req.params.id);
    if (!category)
        return res.status(404).send('Berilgan IDga teng bo\'lgan toifa topilmadi');

    res.send(category);
});

router.put('/:id', [auth, authAdmin], async (req, res) => {
    const { error } = validateCategory(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!category)
        return res.status(404).send('Berilgan IDga teng bo\'lgan toifa topilmadi');


    res.send(category);
});

router.delete('/:id', [auth, authAdmin], async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
        return res.status(404).send('Berilgan IDga teng bo\'lgan toifa topilmadi');

    res.send(category);
});


module.exports = router;
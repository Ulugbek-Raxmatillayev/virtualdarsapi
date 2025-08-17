const express = require('express');

const categoriesRoute = require('./routes/categories');
const customersRoute = require('./routes/customers')
const app = express();
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/virtualdars')
    .then(() => {
        console.log('Mongodbga ulansh boldi...')
    }).catch((err) => {
        console.error('Mongodbga ulanshda xato ruy berdi')
    })

app.use(express.json());
app.use('/api/categories', categoriesRoute);
app.use('/api/customers', customersRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`${port}chi portni eshitishni boshladim...`);
});
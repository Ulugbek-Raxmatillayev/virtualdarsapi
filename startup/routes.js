const express = require('express');
const errorMiddleware = require('../middleware/error')
const categoriesRoute = require('../routes/categories');
const customersRoute = require('../routes/customers')
const courseRoute = require('../routes/courses')
const userRegisterRoute = require('../auth/users')
const enrollmentRoute = require('../routes/enrollments')
const homePage = require('../page/homePage')
module.exports = function (app) {

    app.use(express.json());
    app.use('/', homePage)
    app.use('/api/categories', categoriesRoute);
    app.use('/api/customers', customersRoute);
    app.use('/api/courses', courseRoute);
    app.use('/api/enrollments', enrollmentRoute)
    app.use('/api/auth', userRegisterRoute)
    app.use(errorMiddleware)
}
const express = require('express');
const app = express();
const winston = require('winston')
const swaggerUi =  require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json')
require('./startup/logging')()
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/prod')(app)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    winston.info(`${port}chi portni eshitishni boshladim...`);
});

module.exports = server;
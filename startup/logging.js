const winston = require('winston')
require('winston-mongodb')

module.exports = function () {
    winston.add(new winston.transports.Console())
    winston.add(new winston.transports.File({ filename: 'logs/vd-logs.log', level: 'silly' }))
    winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/virtualdars-logs' }))

    winston.exceptions.handle(new winston.transports.Console(),new winston.transports.File({ filename: 'logs/vd-logs.log', level: 'silly' }))


    process.on('unhandledRejection', ex => {
        throw ex;
    })
}
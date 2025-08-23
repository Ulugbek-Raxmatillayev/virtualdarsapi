const swaggerAutogen = require('swagger-autogen')();

const doc = {
    openapi: "3.0.0",
    info: {
        title: 'My Api',
        description: 'Swagger autogen bilan avtomatik hujjatlar'
    },
    servers: [
        {
            url: "http://localhost:5000"
        },
        {
            url: "https://virtualdarsapi.onrender.com"
        }
    ],
    tags: [
        {
            name: "Auth",
            description: "Authentication va user login/register API'lari",
        },
        {
            name: "Categories",
            description: "User CRUD API'lari",
        },
         {
            name: "Courses",
            description: "User CRUD API'lari",
        },
         {
            name: "Enrollments",
            description: "User CRUD API'lari",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]

};

const outputFile = "./swagger-output.json"; //json fayl
const endpointsFiles = ["index.js","./startup/routes.js"] //route fayllar

swaggerAutogen(outputFile, endpointsFiles, doc)
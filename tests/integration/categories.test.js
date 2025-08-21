const request = require('supertest')
let server;
const { Category } = require('../../models/category')
const { Users } = require('../../models/user');

describe('/app/categories', () => {
    beforeAll(() => {
        server = require('../../index');
    })
    afterAll(async () => {
        await server.close();
        await Category.deleteMany({});
    })
    describe('GET /', () => {
        it('should return all categories', async () => {
            await Category.collection.insertMany([
                { name: 'dasturlash' },
                { name: 'tarmoqlash' },
                { name: 'dizayn' }
            ])
            const response = await request(server).get('/api/categories');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);
            expect(response.body.some(cat => cat.name == 'dasturlash')).toBeTruthy();
        })
    });

    describe('GET /:id', () => {
        it('should return a category if valid id is given', async () => {
            const response = await request(server).get('/api/categories/123')
            expect(response.status).toBe(404);
        });

        it('should return 404 error if notvalid id is given', async () => {
            const category = new Category({ name: 'ai -suniy idrok' });
            await category.save();

            const user = new Users({ role: 'role_admin' });
            const token = user.generateAuthToken();

            const response = await request(server)
                .get('/api/categories/' + category._id)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', 'ai -suniy idrok');
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        //testlar uchun ishlatiladigan funksiyani bu yerda oldindan 
        //aniqlab olamz va uni har bir test ichida alohida chaqiramz
        const execute = async () => {
            return await request(server)
                .post('/api/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({ name });
        }

        beforeAll(() => {
            token = new Users().generateAuthToken();
            name = 'dasturlash'
        })

        it('should return 401 if user is not logged in', async () => {
            token = ''
            const res = await execute();
            expect(res.status).toBe(401)
        })


        it('should return 400 if category name is less than 3 characters or letters', async () => {
            name = '12';
            const res = await execute();
            expect(res.status).toBe(400)
        })


        it('should return 400 if category name is more than 50 characters or letters', async () => {
            name = new Array(52).join('c');
            const res = await execute();
            expect(res.status).toBe(400)
        })

        it('should save the category if it is valid', async () => {
            await execute();
            const category = await Category.find({ name: 'dasturlash' })
            expect(category).not.toBeNull();
        })
        it('should return the category if it is valid', async () => {
            const res = await execute();
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'dasturlash')

        })
    });
})
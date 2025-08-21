const { Users } = require('../../../models/user')
const jwt = require('jsonwebtoken')
const config = require('config');

describe('user.generateAuthToken', () => {
    it('should return a valid JWT token', () => {
        const user = new Users({ role: 'role_admin' })
        const token = user.generateAuthToken()
        const decodedObject = jwt.verify(token, config.get('jwtPrivateKey'))
        expect(decodedObject).toMatchObject({ role: 'role_admin' })
    });
});
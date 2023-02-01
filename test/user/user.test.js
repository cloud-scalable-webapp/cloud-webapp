const server = require('../../server');
const request = require('supertest');
var expect = require('chai').expect;

const fn = async x => {
    return new Promise(resolve => {
        setTimeout(resolve, 3000, 2*x);
    });
};
(async function () {
    const z = await fn(6);
    describe('User Service Tests', function() {
        const data = {
            first_name: "Test",
            last_name: "User",
            username: "test@domain.com",
            password: "TestPassword123"
        };
        it('Health Check', function() {
            request(server).get('/healthz')
                    .expect(200);
        });

        it('Create a user', async function() {
            const res = await request(server)
                    .post('/v1/user')
                    .send(data)
                    .expect(201);                    
          });

        it('Get a user by ID without credentials', async function() {
            const res = await request(server)
                    .get('/v1/user/1')
                    .send(data)
                    .expect(401);    
            expect(res.body.message).equals('Missing Authorization Header');                   
        });

        it('Get a user by ID with valid credentials', async function() {
            const res = await request(server)
                    .get('/v1/user/1')
                    .auth(data.username, data.password)
                    .expect(200);    
            expect(res.body.id).equals(1);      
            expect(res.body.first_name).equals(data.first_name);                   
            expect(res.body.last_name).equals(data.last_name);                   
            expect(res.body.username).equals(data.username);                   
            expect(res.body.account_created).to.not.equal(null);               
            expect(res.body.account_updated).to.not.equal(null);                 
        });
    })
    run();
})();
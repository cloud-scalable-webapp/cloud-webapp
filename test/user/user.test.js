const server = require('../../server');
const request = require('supertest');
var expect = require('chai').expect;
const http = require('http');
const assert = require('assert');

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
        it('Health Test', function(done) {
			http.get('http://127.0.0.1:8000/healthz', function(response) {
				assert.equal(response.statusCode, 400);
				done();
			});
		});

        // it('Create a user', async function() {
        //     const res = await request(server)
        //             .post('/v1/user')
        //             .send(data)
        //             .expect(201);                    
        //   });

        // it('Get a user by ID without credentials', async function() {
        //     const res = await request(server)
        //             .get('/v1/user/1')
        //             .send(data)
        //             .expect(401);    
        //     expect(res.body.message).equals('Missing Authorization Header');                   
        // });

        // it('Get a user by ID with valid credentials', async function() {
        //     const res = await request(server)
        //             .get('/v1/user/1')
        //             .auth(data.username, data.password)
        //             .expect(200);  
        //             let date_ob = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  
        //     expect(res.body.id).equals(1);      
        //     expect(res.body.first_name).equals(data.first_name);                   
        //     expect(res.body.last_name).equals(data.last_name);                   
        //     expect(res.body.username).equals(data.username);                   
        //     expect(res.body.account_created).equals(date_ob);               
        //     expect(res.body.account_updated).equals(date_ob);                 
        // });
    })
    run();
})();
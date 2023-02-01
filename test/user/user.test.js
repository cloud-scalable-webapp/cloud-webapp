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
    })
    run();
})();
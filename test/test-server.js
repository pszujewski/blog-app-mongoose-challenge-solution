const mongoose = require('mongoose');

const seedData = require('../seed-data.json');
//console.log(seedData);

const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');
const {BlogPost} = require('../models');
const {TEST_DATABASE_URL} = require('../config');

const should = chai.should();

chai.use(chaiHttp);

function seedDatabase(){
    return BlogPost.insertMany(seedData);
}

function tearDownDb(){
    console.warn('Deleting Database!!');
    return mongoose.connection.dropDatabase();
}

describe('Blog API Resource', function(){
    before(function (){
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function (){
        return seedDatabase(seedData);
    });
    afterEach(function (){
        return tearDownDb();
    });
     after(function (){
        return closeServer();
    });

    describe('Get Endpoint', function(){
        it('Should Return All Existing Blog Posts', function() {
            let res;
            return chai.request(app)
                .get('/posts')
                .then(function(_res) {
                    res = _res;
                    res.should.have.status(200);
                    res.body.should.have.length.of.at.least(1);
                    return BlogPost.count();
                })
                .then(function (count){
                    res.body.should.have.length.of(count);
                });

        }); //it
    }); // get describe

}); //outer describe




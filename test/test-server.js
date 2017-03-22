const mongoose = require('mongoose');

const seedData = require('../seed-data.json');
console.log(seedData);

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
    after(function (){
        return closeServer();
    });
    afterEach(function (){
        return tearDownDb();
    });

    describe('Get Endpoint', function(){
        it('Should Return All Existing Blog Post'){
            
        }:
    });
});




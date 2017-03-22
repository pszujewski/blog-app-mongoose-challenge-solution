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

    describe('POST Endpoint', function() {
     it('should add a new blog post', function() {
        const newPost = {
           title: "Fake post title, bitch",
           author: {
               firstName: "J.K",
               lastName: "Rowling"
           },
           content: "Imma be a fake post",
           created: Date.now()  
        };
        return chai.request(app)
        .post('/posts')
        .send(newPost)
        .then(function(res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys(
                "title", "author", "content", "created");
            res.body.title.should.equal(newPost.title);
            res.body.author.should.equal(newPost.author.firstName+ " "+newPost.author.lastName);
            res.body.content.should.equal(newPost.content);
            console.log(res.body.id);
            return BlogPost.findById(res.body.id);
        })
        .then(function(foundPost) {
            foundPost.title.should.equal(newPost.title);
            foundPost.author.firstName.should.equal(newPost.author.firstName);
            foundPost.author.lastName.should.equal(newPost.author.lastName);
            foundPost.content.should.equal(newPost.content);
        });
     });
    });

}); //outer describe




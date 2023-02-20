//During the test the env variable is set to test
process.env.NODE_ENV = 'test';


import Tag from '../models/tags.js'
import User from '../models/users.js'
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';
let should = chai.should();
var user_id;

chai.use(chaiHttp);
//Our parent block
describe('Tags', () => {
    beforeEach((done) => { //Before each test we empty the database
      // Add test user.
      const user = new User({
        userName: "test",
        password: "Tester1!"
      });
      user.save(function(err,saved) {
        user_id = saved.id;
     });
        Tag.remove({}, (err) => { 
           done();           
        });        
    });
/*
  * Test the /GET route
  */
  describe('/GET Tags', () => {
      it('it should GET all the Tags', (done) => {
        chai.request(server)
            .get('/tag')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });


  /*
  * Test the /POST route
  */
  describe('/POST tag', () => {
    it('it should not post a ', (done) => {
      let tag = {
          tagName: "testertag",
          coords: 123,
          placed: true,
          owner: "111111111111111111111111"
      }
    chai.request(server)
        .post('/tag')
        .send(tag)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.eql('No user for this tag!');
          done();
    });
});
it('it should POST a tag ', (done) => {
  let tag = {
    tagName: "testertag",
    coords: 123,
    placed: true,
    owner: user_id
}
chai.request(server)
    .post('/tag')
    .send(tag)
    .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.data.should.have.property('tagName');
          res.body.data.should.have.property('coords');
          res.body.data.should.have.property('placed');
          res.body.data.should.have.property('owner');
      done();
    });
});
});

});
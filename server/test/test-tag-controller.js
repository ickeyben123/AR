//During the test the env variable is set to test
process.env.NODE_ENV = 'test';


import Tag from '../models/tags.js'
import User from '../models/users.js'
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';
let should = chai.should();
let expect = chai.expect();
var user_id;

let defaultUser = {
  userName: "admin",
  email: "admin@admin.com",
  password: "password1",
  roles: ["admin"]
};

var Cookies;

chai.use(chaiHttp);
//Our parent block
describe('Tags', () => {
  const agent = chai.request.agent(server);

  let tag = {
    tagName: "testertag",
    coords: 123,
    placed: true,
}

  it("Doesn't post a tag", async () => {
    const res = await agent.post("/tag").send(tag);
    res.should.have.status(403);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.error.should.be.eql('No user for this tag!');
});

// MUST LOGIN BEFORE USING ANY SESSION SPECIFIC ROUTES

  it("Run login", async () => {
    const res = await agent.post("/user/login").send(defaultUser);
    res.should.have.cookie('ar-session')
  });

  // SESSION SPECIFIC ROUTES

  it("Posts a tag", async () => {
    const res = await agent.post("/tag").send(tag);
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.data.should.have.property('tagName');
    res.body.data.should.have.property('coords');
    res.body.data.should.have.property('placed');
    res.body.data.should.have.property('owner');
  });

  
  it("Gets a tag", async () => {
    const res = await agent.get("/tag");
    res.should.have.status(200);
    res.body.should.be.a('array');
});

});

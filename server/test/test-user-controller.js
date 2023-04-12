process.env.NODE_ENV = 'test';

import Tag from '../models/tags.js';
import User from '../models/users.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

var should = chai.should();
var expect = chai.expect();
var user_id;
var Cookies;

chai.use(chaiHttp);

describe("Users", () => {
  
  const agent = chai.request.agent(server);

  it("Adds a user with valid credentials", async () => {
    const res = await agent.post("/user").send({
      "userName": "test_valid_user",
      "password": "test_pas5",
      "email": "test_email@valid.com"
    });
    res.should.have.status(200);
    let user = await User.find({ userName: "test_valid_user" });
    user.length.should.be.eql(1);
  });

  it("Login valid user", async () => {
    const res = await agent.post("/user/login").send(
    {
      "userName": "test_valid_user",
      "password": "test_pas5",
    });
    res.should.have.status(200);
    res.should.have.cookie("ar-session");
  });

  it("Grabs valid user's details", async () => {
    const res = await agent.get("/user");
    res.should.have.status(200);
    res.body[0].should.have.property("userName");
    res.body[0].should.have.property("email");
    res.body[0].userName.should.be.eql("test_valid_user");
    res.body[0].email.should.be.eql("test_email@valid.com");
  });

  it("Rejects non-admin usage of getUsers()", function(done) {
    agent.get("/user/all")
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });

  it("User can delete itself", async () => {
    const res = await agent.delete("/");
    res.should.have.status(200);
  });

  after(async () => {
    await User.deleteMany({ userName: /test_/ });
  });
});
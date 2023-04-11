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
      "password": "greengra55",
      "email": "light@beams.com"
    });
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("data");
    res.body.data.should.have.property("userName");
    res.body.data.should.have.property("email");
    res.body.data.userName.should.be.eql("test_valid_user");
    res.body.data.email.should.be.eql("light@beams.com");
  });

  it("Login valid user", async () => {
    const res = await agent.post("/user/login").send(
    {
      "userName": "test_valid_user",
      "password": "greengra55",
    });
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("roles");
    res.body.roles.should.be.eql(["USER"]);
    res.should.have.cookie("ar-session");
  });

  it("Grabs valid user's details", async () => {
    const res = await agent.get("/user");
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("userName");
    res.body.should.have.property("email");
    res.body.userName.should.be.eql("test_valid_user");
    res.body.email.should.be.eql("light@beam.com");
  });

  it("Rejects non-admin usage of getUsers()", async () => {
    const res = await agent.get("/user/all");
    res.should.have.status(403);
    res.body.shoud.be.a("object");
    res.body.should.have.property("message");
  })

  /*
  it("Signout non_admin_1", async () => {
    const res = await agent.post("/user/login").send(
    {
      "userName": non_admin_1.userName,
      "password": non_admin_1.password
    });
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("roles");
    res.body.roles.should.be.eql(["USER"]);
    res.session.should.have.property("token");
  });
  */

});
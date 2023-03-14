process.env.NODE_ENV = 'test';

import Tag from '../models/tags.js';
import User from '../models/users.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

const testUser = {
  userName: "test_user",
  email: "tester@testing.com",
  password: "test_pass2",
  roles: ["admin"]
}

var should = chai.should();
var expect = chai.expect();
var user_id;
var Cookies;

chai.use(chaiHttp);

describe("Users", () => {
  
  const agent = chai.request.agent(server);

  it("Adds a user", async () => {
    const res = await agent.post("/user").send(testUser);
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("data");
    res.body.data.should.have.property("userName");
    res.body.data.should.have.property("email");
    res.body.data.should.have.property("password");
    res.body.data.should.have.property("roles");
    res.body.data.userName.should.be.eql("test_user");
    res.body.data.email.should.be.eql("tester@testing.com");
  });

  it("Login test_user", async () => {
    const res = await agent.post("/user/login").send(
    {
      "userName": testUser.userName,
      "password": testUser.password
    });
    res.should.have.status(200);
    res.body.should.be.a("object");
  });
});
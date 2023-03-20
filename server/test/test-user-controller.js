process.env.NODE_ENV = 'test';

import Tag from '../models/tags.js';
import User from '../models/users.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

const non_admin_1 = {
  userName: "non_admin_1",
  email: "na1@testing.com",
  password: "ghG3hoP@e"
}

const non_admin_2 = {
  userName: "non_admin_2",
  email: "na2@testing.com",
  password: "bnhg2loP"
}

const admin = {
  userName: "admin",
  email: "admin@admin.com",
  password: "password1",
  roles: ["admin"]
};

var should = chai.should();
var expect = chai.expect();
var user_id;
var Cookies;

chai.use(chaiHttp);

describe("Users", () => {
  
  const agent = chai.request.agent(server);

  it("Adds non_admin_1", async () => {
    const res = await agent.post("/user").send(non_admin_1);
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("data");
    res.body.data.should.have.property("userName");
    res.body.data.should.have.property("email");
    res.body.data.should.have.property("password");
    res.body.data.should.have.property("roles");
    res.body.data.userName.should.be.eql("non_admin_1");
    res.body.data.email.should.be.eql("na1@testing.com");
  });

  it("Login non_admin_1", async () => {
    const res = await agent.post("/user/login").send(
    {
      "userName": non_admin_1.userName,
      "password": non_admin_1.password
    });
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("roles");
    res.body.roles.should.be.eql(["USER"]);
    res.should.have.cookie("ar-session");
  });

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
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
    user.should.not.be.eql("[]");
  });

  it("Adds an admin user with valid credentials", async () => {
    const res = await agent.post("/user").send({
      "userName": "test_admin_user",
      "password": "test_admin_pas5",
      "email": "test_admin@valid.com",
      "roles": ["admin"]
    });
    res.should.have.status(200);
    let user = await User.find({ userName: "test_admin_user" });
    user.should.not.be.eql("[]");
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
    let veruser = res.body[0];
    veruser.should.have.property("userName");
    veruser.should.have.property("email");
    veruser.userName.should.be.eql("test_valid_user");
    veruser.email.should.be.eql("test_email@valid.com");
  });

  it("Rejects non-admin usage of getUsers()", function(done) {
    agent.get("/user/all")
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });

  it("Rejects non-admin usage of deleteAnyUser()", function(done) {
    let user = User.find({ userName: "test_admin_user" });
    agent.delete("/user/" + user._id)
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });

  it("Updates valid user's email", async () => {
    const res = await agent.put("/user/email").send({
      "email": "test_updated_email@valid.com"
    });
    res.should.have.status(200);
    let user = await User.find({ userName: "test_valid_user" });
    console.log(user); // remove later
    user.email.should.be.eql("test_updated_email@valid.com");
  });

  it("Updates valid user's password", async () => {
    const res = await agent.put("/user/pass").send({
      "password": "test_updated_pas5"
    });
    res.should.have.status(200);
  });

  it("User can signout by deleting their session cookie", async () => {
    const res = await agent.post("user/cookie");
    res.should.have.status(200);
    res.should.not.have.cookie("ar-session");
  });

  it("Login admin user", async () => {
    const res = await agent.post("/user/login").send(
    {
      "userName": "test_admin_user",
      "password": "test_admin_pas5"
    });
    res.should.have.status(200);
    res.should.have.cookie("ar-session");
  });

  it("Admin user can get all users", async () => {
    const res = await agent.get("user/all");
    res.should.have.status(200);
    let user = await User.find();
    res.body.should.be.eql(user);
  });

  it("Admin user can delete any other user", async () => {
    let user = await User.find({ userName: "test_valid_user" });
    const res = await agent.delete("/user/" + user._id);
    res.should.have.status(200);
    user = await User.find({ userName: "test_valid_user" });
    user.should.be.eql("[]");
  });

  it("User can delete itself", async () => {
    const res = await agent.delete("/");
    res.should.have.status(200);
    let user = await User.find({ userName: "test_admin_user" });
    user.should.be.eql("[]");
  });

  after(async () => {
    await User.deleteMany({ userName: /test_/ });
  });
});
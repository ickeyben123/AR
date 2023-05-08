process.env.NODE_ENV = 'test';

import User from '../models/users.js';
import Tag from '../models/tags.js'
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

var should = chai.should();
var expect = chai.expect();
var user_id;
var Cookies;

chai.use(chaiHttp);

describe("Tags", () => {
  
  const agent = chai.request.agent(server);

  it("Adds a user with valid credentials", async () => {
    const res = await agent.post("/user").send(
    {
      "userName": "test_valid_user",
      "password": "test_pas5",
      "email": "test_email@valid.com"
    });
    res.should.have.status(200);
    let user = await User.findOne({ userName: "test_valid_user" });
    user.should.not.be.null;
  });

  it("Adds an admin user with valid credentials", async () => {
    const res = await agent.post("/user").send(
    {
      "userName": "test_admin_user",
      "password": "test_admin_pas5",
      "email": "test_admin@valid.com",
      "roles": ["admin"]
    });
    res.should.have.status(200);
    let user = await User.findOne({ userName: "test_admin_user" });
    user.should.not.be.null;
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

  it("Adds a tag", async () => {
    const res = await agent.post("/tag").send(
    {
      "tagName": "test_valid_tag_1",
      "coords": {
        "latitude": "50",
        "longitude": "-1",
        "elevation": "0"
      },
      "placed": "true",
      "description": "test valid tag desc 1",
      "icon": "2"
    });
    res.should.have.status(200);
    let tag = await Tag.findOne({ tagName: "test_valid_tag_1" });
    tag.should.not.be.null;
  });

  it("Adds another tag", async () => {
    const res = await agent.post("/tag").send(
    {
      "tagName": "test_valid_tag_2",
      "coords": {
        "latitude": "60",
        "longitude": "-1",
        "elevation": "0"
      },
      "placed": "true",
      "description": "test valid tag desc 2",
      "icon": "3"
    });
    res.should.have.status(200);
    let tag = await Tag.findOne({ tagName: "test_valid_tag_2" });
    tag.should.not.be.null;
  });

  it("Adds a third tag", async () => {
    const res = await agent.post("/tag").send(
    {
      "tagName": "test_valid_tag_3",
      "coords": {
        "latitude": "52.528",
        "longitude": "0.454",
        "elevation": "0"
      },
      "placed": "true",
      "description": "test valid tag desc 3",
      "icon": "1"
    });
    res.should.have.status(200);
    let tag = await Tag.findOne({ tagName: "test_valid_tag_3" });
    tag.should.not.be.null;
  });

  it("Gets user's tags", async () => {
    const res = await agent.get("/tag");
    res.should.have.status(200);
    res.body.should.not.be.eql([]);
  });

  it("Gets a specific tag", async () => {
    let tag = await Tag.findOne({ tagName: "test_valid_tag_1" });
    const res = await agent.get("/tag/" + String(tag._id));
    res.should.have.status(200);
    res.body.should.have.property("tagName");
    res.body.should.have.property("coords");
    res.body.should.have.property("placed");
    res.body.should.have.property("description");
    res.body.should.have.property("icon");
    res.body.tagName.should.be.eql("test_valid_tag_1");
    res.body.coords.should.be.eql(
    {
      "latitude": 50,
      "longitude": -1,
      "elevation": 0
    });
    res.body.placed.should.be.eql(true);
    res.body.description.should.be.eql("test valid tag desc 1");
    res.body.icon.should.be.eql(2);
  });

  it("Rejects non-admin usage of getAllTags()", function(done) {
    agent.get("/tag/admin")
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });

  it("Updates a tag", async () => {
    let tag = await Tag.findOne({ tagName: "test_valid_tag_2" });
    const res = await agent.put("/tag/" + String(tag._id)).send(
    {
      "description": "Updated for testing purposes...",
      "icon": "2"
    });
    res.should.have.status(200);
    tag = await Tag.findOne({ tagName: "test_valid_tag_2"} );
    tag.description.should.be.eql("Updated for testing purposes...");
    tag.icon.should.be.eql(2);
  });

  it("Deletes a tag", async () => {
    let tag = await Tag.findOne({ tagName: "test_valid_tag_1" });
    const res = await agent.delete("/tag/" + String(tag._id));
    res.should.have.status(200);
    tag = await Tag.findOne({ tagName: "test_valid_tag_1" });
    chai.expect(tag).to.be.null;
  });

  it("User can signout by deleting their session cookie", async () => {
    const res = await agent.post("/user/cookie");
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

  it("Admin user can get all tags", async () => {
    const res = await agent.get("/tag/admin");
    res.should.have.status(200);
    res.body.should.not.be.eql([]);
  });

  it("User's tags are deleted when they are deleted", async () => {
    let user = await User.findOne({ userName: "test_valid_user" });
    const res = await agent.delete("/user/" + String(user._id));
    res.should.have.status(200);
    let tags = await Tag.find({ owner: String(user._id) });
    tags.should.be.eql([]);
  });

  it("User's tags are deleted when they delete themselves", async () => {
    let user = await User.findOne({ userName: "test_admin_user" });
    const res = await agent.delete("/user");
    await agent.post("/user/cookie");
    res.should.have.status(200);
    let tags = await Tag.find({ owner: String(user._id) });
    tags.should.be.eql([]);
  });

  after(async () => {
    await User.deleteMany({ userName: /test_/ });
    await Tag.deleteMany({ tagName: /test_/ });
  });
});
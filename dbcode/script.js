const mongoose = require("mongoose");
const users = require("./users");
const tags = require("./tags");

mongoose.connect("mongodb://localhost/findar");

addUser();

async function addUser() {

    const newUser = await users.create({userName: "Jamie", password: "hippo34"});

    const taguser = await users.findOne({userName: "Jamie"});

    const newTag = await tags.create({
        tagName: "Car Keys",
        coords: 234,
        placed: true,
        owner: taguser._id});
}
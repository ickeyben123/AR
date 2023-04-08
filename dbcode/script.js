const mongoose = require("mongoose");
const users = require("./users");
const tags = require("./tags");

mongoose.connect("mongodb://localhost/findar");

addUser();
//only called if the database is empty to create a record in it,effectively creating a database
//creates a user with this data
async function addUser() {

    const newUser = await users.create({userName: "Jamie", password: "hippo34"});

    const taguser = await users.findOne({userName: "Jamie"});

    const newTag = await tags.create({
        tagName: "Car Keys",
        coords: 234,
        placed: true,
        owner: taguser._id});
}
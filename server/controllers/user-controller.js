import mongoose from 'mongoose'
import User from '../models/users.js'
import * as Validation from '../middleware/validation.js'

// Adds a user with specified username and password entries in body
export const addUser = async (req, res) => {
  try {
    const count = await User.find({ userName: req.body.userName }).count();
    if(count>0){
      res.status(500).json({ error: "Username already exists!" });
      return;
    }

    const user = new User({
        userName: req.body.userName,
        password: req.body.password
    });
    
    // Perform validation
    var succ = Validation.validatePassword(req.body.password);

    if(succ != ""){
      res.status(500).json({ error: succ });
      return;
    }

    // Saves data
    let newUser = await user.save();
    res.status(200).json({ data: newUser});
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Returns all users in the db
export const getUsers = async (req, res) => {
  try {
    let users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Returns the user with specified id
export const getUser = async (req, res) => {
  try {
    const id = req.params.userId;
    let user = await User.find({ _id: id });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Updates user password. Cannot edit username
export const updateUser = async (req, res) => {
  try {
    if(req.body.userName!=null){
      res.status(500).json({ error: "Cannot edit username!" });
      return;
    }
    const id = req.params.userId;
    let user = await User.findById(id);

    var data = req.body;

    // Set data
    for(var key in data) {
      if(data.hasOwnProperty(key)){
        user[key] = data[key];
      }
    }

    // Save data
    let savedUser = await user.save();
    res.status(200).json({ data: savedUser });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Deletes a user by its object id
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.userId;
    let result = await User.remove({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Logs in a user via the supplied username and password
export const loginUser = async (req,res) => {
  try{
    if(req.body.userName==null|| req.body.password==null){
      res.status(500).json({ error: "Must include userName and password entries!"});
      return;
    }

    const {userName, password} = req.body;

    User.findOne({ userName: userName}, function(err, user){
      if (err)  res.status(500).json({ error: err });

      user.comparePassword(password, function(err,isMatch){
        if (err)  res.status(500).json({ error: err });
        res.status(200).json({ data: isMatch });
      });

    });

  } catch (err) {
    res.status(500).json({ error: err });
  }
}
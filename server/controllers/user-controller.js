import mongoose from 'mongoose'
import User from '../models/users'

exports.getUsers = async (req, res) => {
  try {
    let users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addUser = async (req, res) => {
  try {
    if(User.find({ userName: req.body.username }).limit(1).size()==1){
      res.status(500).json({ error: "Username already exists!" });
      return;
    }
    const user = new User({
        userName: req.body.username,
        password: req.body.password
    });
    let newUser = await user.save();
    res.status(200).json({ data: newUser });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.userId;
    let result = await User.remove({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    if(req.body.username!=null){
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
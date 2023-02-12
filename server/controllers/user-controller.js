import mongoose from 'mongoose'
import User from '../models/users'

exports.allBlogPost = async (req, res) => {
  try {
    let users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addUser = async (req, res) => {
  try {
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
    const id = req.params.userId;
    let result = await User.findByIdAndUpdate(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};
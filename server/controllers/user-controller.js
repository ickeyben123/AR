import mongoose from 'mongoose'
import User from '../models/users.js'
import Role from '../models/roles.js'
import jwt from 'jsonwebtoken'
import jwtconfig from '../config/jwt.js'
import * as Validation from '../middleware/validation.js'

// Adds a user with specified username and password entries in body
export const addUser = async (req, res) => {
  try {
    const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });


    //See if a role is specified.
    if (req.body.roles) {
       // Get any role thats name is in bodie's role's array
      Role.find(  { name: {$in: req.body.roles} }, (err,Roles) =>{
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
 
        // Map, {{Role Name,ID}} => {ID}
        user.roles = Roles.map(role=> role._id); 
      })
    } else {
      // Add default user role
      const role = await Role.findOne({ name: "user" });
      user.roles = [role._id];
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
    const id = req.userId;
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
      res.status(400).json({ error: "Cannot edit username!" });
      return;
    }
    const id = req.userId;
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
    const id = req.body.userId;
    
    // remove() is deprecated ...
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
      res.status(400).json({ error: "Must include userName and password entries!"});
      return;
    }

    const {userName, password} = req.body;

    // Populate the roles, meaning replace them with the actual representation.
    User.findOne({ userName: userName}).populate("roles").exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      
      user.comparePassword(password, function(err,isMatch){
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!isMatch) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }

        var token = jwt.sign({ id: user.id }, jwtconfig.secret, {
          expiresIn: 86400 // 24 hours
        });

        var roles = [];
        for (let i = 0; i < user.roles.length; i++) {
          roles.push(user.roles[i].name.toUpperCase());
        }

        req.session.token = token;
        
        res.status(200).send({
          id: user._id,
          username: user.userName,
          email: user.email,
          roles: roles,
        });
      });

    });

  } catch (err) {
    res.status(500).json({ error: err });
  }
}

export const signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
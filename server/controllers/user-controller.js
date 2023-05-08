import mongoose from 'mongoose'
import User from '../models/users.js'
import Tag from '../models/tags.js'
import Role from '../models/roles.js'
import jwt from 'jsonwebtoken'
import jwtconfig from '../config/jwt.js'

/**
 * @typedef {Express.Request} req
 * @typedef {Express.Response} res
*/

/**
 * Adds a user with specified username and password entries in body of the request
 * 
 * @param {req} req request contains the body with JSON data for the creation of the user
 * @param {res} res server responds with the users details
 */
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
      // Add default user roleloggedIn
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

/**
 *  Returns all users in the database
 * 
 * @param {req} req a GET request is made by the user
 * @param {res} res responds with JSON data about all of the users in database
 */
export const getUsers = async (req, res) => {
  try {
    let users = await User.find().populate("roles");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * 
 * Returns the user with specified id
 * 
 * @param {req} req specifies the user ID 
 * @param {res} res returns the JSON data of the user
 */
export const getUser = async (req, res) => {
  try {
    const id = req.userId;
    let user = await User.find({ _id: id }).populate("roles");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * Updates user email in the database,cannot edit username
 * @param {request} req sends the JSON data of the new email string
 * @param {response} res returns a JSON data of the user
 */
export const updateEmail = async (req, res) => {
  try {
    const id = req.userId;
    let user = await User.findById(id);

    //data in body
    var data = req.body;

    // Set data
    user['email'] = data['email'];
    // Save data
    let savedUser = await user.save();
    res.status(200).json({ data: savedUser });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};



/**
 * Updates user password in the database of the user with supplied ID
 * @param {request} req contains the new password
 * @param {response} res returns the JSON data of the user
 */
export const updatePassword = async (req, res) => {
  try {
    const id = req.userId;
    let user = await User.findById(id);

    var data = req.body;

    // Set data
    user['password'] = data['password'];

    // Save data
    let savedUser = await user.save();
    res.status(200).json({ data: savedUser });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/**
 * Deletes any user by its object id,used by admin
 * 
 * @param {req} req supplied the ID of the user to be deleted
 * @param {res} res returns the result of the deletion of the user in mongoDB
 */
export const deleteAnyUser = async (req, res) => {
  try {
    const id = req.params.userId;
    
    //remove all the tags associated with the user first
    let result = await Tag.deleteMany({
      owner: id 
    });

    // deletes the user with this ID
    result = await User.deleteOne({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * deletes the user account that called this i.e. user deletes itself,not other users
 * @param {req} req sends the ID of the user who called this method
 * @param {res} res returns the result of the deletion of the user in mongoDB
 */
export const deleteUser = async (req, res) => {
  try {
    const id = req.userId;

    //remove all the tags associated with the user first
    let result = await Tag.deleteMany({
      owner: id 
    });

    
    // removes the user with this ID
    result = await User.deleteOne({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};


/**
 * Logs in a user via the supplied username and password
 * @param {req} req supplies the data required for the user to be logged in such as their username and password
 * @param {res} res returns the JSON data associated with the user
 */
export const loginUser = async (req,res) => {
  try{
    //check that the user has put data into the text fields for username and password
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
      //first make sure user exists
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      //make syre tge password meets password requirements
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
        //create a token for the user so they dont have to relogin if they e.g. refresh the page
        var token = jwt.sign({ id: user.id }, jwtconfig.secret, {
          expiresIn: 86400 // token lasts for 24 hours
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

/**
 * deletes the cookies associated with the user to sign them out
 * @param {req} req request contains the 2 cookies associated with the user
 * @param {res} res returns the status saying that the user is signed out
 */
export const deleteCookie = async (req,res) => {
  try{
    const id = req.userId;
    let user = await User.findById(id);
    // Remove push notifications
    user['vapidSubscription'] = null;
    user.save();


    res
      .clearCookie("ar-session")
      .clearCookie("ar-session.sig");
      return res.status(200).send({ message: "You've been signed out!" });
  } catch(err){
    res.status(500).json({ error: err });
  }
};

// Sends back the public VAPID key to be used for push notifications
export const getVAPID = async (req,res) => {
  res.send(process.env.VAPID_PUBLIC_KEY);
}

// Saves the endpoint to send push notifications to for users.
export const saveVAPIDSubscription = async (req,res) => {
  try {
    const id = req.userId;
    let user = await User.findById(id);

    var data = req.body;

    // Set data
    user['vapidSubscription'] = data['vapidSubscription'];
    // Save data
    let savedUser = await user.save();
    res.status(200).json({ data: savedUser });
  } catch (err) {
    res.status(500).json({ error: err });
  }

}
/**
 * deletes the cookies associated with the user to sign them out
 * @param {req} req request contains no information
 * @param {res} res returns the status saying they are logged in or not in form {loggedIn : bool}
 */
export const loggedIn = async (req,res) => {
  try{
    var logged = false;

    let token = req.session.token;
  
    //check token exists
    if (token) {
      jwt.verify(token, jwtconfig.secret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "Unauthorized!" });
        }
        logged=true;
      })
    }
    
    res.status(200).json({ loggedIn: logged });
  } catch(err){
    res.status(500).json({ error: err });
  }
};



const ROLES = ["user", "admin"];
import User from '../models/users.js'

export function validatePassword(req, res, next) {

    var p = req.body.password || "";
    var errors = [];
    if (p.length < 8) {
        errors.push("Your password must be at least 8 characters"); 
    }
    if (!(/[a-z]/i).test(p)) {
        errors.push("Your password must contain at least one letter.");
    }
    if (!(/[0-9]/).test(p)) {
        errors.push("Your password must contain at least one digit."); 
    }
    if (errors.length > 0) {
        return errors.join("\n");
    }
    next();
}

export function checkDuplicateUsernameOrEmail(req, res, next) {
    // Username
    User.findOne({
      username: req.body.userName
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (user) {
        res.status(400).send({ message: "Username is already in use!" });
        return;
      }
  
      // Email
      User.findOne({
        email: req.body.email
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        if (user) {
          res.status(400).send({ message: "Email is already in use!" });
          return;
        }
  
        next();
      });
    });
  };

export function checkRolesExists (req, res, next) {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(400).send({
            message: `Failed! Role ${req.body.roles[i]} does not exist!`
          });
          return;
        }
      }
    }
}
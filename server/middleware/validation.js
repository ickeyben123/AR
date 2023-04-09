const ROLES = ["user", "admin"];
import User from '../models/users.js'

/**
 * @typedef {Express.Request} req
 * @typedef {Express.Response} res
 * @typedef {Express.next} next
*/


/**
 * Validate that the password is correct: it is at least 8 characters,contains at least one letter and one digit
 * 
 * @param {req} req request contains the password
 * @param {res} res response contains an error code,otherwise it continues onto next
 * @param {next} next if everything succeds then next will point to the next function to be called after middleware is done
 */
export function validatePassword(req, res, next) {
  try{
    var p = req.body.password;
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
      res.status(500).json({ error: errors.join("\n") });
      return;
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Password in Body not set!" });
    return;
  }
}

/**
 * Makes sure there are no duplicate usernames in the database
 * 
 * @param {req} req request contains the username
 * @param {res} res response contains an error code,otherwise it continues onto next
 * @param {next} next if everything succeds then next will point to the next function to be called after middleware is done
 */
export function checkDuplicateUsername(req, res, next) {
  try{
    //try to find the user in the databse that has the same username
    User.findOne({
      userName: req.body.userName
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      //return error code if there is a user with the same username
      if (user) {
        res.status(400).send({ message: "Username is already in use!" });
        return;
      }
      next();
    });
    } catch (err) {
      res.status(500).json({ error: err });
      return;
   }
};


/**
 * Check that there is no user in the database that has the same email address
 * 
 * @param {req} req request contains the email address
 * @param {res} res response contains an error code,otherwise it continues onto next
 * @param {next} next if everything succeds then next will point to the next function to be called after middleware is done
 */
export function checkDuplicateEmail(req, res, next) {
  try{
        //try to find a user with the same email in the database
        User.findOne({
        email: req.body.email
      }).exec((err, email) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        //return an error code if there is a user with the same email
        if (email) {
          res.status(400).send({ message: "Email is already in use!" });
          return;
        }
        next();
  });
    } catch (err) {
      res.status(500).json({ error: err });
      return;
    }
};



/**
 * Check that the roles a user enters are valid and exist as options in our Roles array in the database
 * 
 * @param {req} req request contains the roles list of the user
 * @param {res} res response contains an error code,otherwise it continues onto next
 * @param {next} next if everything succeds then next will point to the next function to be called after middleware is done
 */
export function checkRolesExists (req, res, next) {
    //first check if the user has roles
    if (req.body.roles) {
      //go through each one of the roles the user has and check if these actually exist
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(400).send({
            //send an error code if the role doesn't exist
            message: `Failed! Role ${req.body.roles[i]} does not exist!`
          });
          return;
        }
      }
    }
}

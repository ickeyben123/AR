import User from '../models/users.js'
import Role from '../models/roles.js'
import jwt from 'jsonwebtoken'
import config from '../config/jwt.js'

/**
 * @typedef {Express.Request} req
 * @typedef {Express.Response} res
 * @typedef {Express.next} next
*/

// Should run as a middleware function in .get routes.
// Moreso: router.get("/", tagController.getTags); -> router.get("/", [verifyToken], tagController.getTags);
// The new function would require a token to be in the header, and from this it would set the userID in the req
// body to the user's userid, for the next functions to use.


/**
 * Veridies the user token so that we know the user is logged in and can talk to the backend. This is for functions that require the user ID
 * 
 * @param {req} req request contains the token
 * @param {res} res response contains an error code,otherwise it continues onto next
 * @param {next} next if everything succeds then next will point to the next function to be called after middleware is done
 */
export function verifyToken(req, res, next) {
    let token = req.session.token;
  
    //check token exists
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
    //verify the token
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
  };

// Same requirement as the verifyToken function. Will be called before the main function and if it fails will stop 
// the main function from calling.


/**
 * Verify that the current user has an Admin role
 * @param {req} req supplies the user ID
 * @param {res} res response contains an error code,otherwise it continues onto next
 * @param {next} next if everything succeds then next will point to the next function to be called after middleware is done
 */
export function isAdmin(req, res, next) {
    //find the user in database
    User.findById(req.userId).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      //find the role associated with the user  
      Role.find({_id: { $in: user.roles }},(err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          //go through all the roles of the user and check if they have an admin role
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
              next();
              return;
            }
          }
          //return an error if they user has no admin role
          res.status(403).send({ message: "Requires Admin!" });
          return;
        }
      );
    });
  };
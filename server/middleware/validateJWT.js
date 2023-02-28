import User from '../models/users.js'
import Role from '../models/roles.js'
import jwt from 'jsonwebtoken'
import config from '../config/jwt.js'

// Should run as a middleware function in .get routes.
// Moreso: router.get("/", tagController.getTags); -> router.get("/", [verifyToken], tagController.getTags);
// The new function would require a token to be in the header, and from this it would set the userID in the req
// body to the user's userid, for the next functions to use.

export function verifyToken(req, res, next) {
    let token = req.session.token;
  
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
  
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
export function isAdmin(req, res, next) {
    User.findById(req.userId).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      Role.find({_id: { $in: user.roles }},(err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
  
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
              next();
              return;
            }
          }
  
          res.status(403).send({ message: "Requires Admin!" });
          return;
        }
      );
    });
  };
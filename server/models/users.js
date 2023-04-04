import mongoose from 'mongoose';
import bcrypt  from 'bcryptjs';
var SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    vapidSubscription: {
        type: Object
    },

    password: {
        type: String,
        required: true
    },

    // array of roles
    roles : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Role" // It references a Role object
    }]
});

     
userSchema.pre('save', function(next) {
    var user = this;
    
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
// Compares a password with the hash
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
     
var User = mongoose.model("User", userSchema);

export default User;


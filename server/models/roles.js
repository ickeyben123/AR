import mongoose from 'mongoose';

// just a file with name 
const roleSchema = new mongoose.Schema({
    name: String
});


var Role = mongoose.model("Role", roleSchema);

export default Role;

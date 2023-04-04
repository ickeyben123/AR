//const mongoose = require("mongoose");
import mongoose from 'mongoose';


const tagSchema = new mongoose.Schema({

    required :["coords"],
    tagName: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    icon: {
        type: Number,
    },
    coords: {
         latitude: "number",
         longitude: "number",
         elevation: "number",
    },

    placed: {
        type: Boolean,
        required: true
    },
    
    dateModified: {
        type: Date
    },
    notified: {
        type: Boolean
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    }
});

var Tag = mongoose.model("Tag", tagSchema);

export default Tag;

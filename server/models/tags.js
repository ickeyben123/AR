//const mongoose = require("mongoose");
import mongoose from 'mongoose';


const tagSchema = new mongoose.Schema({

    tagName: {
        type: String,
        required: true
    },

    coords: {
         latitude: "number",
         longitude: "number",
         elevation: "number"
    },

    placed: {
        type: Boolean,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    }
});

var Tag = mongoose.model("Tag", tagSchema);

export default Tag;

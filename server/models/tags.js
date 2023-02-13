const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({

    tagName: {
        type: String,
        required: true
    },

    coords: {
        type: Number,
        required: true
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
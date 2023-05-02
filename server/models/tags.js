import mongoose from 'mongoose';


const tagSchema = new mongoose.Schema({

    required :["coords"], //coordinates are required
    tagName: {
        type: String,
        required: true
    },
    description: { //describe what the tag is
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

    placed: { //tag can either be in a placed down state or picked up
        type: Boolean,
        required: true
    },
    
    dateModified: {
        type: Date
    },
    notified: {
        type: Boolean
    },

    owner: {//specifies the objecId of the user that owns this tag
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    }
});

var Tag = mongoose.model("Tag", tagSchema);

export default Tag;

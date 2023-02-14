import mongoose from 'mongoose'
import Tag from '../models/tags.js'
import User from '../models/users.js'

export const getTags = async(req,res) => {
    try {
        let tags = await Tag.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
};


// add a tag => need to first verify the user

export const addTag = async (req,res) => {
    try{
        //see if user exists first
        const count = await User.find({ userName: req.body.userName }).count();
        if(count==0){
        res.status(500).json({ error: "No user for this tag!" });
        return;
        }

        const tag = new Tag({
            tagName: req.body.tag,
            coords: req.body.coords,
            placed: req.body.placed,
            owner: req.body.owner
        });

        let newTag = await tag.save();
        res.status(200).json({data: newTag});
    } catch (err) {
        res.status(500).json({ error: err });
    }
}



//delete a tag => verify user

export const deleteTag = async (req, res) => {
    try {
        //check user exists first

        //duplicated code, make this a separate function
        const count = await User.find({ userName: req.body.userName }).count();
        if(count==0){
            res.status(500).json({ error: "No user for this tag!" });
            return;
        }

        //not sure if this will work
        const id = req.params.tagId;
        let result = await Tag.remove({ _id: id });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};




// modify tag

export const updateTag = async (req, res) => {
    try {
        //duplicated code, make this a separate function
        const user = await User.find({ userName: req.body.userName });
        if(user==null){
            res.status(500).json({ error: "No user for this tag!" });
            return;
        }
        const id = req.params.tagId;
        let tag = await Tag.findById(id);


        var data = req.body;
        

        //not sure how to get the tag here,cant just make a new tag



        // Set data
        for(var key in data) {
            if(data.hasOwnProperty(key)){
            tag[key] = data[key];
            }
        }
    
        // Save data
        let savedTag = await tag.save();
        res.status(200).json({ data: savedTag });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

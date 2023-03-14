import mongoose from 'mongoose'
import Tag from '../models/tags.js'
import User from '../models/users.js'

export const getTags = async(req,res) => {
    try {
        //get the user from the request as the user is already verified
        const id = req.userId;

        //get the tags associated with the user
        let tags = await Tag.find({
            owner: id
        });


        res.status(200).json(tags);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getTag = async(req,res) => {
    try {
        //get the user from the request as the user is already verified
        const id = req.userId;
        const tag_id = req.params.tagId;


        //get the tags associated with the user
        let tag = await Tag.findOne(
            {_id: tag_id, owner: id}
        );

        res.status(200).json(tag);
    } catch (err) {
        res.status(500).json(err);
    }
};

// add a tag => need to first verify the user

export const addTag = async (req,res) => {
    try{
        //get the user from the request as the user is already verified
        const id = req.userId;

        const tag = new Tag({
            tagName: req.body.tagName,
            coords: req.body.coords,
            placed: req.body.placed,
            description: req.body.description,
            icon: req.body.icon,
            owner: id
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
         //get the user from the request as the user is already verified
        const user_id = req.userId;
         //get tag id to delete
        const tag_id = req.params.tagId;

        let result = await Tag.deleteOne(
            {_id: tag_id, owner: id}
        );
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};




// modify tag

export const updateTag = async (req, res) => {
    try {

        //get the user from the request as the user is already verified
        const user_id = req.userId;
        //get tag id to delete
        const tag_id = req.params.tagId;
        let tag = await Tag.findById(tag_id);

        if(tag.owner !=user_id){
            res.status(403).json({ error: "You don't own this tag!" })
            return;
        }

        var data = req.body;



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



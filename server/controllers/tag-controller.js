import mongoose from 'mongoose'
import Tag from '../models/tags.js'
import User from '../models/users.js'


/**
 * @typedef {Express.Request} req
 * @typedef {Express.Response} res
*/


/**
 * Get all the tags associated with this user
 * 
 * @param {req} req request contains the userID of the user
 * @param {res} res server responds with the tag JSON data associated with this user
 */
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

/**
 * Gets all the tags taht exist in the database
 * @param {req} req request specifies a GET request to the server
 * @param {res} res returns JSON data of all the tags in the database
 */
export const getAllTags = async(req,res) => {
    try {

        //get all the tags in the database
        let tags = await Tag.find();

        res.status(200).json(tags);
    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * Get a specific tag associated with this user
 * @param {req} req request contains the user and tag IDs
 * @param {res} res returns JSON data associated with this specific tag
 */
export const getTag = async(req,res) => {
    try {
        //get the user from the request as the user is already verified
        const id = req.userId;
        const tag_id = req.params.tagId;


        //get the tag associated with the user with this tag ID
        let tag = await Tag.findOne(
            {_id: tag_id, owner: id}
        );

        res.status(200).json(tag);
    } catch (err) {
        res.status(500).json(err);
    }
};


/**
 * add a new tag for this user
 * @param {req} req contains the user ID
 * @param {res} res returns the JSON data of this new tag
 */
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



/**
 * delete a specific tag associated with this user
 * @param {req} req contains the user and tag IDs
 * @param {res} res returns the status of the result as JSON response
 */
export const deleteTag = async (req, res) => {
    try {
         //get the user from the request as the user is already verified
        const user_id = req.userId;
         //get tag id to delete
        const tag_id = req.params.tagId;

        let result = await Tag.deleteOne(
            {_id: tag_id, owner: user_id}
        );
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};




/**
 * Updates the data of a specific tag
 * @param {req} req contains the data associated with the tag including its ID
 * @param {res} res returns the JSON data associated with this tag after it is modified
 */
export const updateTag = async (req, res) => {
    try {

        //get the user from the request as the user is already verified
        const user_id = req.userId;
        //get tag id to delete
        const tag_id = req.params.tagId;
        let tag = await Tag.findById(tag_id);
        //check that the user owns this tag
        if(tag.owner !=user_id){
            res.status(403).json({ error: "You don't own this tag!" })
            return;
        }

        var data = req.body;



        // Set data to modify the tag
        for(var key in data) {
            if(data.hasOwnProperty(key) && key!="_id"){
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



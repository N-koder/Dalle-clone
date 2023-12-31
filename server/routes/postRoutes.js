import express from 'express';
import * as dotenv from 'dotenv';

import {v2 as cloudinary} from 'cloudinary';
import PostSchema from '../mongodb/models/post.js';

dotenv.config();

const router  = express.Router();

cloudinary.config({
	cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
	api_key : process.env.CLOUDINARY_API_KEY,
	api_secret : process.env.CLOUDINARY_SECRET_KEY
});

// Get all post 
router.route('/').get(async(req,res) => {
	try{
		const posts = await PostSchema.find({});
		res.status(200).json({success : true , data :posts});
	}
	catch(error){
		res.status(500).json({success : false , message : error});
	}
});

// create all post 

router.route('/').post(async(req, res) => {

	try {
		const {name , prompt , photo} = req.body;

		const PhotoUrl = await cloudinary.uploader.upload(photo);

		const newPost = await PostSchema.create({
			name ,
			prompt,
			photo : PhotoUrl.url
		});

		res.status(201).json({success : true , data : newPost});
	}

	catch(error) {
		res.status(500).json({success:false , message : error});
	}
}) 

export default router;
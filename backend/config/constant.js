const DECISIONS = {
	ACCEPTED: 'ACCEPTED',
	REJECTED: 'REJECTED',
	PENDING: 'PENDING',
};
module.exports = { DECISIONS };

// const express = require('express');
// const router = express.Router();

// const { Post } = require('./models/schema');
// const multer = require('multer');
// const path = require('path');
// //set storage engine
// const storage = multer.diskStorage({
// 	destination: '../uploads/',
// 	filename: function (req, file, cb) {
// 		cb(
// 			null,
// 			file.fieldname + '-' + Date.now() + path.extname(file.originalname)
// 		);
// 	},
// });

// //check file type
// const fileFilter = (req, file, cb) => {
// 	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
// 		cb(null, true);
// 	} else {
// 		cb(new Error('file type must be jpeg or png'), false);
// 	}
// };

// //init upload
// const upload = multer({
// 	storage: storage,
// 	limits: { fileSize: 1024 * 1024 * 5 },
// 	fileFilter: fileFilter,
// });

// router.post('/', verify, upload.any(), (req, res) => {
// 	console.log(req.body);
// 	console.log(req.files);

// 	req.body.image = process.env.IMAGE_URL + req.files[0].path;

// 	const posts = new Post(
// 		req.body
// 		//       {
// 		//     title: req.body.title,
// 		//     description: req.body.description,
// 		//     category: req.body.category,
// 		//     keySpecs: req.body.keySpecs,
// 		//     priceBefore: req.body.priceBefore,
// 		//     priceAfter: req.body.priceAfter,
// 		//   }
// 	);

// 	posts
// 		.save()
// 		.then((data) => {
// 			res.json(data);
// 		})
// 		.catch((err) => {
// 			res.json(err);
// 		});
// });

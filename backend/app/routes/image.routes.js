const express = require('express');

const imagesController = require('../controllers/image.controller');

const storage = require('../middlewares/storage');

const router = express.Router();

router.get('/', imagesController.getImages);

router.post('/:userId', storage, imagesController.postImage);

router.post('/project/:projectId',storage, imagesController.postImageProject)

router.put('/:imageId/:userId' , storage , imagesController.updateImage)

module.exports = router;
const db = require("../models");
const Project = require("../models/project.model");
const Image = db.image
const User = db.user

exports.getImages = async (req, res) => {
    const images = await Image.find();
    res.status(200).json({ images });
  };
  
  exports.postImage = async (req, res) => {
    const { userId } = req.params
    const { name } = req.body;
    const imagePath = 'http://localhost:8080/images/' + req.file.filename; // Note: set path dynamically

    const user = await User.findById(userId)
    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }
    const image = new Image({
      name,
      imagePath,
      user : user._id
    });
    const createdImage = await image.save();
    user.image = createdImage._id
    await user.save()
    res.status(201).json({
      image: {
        ...createdImage._doc,
      },
    });
  };

  exports.updateImage = async(req,res) => {
    const {imageId} = req.params
    const {userId} = req.params
    const { name } = req.body;
    const imagePath = 'http://localhost:8080/images/' + req.file.filename; // Note: set path dynamically
    
    const user = await User.findById(userId)
    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }
    try {
      
      const updatedImage = await Image.findByIdAndUpdate(imageId,{
        name,
        imagePath,
        user : user._id
      });
      user.image = updatedImage._id
      await user.save()
      res.status(200).json(updatedImage);

    } catch (error) {
      res.status(400).json({message: error.message});
  }
  }


  exports.postImageProject = async (req, res) => {
    const { projectId } = req.params
    const { name } = req.body;
    const imagePath = 'http://localhost:8080/images/' + req.file.filename; // Note: set path dynamically

    const project = await Project.findById(projectId)
    if(!project){
        return res.status(404).json({ message: 'Project not found' });
    }
    const image = new Image({
      name,
      imagePath,
      project : project._id
    });
    const createdImage = await image.save();
    project.image = createdImage._id
    await project.save()
    res.status(201).json({
      image: {
        ...createdImage._doc,
      },
    });
  };
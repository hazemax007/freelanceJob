const db = require('../models');
const mongoose = require('mongoose');

const Rating = db.rating
const User = db.user
const Project = db.project

exports.addRating = async (req,res) => {
  try {
    const { intercontratId, userId } = req.params;
    const { value } = req.body;

    // Check if the user and product exist
    const user = await User.findById(userId);
    const intercontrat = await User.findById(intercontratId);

    if (!user || !intercontrat) {
      return res.status(404).json({ error: 'User or project not found' });
    }

    const rating = new Rating({value , user: user._id, intercontrat: intercontrat._id});
    await rating.save();
    intercontrat.ratings.push(rating)
    await intercontrat.save()

    res.status(201).json(rating);
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ error: 'Failed to create rating' });
  }
}

exports.getRating = async (req,res) =>{
  try {
    const intercontratId = req.params;

    const ratings = await Rating.find({ intercontrat: intercontratId })
    .populate('intercontratId');

    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error retrieving ratings:', error);
    res.status(500).json({ error: 'Failed to retrieve ratings' });
  }
}

exports.averageRating = async (req,res) => {
  try {
    const { intercontratId } = req.params;

    const pipeline = [
      {
        $match: { intercontrat: mongoose.Types.ObjectId(intercontratId) }
      },
      {
        $group: {
          _id: '$intercontrat',
          averageRating: { $avg: '$value' }
        }
      }
    ];

    const averageRatings = await Rating.aggregate(pipeline);

    res.status(200).json(averageRatings);
  } catch (error) {
    console.error('Error retrieving average ratings:', error);
    res.status(500).json({ error: 'Failed to retrieve average ratings' });
  }
}

exports.getAllRatings = async (req,res) => {
  try {
    const ratings = await Rating.find().populate('project'); // populate the 'user' field with user data and exclude the password field
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}
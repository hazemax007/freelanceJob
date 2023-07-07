const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    birthdate: Date,
    phonenumber: String,
    address: String,
    googleId:String,
    displayName:String,
    intercontrat: {
      type: Boolean,
      default: false
    },
    token:{
      type:String,
      default:''
    },
    status: {
      type: String, 
      enum: ['Pending', 'Active'],
      default: 'Pending'
    },
    confirmationCode: { 
      type: String, 
      unique: true },
    applications: [
      {
        type: mongoose.Types.ObjectId,
        ref : "application"
      }
    ],
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "message"
      }
    ],
    resumes: [
      {
        type: mongoose.Types.ObjectId,
        ref : "resume"
      }
    ],
    projects: [
      {
        type: mongoose.Types.ObjectId,
        ref: "project"
      }
    ],
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    ratings:[
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'rating'
    }
  ],
    image:{
      type:mongoose.Types.ObjectId,
      ref:"image" 
    },
  })
);

module.exports = User;
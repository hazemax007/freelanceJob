const mongoose = require("mongoose");

    const Resume = mongoose.model(
      "resume",
      new mongoose.Schema(
        {
            category: String,
            email: [String],
            mobile_no: String,
            name: String,
            description:String,
            skills: [String],
            user: {
              type:mongoose.Types.ObjectId,
              ref:"User" 
            },
            project: {
              type:mongoose.Types.ObjectId,
              ref: "project"
            }
        },
        { timestamps: true }
      )
    );
  
  module.exports = Resume
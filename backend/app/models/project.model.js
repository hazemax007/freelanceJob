const mongoose = require("mongoose");

    const Project = mongoose.model(
      "project",
      new mongoose.Schema(
        {
          title: String,
          description: String,
          field: String,
          technology: String,
          requirments: String,
          duration:Number,
          experience: Number,
          salary: Number,
          gender:String,
          publishedOn:Date,
          deadline:Date,
          user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User" 
          },
          applications: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "application"
            }
          ],
          resumes:[
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "resume"
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
        },
        { timestamps: true }
      )
    );
  
  module.exports = Project
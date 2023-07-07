const mongoose = require("mongoose");

    const Application = mongoose.model(
      "application",
      new mongoose.Schema(
        {
          name: String,
          startDate:Date,
          description: String,
          resume: {
            contentType: String,
            data: Buffer
          },
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
  
  module.exports = Application
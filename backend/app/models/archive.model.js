const mongoose = require("mongoose");

    const Archive = mongoose.model(
      "archive",
      new mongoose.Schema(
        {
          remarque: String,
          project: {
            type:mongoose.Types.ObjectId,
            ref: "project"
          }
        },
        { timestamps: true }
      )
    );
  
  module.exports = Archive
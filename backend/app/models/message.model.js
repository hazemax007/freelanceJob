const mongoose = require("mongoose");

    const Message = mongoose.model(
      "message",
      new mongoose.Schema(
        {
          content:String,
          messageType:String,
          sender:{
            type: mongoose.Schema.Types.ObjectId,
              ref: "User"
          },
          receiver:{
            type: mongoose.Schema.Types.ObjectId,
              ref: "User"
          },
        },
        { timestamps: true }
      )
    );
  
  module.exports = Message
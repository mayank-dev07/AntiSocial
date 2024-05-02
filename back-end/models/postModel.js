import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
    },
    img: {
      type: String,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        text: {
          type: String,
          maxLength: 100,
          required: true,
        },
        profilepic: {
          type: String,
          required: true,
        },
        username: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);

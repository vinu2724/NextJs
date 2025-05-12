import mongoose from "mongoose";
import { type } from "os";

const sampledatas = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please provide username"],
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    unique: true,
  },
});

const sampledata =
  mongoose.models.sampledatas || mongoose.model("sampledatas", sampledatas);

export default sampledata;

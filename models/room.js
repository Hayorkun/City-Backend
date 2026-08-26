import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    unique: true,
    required: true,
  },
  roomNumber: {
    type: Number,
    unique: true,
    required: true,
  },
  roomType: {
    type: String,
    enum: ["standard", "deluxe", "presidential suite"],
    default: "standard",
  },
  status: {
    type: String,
    enum: ["available", "occupied", "maintenance", "inative"],
    default: "available",
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  capacity: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String],
  },
  images: {
    type: [String],
    required: true,
  },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;

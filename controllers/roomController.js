import Room from "../models/room.js";

export const createRoom = async (req, res, next) => {
  const { roomName, roomType, roomNumber, capacity, status, price, images, description, amenities } =
    req.body;

  try {
    if (
      !roomName ||
      !roomNumber ||
      !roomType ||
      !price ||
      !capacity ||
      !images
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Room name, type, number, price, images and capacity required",
      });
    }

    const roomExist = await Room.findOne({ roomNumber });

    if (roomExist) {
      return res.status(409).json({
        success: false,
        message: "Room number already exists"
      })
    }

    const room = await Room.create({
      roomName,
      roomNumber,
      roomType,
      description,
      price,
      capacity,
      status,
      images,
      amenities
    })

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room
    })
  } catch (error){
    next(error)
  }
};

import Room from "../models/room.js";

export const createRoom = async (req, res, next) => {
  const {
    roomName,
    roomType,
    roomNumber,
    capacity,
    status,
    price,
    images,
    description,
    amenities,
  } = req.body;

  try {
    if (!roomName || !roomNumber || !price || !capacity || !images) {
      return res.status(400).json({
        success: false,
        message: "Room name, number, price, images and capacity required",
      });
    }

    const roomExist = await Room.findOne({ roomNumber });

    if (roomExist) {
      return res.status(409).json({
        success: false,
        message: "Room number already exists",
      });
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
      amenities,
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableRooms = async (req, res, next) => {
  try {
    const availableRooms = await Room.find({ status: "available" });

    return res.status(200).json({
      success: true,
      message: "Rooms fetched",
      data: availableRooms,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRoomsForAdmin = async (req, res, next) => {
  try {
    const allRooms = await Room.find();

    return res.status(200).json({
      success: true,
      message: "Rooms fetched successfully",
      data: allRooms,
    });
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const getRoom = await Room.findById(id);

    if (!getRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room data fetched successfully",
      data: getRoom,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  const { id } = req.params;
  const {
    roomNumber,
    roomName,
    roomType,
    price,
    status,
    capacity,
    description,
    images,
    amenities,
  } = req.body;
  try {
    const updateData = {};

    if (roomName !== undefined) {
      updateData.roomName = roomName;
    }
    if (roomNumber !== undefined) {
      updateData.roomNumber = roomNumber;
    }
    if (roomType !== undefined) {
      updateData.roomType = roomType;
    }
    if (price !== undefined) {
      updateData.price = price;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (capacity !== undefined) {
      updateData.capacity = capacity;
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (amenities !== undefined) {
      updateData.amenities = amenities;
    }
    if (images !== undefined) {
      updateData.images = images;
    }

    if (roomNumber !== undefined) {
      const numberExist = await Room.findOne({
        roomNumber: roomNumber,
        _id: { $ne: id },
      });

      if (numberExist) {
        return res.status(409).json({
          success: false,
          message: "Room already exist",
        });
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No field provided for update",
      });
    }

    const roomExist = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!roomExist) {
      return res.status(404).json({
        success: false,
        message: "Room does not exists",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: roomExist,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  const { id } = req.params;
  try {
    const findRoom = await Room.findByIdAndUpdate(
      id,
      { status: "inactive" },
      { new: true },
    );

    if (!findRoom) {
      return res.status(404).json({
        success: false,
        message: "Room does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room deactivated successfully",
      data: findRoom,
    });
  } catch (error) {
    next(error);
  }
};

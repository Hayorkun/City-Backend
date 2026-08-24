import jwt from "jsonwebtoken";

export const generateToken = (userId, tokenVersion) => {
  return jwt.sign({ id: userId, tokenVersion }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

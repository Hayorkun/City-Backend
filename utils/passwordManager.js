import bcrypt from "bcrypt";

const saltRound = 12;

export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
  } catch (error) {
    console.log("Error hashing password");
    throw new Error("Error hashing password", { cause: error });
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    const isCorrect = await bcrypt.compare(password, hashedPassword);
    return isCorrect;
  } catch (error) {
    console.log("Error comparing password");
    throw new Error("Error comparing password", { cause: error });
  }
};

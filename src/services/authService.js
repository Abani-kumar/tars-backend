import User from "../models/user.js";
import bcrypt from "bcrypt";

export const createUser = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("Please fill all the fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = new User({
    name,
    email,
    password,
  });

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

export const validateUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Please fill all the fields");
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

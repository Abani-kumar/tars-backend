import { createUser, validateUser } from "../services/authService.js";
import { jwtUtils } from "../utils/jwtUtils.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Please fill all the fields" });
    }
    const user = await createUser(name, email, password);
    const token = jwtUtils.generateToken(user.email, user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res
      .status(201)
      .json({ success: true, message: "User created successfully", user,token });
  } catch (error) {
    console.error(error);
    return res
      .status(error.message.includes("User already exists") ? 409 : 500)
      .json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Please fill all the fields" });
    }
    const user = await validateUser(email, password);
    const token = jwtUtils.generateToken(user.email, user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "User logged in successfully",user,token });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, error: error.message });
  }
};

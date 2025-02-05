import { jwtUtils } from "../utils/jwtUtils.js";

export const auth = async (req, res, next) => {
  const token = req.cookies.jwt || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  const decode = await jwtUtils.verifyToken(token);
  req.user = { _id: decode.userId, email: decode.email };
  next();
};

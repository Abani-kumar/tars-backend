import jwt from "jsonwebtoken";

const generateToken = (email, userId) => {
  const token = jwt.sign({ email, userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
  return token;
};

const verifyToken = async (token) => {
  try {
    const decoded = jwt.decode(token);
    const expirationTime = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > expirationTime) {
      throw new Error("Token has expired");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decode;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to verify token");
  }
};

export const jwtUtils = { generateToken, verifyToken };


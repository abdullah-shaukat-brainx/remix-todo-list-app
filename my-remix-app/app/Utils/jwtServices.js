import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
};

export const fetchUserFromToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.log("Illegal Token : Logging out User!");
  }
};

import JWT from "jsonwebtoken";
import { ACCESSTOKEN, REFRESHTOKEN } from "../secret.js";

if (!ACCESSTOKEN || !REFRESHTOKEN) {
  throw new Error("JWT secrets are not defined in environment variables");
}

const signToken = (payload, secret, expiresIn) => {
  return JWT.sign(payload, secret, {
    expiresIn,
    algorithm: "HS256",
  });
};

export const generateAccessToken = (userId) => {
  return signToken({ id: userId }, ACCESSTOKEN, "1d");
};
export const generateRefreshToken = (userId) => {
  signToken({ id: userId }, REFRESHTOKEN, "7d");
};

export const sendAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevent js access
    secure: false, // must false on localhost
    sameSite: "lax", //lax or none for cross port
    maxAge: 24 * 60 * 60 * 1000, //1day
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

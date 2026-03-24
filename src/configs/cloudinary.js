import { v2 as cloudinary } from "cloudinary";
import { CLOUDE_API, CLOUDE_API_SECRET, CLOUDE_NAME } from "../secret.js";

const cloudinaryConnection = async () => {
  try {
    cloudinary.config({
      cloude_name: CLOUDE_NAME,
      cloude_api: CLOUDE_API,
      cloude_secret: CLOUDE_API_SECRET,
    });
  } catch (error) {
    console.log("An error occure in cloudinary", error);
  }
};
export default cloudinaryConnection;

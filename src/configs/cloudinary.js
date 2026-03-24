import { v2 as cloudinary } from "cloudinary";
import { CLOUDE_API, CLOUDE_API_SECRET, CLOUDE_NAME } from "../secret.js";

const cloudinaryConnection = async () => {
  try {
    cloudinary.config({
      cloud_name: CLOUDE_NAME,
      api_key: CLOUDE_API,
      api_secret: CLOUDE_API_SECRET,
    });
  } catch (error) {
    console.log("An error occure in cloudinary", error);
  }
};
export default cloudinaryConnection;

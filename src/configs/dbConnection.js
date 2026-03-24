import mongoose from "mongoose";
import { MONGO_URI } from "../secret.js";
const connectionDB = async (retryCount = 5, retryDelay = 3000) => {
  if (!MONGO_URI) {
    console.error("Mongodb url is not defined in the enviornment variable");
  }
  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: false,
    });
    console.log("Mongodb connected successfully");
    mongoose.connection.on("error", (err) => {
      console.log("Mongodb connection error", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.warn("Mongodb disconnected. attempting to reconnect...");
    });
  } catch (error) {
    console.log("Mongodb connection failed", error);
    if (retryCount > 0) {
      console.log(`Retrying connection in ${retryDelay / 1000} seconds...`);
      await new Promise((res) => setTimeout(res, retryDelay));
      return connectionDB(retryCount - 1, retryDelay);
    }
    process.exit(1);
  }
};
export default connectionDB;

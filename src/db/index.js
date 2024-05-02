import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        authSource: "admin",
      }
    );
    console.log(
      "Connected to the MONGODB: ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error("Error connecting to the MONGODB: ", error);
    process.exit(1);
  }
};

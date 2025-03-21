// Require the cloudinary library
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Return "https" URLs by setting secure: true
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  secure: true,
});

export default cloudinary;

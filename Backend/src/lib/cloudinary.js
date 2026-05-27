import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();

const sanitizeEnvValue = (value) =>
  typeof value === "string" ? value.trim().replace(/^['"]|['"]$/g, "") : value;

const CLOUDINARY_CLOUD_NAME = sanitizeEnvValue(process.env.CLOUDINARY_CLOUD_NAME);
const CLOUDINARY_API_KEY = sanitizeEnvValue(process.env.CLOUDINARY_API_KEY);
const CLOUDINARY_API_SECRET = sanitizeEnvValue(process.env.CLOUDINARY_API_SECRET);

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn(
    "Cloudinary is not fully configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file."
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;
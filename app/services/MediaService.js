import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMedia = async (media) => {
  try {
    const result = await cloudinary.uploader.upload(media.path);

    return result;
  } catch (error) {
    // Handle any errors that occur during the upload
    console.error("Error uploading media:", error);
    throw error;
  }
};

export const generateMediaThumb = async (media) => {
  try {
    const url = await cloudinary.url(media.public_id, {
      width: 200,
      height: 200,
      crop: "fill",
    });

    return url;
  } catch (error) {
    // Handle any errors that occur during thumbnail generation
    console.error("Error generating thumbnail:", error);
    throw error;
  }
};

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "recipes-project", // folder name on cloudinary
    });
    // file has been uploaded successfully
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file
    const {
      asset_id,
      public_id,
      width,
      height,
      resource_type,
      tags,
      url,
      secure_url,
    } = response;
    const image = {
      asset_id,
      public_id,
      width,
      height,
      resource_type,
      tags,
      url,
      secure_url,
    };
    return image;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file
    return null;
  }
};

const removeFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    folder: "recipes-project", // folder name on cloudinary
  });
};

export { uploadOnCloudinary, removeFromCloudinary };

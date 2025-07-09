"use server";

import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function uploadToCloudinary(file, folder = "student_documents") {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    bufferToStream(buffer).then((stream) => stream.pipe(uploadStream));
  });
}

export async function deleteFromCloudinary(fileUrl) {
  try {
    const parts = fileUrl.split("/");
    const fileName = parts.at(-1); // 'abcxyz.jpg'
    const folder = parts.at(-2); // 'student_documents'

    const [publicId] = fileName.split(".");

    const fullPublicId = `${folder}/${publicId}`;

    const result = await cloudinary.uploader.destroy(fullPublicId);
    return result;
  } catch (error) {
    console.error("Gagal menghapus file dari Cloudinary:", error);
    return null;
  }
}

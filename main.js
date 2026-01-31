require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT_URL.startsWith("http")
    ? process.env.S3_ENDPOINT_URL
    : `http://${process.env.S3_ENDPOINT_URL}`,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

// Baca file lokal yang akan diupload
const fileContent = fs.readFileSync("data/rich_dad_poor_dad.jpg");

// Siapkan perintah upload dengan Content-Type
const uploadParams = {
  Bucket: process.env.S3_BUCKET_NAME, // Ganti dengan nama bucket di R2 Anda
  Key: `${process.env.S3_FOLDER_NAME}/rich_dad_poor_dad.jpg`, // Nama file yang akan disimpan di R2
  Body: fileContent,
  ContentType: "image/jpeg", // Menambahkan Content-Type agar file ditangani sebagai gambar JPEG
};

const run = async () => {
  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log("File berhasil diupload ke R2!");
  } catch (err) {
    console.error("Gagal mengupload file:", err);
  }
};

run();

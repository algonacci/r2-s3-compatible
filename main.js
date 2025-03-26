require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3Client = new S3Client({
  region: "auto", // Gunakan "auto" atau region lain jika diperlukan
  endpoint: process.env.ENDPOINT_URL, // Ganti dengan endpoint R2 Anda
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY,
    secretAccessKey: process.env.STORAGE_SECRET_KEY,
  },
});

// Baca file lokal yang akan diupload
const fileContent = fs.readFileSync("data/Rich Dad Poor Dad.jpg");

// Siapkan perintah upload
const uploadParams = {
  Bucket: "hris-onni", // Ganti dengan nama bucket di R2 Anda
  Key: "rich_dad_poor_dad.jpg", // Nama file yang akan disimpan di R2
  Body: fileContent,
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

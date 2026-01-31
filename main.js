require("dotenv").config();
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
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

    // Generate Public URL (Karena bucket sudah public)
    // Prioritaskan S3_PUBLIC_URL jika ada (untuk custom domain), kalau tidak pakai Endpoint bawaan
    const rawEndpoint = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT_URL;
    const endpoint = rawEndpoint.startsWith("http") ? rawEndpoint : `http://${rawEndpoint}`;

    // URL format: Endpoint / BucketName / Key
    const publicUrl = `${endpoint}/${process.env.S3_BUCKET_NAME}/${uploadParams.Key}`;

    console.log("Link akses publik (Permanen):", publicUrl);

  } catch (err) {
    console.error("Gagal mengupload file:", err);
  }
};

run();

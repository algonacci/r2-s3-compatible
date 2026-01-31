require("dotenv").config();
const { S3Client, PutBucketPolicyCommand } = require("@aws-sdk/client-s3");

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

const bucketName = process.env.S3_BUCKET_NAME;

const makeBucketPublic = async () => {
    const policy = {
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "PublicReadGetObject",
                Effect: "Allow",
                Principal: "*",
                Action: "s3:GetObject",
                Resource: `arn:aws:s3:::${bucketName}/*`,
            },
        ],
    };

    const params = {
        Bucket: bucketName,
        Policy: JSON.stringify(policy),
    };

    try {
        await s3Client.send(new PutBucketPolicyCommand(params));
        console.log(`✅ Sukses! Bucket '${bucketName}' sekarang bersifat PUBLIC.`);
        console.log("Semua file di dalamnya bisa diakses tanpa token/signature.");
    } catch (err) {
        console.error("❌ Gagal mengubah policy bucket:", err);
    }
};

makeBucketPublic();

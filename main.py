from minio import Minio
from dotenv import load_dotenv
import os
import mimetypes

# Load environment variables
load_dotenv()

# Buat client Minio dengan endpoint R2 Cloudflare
minio_client = Minio(
    endpoint=os.getenv("S3_ENDPOINT_URL"),  # Misalnya: "https://your-r2-endpoint"
    access_key=os.getenv("S3_ACCESS_KEY"),
    secret_key=os.getenv("S3_SECRET_KEY"),
    secure=False  # Gunakan HTTPS
)

# Fungsi untuk mengunggah file
def upload_file(file_path, bucket_name, object_name):
    try:
        # Upload file
        content_type, _ = mimetypes.guess_type(file_path)
        minio_client.fput_object(
            bucket_name=bucket_name,
            object_name=object_name,
            file_path=file_path,
            content_type=content_type or 'application/octet-stream'
        )
        print(f"File '{file_path}' berhasil diupload ke bucket '{bucket_name}'.")
        
        # Generate Public URL
        # Jika ada S3_PUBLIC_URL di .env, gunakan itu. Jika tidak, pakai S3_ENDPOINT_URL.
        endpoint = os.getenv("S3_PUBLIC_URL", os.getenv("S3_ENDPOINT_URL"))
        if not endpoint.startswith("http"):
            endpoint = f"http://{endpoint}"
            
        public_url = f"{endpoint}/{bucket_name}/{object_name}"
        
        print(f"\nLink akses publik (Permanen): {public_url}")

    except Exception as e:
        print("Gagal mengupload file:", e)

# Contoh penggunaan
upload_file(
    file_path='data/rich_dad_poor_dad.jpg',
    bucket_name=os.getenv("S3_BUCKET_NAME"),
    object_name=f'{os.getenv("S3_FOLDER_NAME")}/rich_dad_poor_dad_python.jpg',
)

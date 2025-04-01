from minio import Minio
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Buat client Minio dengan endpoint R2 Cloudflare
minio_client = Minio(
    endpoint=os.getenv("ENDPOINT_URL"),  # Misalnya: "https://your-r2-endpoint"
    access_key=os.getenv("STORAGE_ACCESS_KEY"),
    secret_key=os.getenv("STORAGE_SECRET_KEY"),
    secure=True  # Gunakan HTTPS
)

# Fungsi untuk mengunggah file
def upload_file(file_path, bucket_name, object_name):
    try:
        # Upload file
        minio_client.fput_object(
            bucket_name=bucket_name,
            object_name=object_name,
            file_path=file_path,
        )
        print(f"File '{file_path}' berhasil diupload ke bucket '{bucket_name}'.")
    except Exception as e:
        print("Gagal mengupload file:", e)

# Contoh penggunaan
upload_file(
    file_path='data/rich_dad_poor_dad.jpg',
    bucket_name='terbaru-nih',
    object_name='rich_dad_poor_dad.jpg',
)

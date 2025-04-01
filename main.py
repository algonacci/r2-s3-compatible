import boto3
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Buat sesi boto3
session = boto3.session.Session()

# Buat client S3 dengan endpoint R2 Cloudflare
s3_client = session.client(
    service_name='s3',
    endpoint_url=os.getenv("ENDPOINT_URL"),
    aws_access_key_id=os.getenv("STORAGE_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("STORAGE_SECRET_KEY")
)

# Path file yang akan diupload
file_path = 'data/rich_dad_poor_dad.jpg'

# Menentukan ContentType
content_type = 'image/jpeg'

# Upload file dengan ContentType
try:
    s3_client.upload_file(
        file_path,
        'test', 
        'rich_dad_poor_dad.jpg',
        ExtraArgs={'ContentType': content_type}
    )
    print("File berhasil diupload ke R2!")
except Exception as e:
    print("Gagal mengupload file:", e)

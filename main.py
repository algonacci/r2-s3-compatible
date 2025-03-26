from dotenv import load_dotenv
import os
load_dotenv()
import boto3


# Buat sesi boto3
session = boto3.session.Session()

# Buat client S3 dengan endpoint R2 Cloudflare
s3_client = session.client(
    service_name='s3',
    endpoint_url=os.getenv("ENDPOINT_URL"),
    aws_access_key_id=os.getenv("STORAGE_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("STORAGE_SECRET_KEY")
)

s3_client.upload_file('data/Rich Dad Poor Dad.jpg', 'hris-onni', 'rich_dad_poor_dad.jpg')

print("File berhasil diupload ke R2!")

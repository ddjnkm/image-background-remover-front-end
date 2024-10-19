import {
    PutObjectCommand,
    S3Client,
  } from "@aws-sdk/client-s3";
import { Readable } from 'stream'; // If you're working with streams

// AWS S3 Client configuration
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY
  }
});

interface UploadFileParams {
    bucketName: string;
    key: string;
    file: File | Buffer | Readable;
}

export async function uploadJpgToS3({
    bucketName,
    key,
    file
}: UploadFileParams): Promise<string> {
    try {
        const uploadParams = {
        Bucket: bucketName,
        Key: key, // The file name or path inside the bucket (e.g., 'images/photo.jpg')
        Body: file,
        ContentType: "image/jpeg", // Set the content type for JPEG images
        };

        // Upload file to S3
        const command = new PutObjectCommand(uploadParams);
        const response = await s3Client.send(command);

        console.log("JPG file uploaded successfully:", response);
        return key;
    } catch (error) {
        console.error("Error uploading JPG file:", error);
        throw new Error("Error uploading image file: "+error);
    }
}
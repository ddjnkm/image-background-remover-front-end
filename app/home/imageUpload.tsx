// src/components/ImageUpload.tsx

import React, { useState, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { uploadJpgToS3 } from '../lib/s3/s3Adapter';
import LoadingBar from '../lib/components/loadingBar';

const AWS_SOURCE_BUCKET_NAME = "image-background-remover-source-images";
const AWS_MODIFIED_BUCKET_URL = 'https://image-background-remover-modified-images.s3.us-east-2.amazonaws.com';

const ImageUpload: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorOccurred, setErrorOccurred] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const inputFile = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  function fetchModifiedImageUrl(imageId: string) {
    return `${AWS_MODIFIED_BUCKET_URL}/${imageId}`;
  }

  const checkImageWithRetry = async (imageUrl: string) => {
    const RETRY_INTERVAL = 1000;
    const TIMEOUT_DURATION = 30000;
    const timedOut = false;
    const startTime = Date.now();
    while (!timedOut) {
      try {
        const response = await fetch(imageUrl);
        if (response.ok) {
          return response;
        } else if (response.status === 403) {
          // If 403, retry
          const elapsed = Date.now() - startTime;
          if (elapsed >= TIMEOUT_DURATION) {
            return response;
          }
          await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL)); // Wait before retrying
        } else {
          return response;
        }
      } catch (error) {
        return error;
      }
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setErrorOccurred(false);
      handleSubmit(file);
    }
  };

  const handleSubmit = async (selectedImage: File) => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const timestamp = Date.now();
        const fileName = "source-image-"+timestamp+".jpg";
        const jpgFile = Buffer.from(reader.result as ArrayBuffer);
        try {
          const response = await uploadJpgToS3({
            bucketName: AWS_SOURCE_BUCKET_NAME,
            key: fileName,
            file: jpgFile,
          });
          try {
            const imageKey = response;

            const imageCheckResult = await checkImageWithRetry(fetchModifiedImageUrl('modified-'+imageKey));

            if ((imageCheckResult as Response).ok) {
              router.push('/photoshopMeIn?imageId=modified-'+imageKey);
            } else {
              console.error('Error generating image.');
              throw new Error('Error generating the modified image.');
            }
          } catch (error) {
            console.error('Error fetching image URL:', error);
            throw error;
          }
  
        } catch (error) {
          throw error;
        }
      } catch (error) {
        if (error === 'AbortError') {
          setMessage('Image upload timed out.');
        } else {
          setMessage('Image upload failed!');
        }
        console.error('Error:', error);
        setErrorOccurred(true);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(selectedImage);
  };

  const handleButtonClick = () => {
    inputFile.current?.click();
  };

  return (
    <div className='flex-col'>
      <div className='flex justify-center p-5'>
        <button className="rounded-md upload-button bg-blue-600 hover:bg-blue-800 p-5 text-white" onClick={handleButtonClick}>
          Upload Image
        </button>
        <input type='file' id='file' accept="image/*" ref={inputFile} style={{display: 'none'}} onChange={handleImageChange}/>
      </div>
      <div className='flex justify-center p-5'>
          {loading ? <LoadingBar/> : ''}
      </div>
      <div className='flex justify-center p-5'>
          {errorOccurred ? 'There was an issue with processing the image. Please try again!' : ''}
      </div>
      <div className='flex justify-center'>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ImageUpload;

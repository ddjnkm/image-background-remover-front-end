// src/components/ImageUpload.tsx

import React, { useState, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';

const ImageUpload: React.FC = () => {
  const backendServerUrl = process.env.BACKEND_SERVER_URL ?? `http://159.203.175.4:8080`;
  const secretKey = process.env.NEXT_PUBLIC_API_KEY;
  const cryptoJs = require("crypto-js");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const inputFile = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {

      const base64String = (reader.result as string).replace('data:image/jpeg;base64,','')
                                                    .replace('data:image/jpg;base64,','')
                                                    .replace('data:image/png;base64,','');
      const controller = new AbortController();
      const signal = controller.signal;

      setLoading(true);
      setMessage(null);

      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes timeout

      try {
        const timestamp = Date.now();
        const message = base64String.substring(0, 50)+"woodstock"+timestamp;
        const signature = cryptoJs.HmacSHA256(message, secretKey).toString();
        console.log(backendServerUrl);
        const response = await fetch(`${backendServerUrl}/api/modifyImage/1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-signature': signature,
            'x-timestamp': String(timestamp)
          },
          body: '{"body":"'+base64String+'"}',
          signal: signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response;
        setMessage('Processed image successfully!');

        try {
          const imageKey = await result.text();

          router.push('/photoshopMeIn?imageId='+imageKey);
        } catch (error) {
          console.error('Error fetching image URL:', error);
        }

      } catch (error) {
        if (error === 'AbortError') {
          setMessage('Image upload timed out.');
        } else {
          setMessage('Image upload failed!');
        }
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(selectedImage);
  };

  const handleButtonClick = () => {
    inputFile.current?.click();
  };

  return (
    <div className='flex-col'>
      <div className='flex justify-center p-5'>
        <button className="rounded-md upload-button bg-rose-400 hover:bg-rose-600 p-5" onClick={handleButtonClick}>
          Upload Image
        </button>
        <input type='file' id='file' accept="image/*" ref={inputFile} style={{display: 'none'}} onChange={handleImageChange}/>
      </div>
      <div className='flex justify-center border-gray-300'>
        {preview && <img src={preview} alt="Preview" style={{ width: '300px', marginTop: '10px' }} />}
      </div>
      <div className='flex justify-center p-5'>
        <button className="rounded-md bg-rose-400 hover:bg-rose-600 p-5" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Processing Image...' : 'Submit'}
        </button>
      </div>
      <div className='flex justify-center'>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ImageUpload;

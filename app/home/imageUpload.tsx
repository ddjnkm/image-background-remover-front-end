// src/components/ImageUpload.tsx

import React, { useState, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';

const ImageUpload: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const inputFile = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  function displayImage(imageUrl: string): void {
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'S3 Image';
    imgElement.style.maxWidth = '100%';

    const container = document.getElementById('image-container');
    if (container) {
        container.appendChild(imgElement);
    } else {
        console.error('Image container not found');
    }
  }

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

      const base64String = (reader.result as string).replace('data:image/jpeg;base64,','');
      console.log(base64String)
      const controller = new AbortController();
      const signal = controller.signal;

      setLoading(true);
      setMessage(null);

      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes timeout

      try {
        const response = await fetch('http://127.0.0.1:5000/api/modifyImage/1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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

          router.push('/result?imageId='+imageKey);
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
    <div>
      <h1>Free Profile Picture Generator</h1>

      <button className="upload-button" onClick={handleButtonClick}>
        Upload Image
      </button>
      <input type='file' id='file' accept="image/*" ref={inputFile} style={{display: 'none'}} onChange={handleImageChange}/>
      
      {preview && <img src={preview} alt="Preview" style={{ width: '300px', marginTop: '10px' }} />}
      
      <br></br>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing Image...' : 'Submit.'}
      </button>

      {message && <p>{message}</p>}

    </div>
  );
};

export default ImageUpload;

import React, { useState, useEffect } from 'react';

interface ImageResultProps {
  imageId: string;
}

const ImageResult: React.FC<ImageResultProps> = ({ imageId }) => {
  
  const BUCKET_URL = process.env.AWS_IMAGE_BUCKET_URL ?? 'https://image-background-remover-modified-images.s3.us-east-2.amazonaws.com';

  const [selectedImage, setSelectedImage] = useState<string>('image1.jpg');

  const images = {
    'Image 1': 'image1.jpg',
    'Image 2': 'image2.jpg',
    'Image 3': 'image3.jpg',
    'Image 4': 'image4.jpg'
  };

  async function fetchImageUrl(imageId: string) {
    return `${BUCKET_URL}/${imageId}`;
  }

  async function updateImage(): Promise<any> {
    const imageUrl = await fetchImageUrl(imageId)
    setSelectedImage(imageUrl);
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedImage(event.target.value);
  };

  useEffect(() => {
    // call api or anything
    updateImage();
 });

  return (
    <div>
      <img src={selectedImage} alt="Selected" style={{ width: '100%', maxWidth: '500px' }} />
      <div>
        <select onChange={handleImageChange} value={selectedImage}>
          {Object.entries(images).map(([label, src]) => (
            <option key={src} value={src}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ImageResult;

import React, { useState } from 'react';
import { Image } from '@nextui-org/react';

interface ImageGridProps {
  onSelect: (image: string) => void;
}

const images = [
  "assets/asset_background_picture_1.jpg",
  "assets/asset_background_picture_2.jpg",
  "assets/asset_background_picture_3.jpg",
  "assets/asset_background_picture_4.jpg"
];

const BackgroundGallery: React.FC<ImageGridProps> = ({ onSelect }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(images[0]);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    onSelect(image);
  };

  return (
    <div className='grid grid-cols-4 gap-2.5 mt-10 mb-20 xl:mx-96 lg:mx-64 md:mx-32 sm:mx-4'>
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt={`image-${index}`}
          style={{
            border: selectedImage === image ? '2px solid blue' : '2px solid transparent',
            cursor: 'pointer',
            width: '100%',
            height: 'auto'
          }}
          onClick={() => handleImageClick(image)}
        />
      ))}
    </div>
  );
};

export default BackgroundGallery;
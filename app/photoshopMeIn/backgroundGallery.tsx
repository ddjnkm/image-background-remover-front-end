import React, { useState } from 'react';

interface ImageGridProps {
  onSelect: (image: string) => void;
}

const images = [
  '/assets/background_picture_1.jpg',
  '/assets/background_picture_2.jpg',
  '/assets/background_picture_3.jpg',
  '/assets/background_picture_4.jpg'
];

const BackgroundGallery: React.FC<ImageGridProps> = ({ onSelect }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(images[0]);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    onSelect(image);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '2.5rem', marginBottom: '5rem', marginLeft: '30%', marginRight: '30%'
     }}>
      {images.map((image, index) => (
        <img
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
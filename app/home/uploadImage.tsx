import React from 'react';
import ImageUpload from './imageUpload';

const UploadImage: React.FC = () => {

  return (
    <div className='lg:mx-62 md:mx-52 mx-4 mt-8'>
      <div className='flex justify-between items-center'>
          <div className="w-full h-auto">
              <div className='flex justify-center'>
                <h1 className='text-3xl pb-5'>Upload an image to get started!</h1>
              </div>
              <div className='flex justify-center text-center'>
              <p>Upload an image of yourself or someone else and photoshop them into a picture! Super quick, easy and free way to edit someone or something into a background.</p>
              </div>
              <div className='lg:px-36 md:px-36'>
                <ImageUpload />
              </div>
          </div>
      </div>
    </div>
  );
}

export default UploadImage;
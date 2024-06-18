import React, { useState } from 'react';
import ImageUpload from './imageUpload';

const Headline: React.FC = () => {

  return (
    <div className='flex justify-between items-center p-5 border-t-1 border-b-1 border-gray-300 bg-slate-100'>
        <div className="w-full h-auto lg:pl-36 md:pl-24 sm:pl-4">
            <div className='flex justify-center'>
              <h1 className='text-3xl pb-5'>Upload an image of someone to get started!</h1>  
            </div>
            <ImageUpload />
        </div>
        <div className='w-full h-auto lg:pr-36 md:pr-24 sm:pr-4'>
            <h1 className='text-balance text-3xl pb-5'>Photoshop yourself into cool backgrounds!</h1>
            <img className='rounded-lg border border-gray-300' src={`${process.env.PUBLIC_URL}/home/asset_12.jpg`} alt="image" />
        </div>
    </div>
  );
}

export default Headline;
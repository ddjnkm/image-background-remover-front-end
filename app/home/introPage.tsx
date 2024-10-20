import React from 'react';

const IntroPage: React.FC = () => {

  return (
    <div className='lg:mx-62 md:mx-52 mx-4 mt-16'>
      <div className='w-full h-auto lg:pr-36 md:pr-24 sm:pr-4'>
            <div className='flex justify-center'>
              <h1 className='text-balance text-3xl pb-5'>Photoshop yourself into cool backgrounds!</h1>
            </div>
            <div className='lg:flex lg:flex-row gap-2'>
                <img className='object-scale-down lg:w-96 md:w-64' src="/home/asset_12.jpg" alt="image" />
                <div className='flex items-center justify-center'>
                    <p className='text-center'>{`Put yourself or others into a picture, creating fun and personalized images. 
                        Whether it's for a playful edit or a creative project, users can upload photos, select from a variety of backgrounds, 
                        and easily place yourself or others into an image all for free!`}</p>                    
                </div>
            </div>
      </div>
    </div>
  );
}

export default IntroPage;
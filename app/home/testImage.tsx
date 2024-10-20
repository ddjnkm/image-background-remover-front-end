import React from 'react';
import { useRouter } from 'next/navigation';
import { Image } from '@nextui-org/react';

const TestImage: React.FC = () => {

    const TEST_IMAGE_KEY = 'test-source-image-1729394639756.jpg';

    const router = useRouter();

    const handleButtonClick = () => {
        router.push('/photoshopMeIn?imageId='+TEST_IMAGE_KEY);
    };

    return (
        <div className='lg:mx-62 md:mx-52 mx-4 mt-16'>
            <div className='w-full h-auto lg:pr-36 md:pr-24 sm:pr-4'>
                <div className='flex justify-center'>
                    <h2 className='text-balance text-3xl pb-5'>Try it out using an example!</h2>
                </div>
                <div className='lg:flex lg:flex-row md:flex md:flex-row justify-center'>
                    <div className='flex items-center justify-center'>
                        <button className="rounded-md upload-button bg-blue-600 hover:bg-blue-800 p-5 text-white m-2" onClick={handleButtonClick}>
                        Click here to try it out!
                        </button>
                    </div>
                    <Image className='object-scale-down lg:w-96 md:w-64' src="home/asset_13.png" alt="image" />
                </div>
            </div>
        </div>
    );
}

export default TestImage;
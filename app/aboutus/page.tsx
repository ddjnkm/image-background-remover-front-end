"use client"

import Header from '../header';
import Footnote from "../footer";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
        <div>
        <Header />          
        </div>
        <div className='flex justify-between items-center lg:m-36 md:m-24 md:m-12 border-t-1 border-b-1 border-gray-300 bg-slate-100'>
            <div className="w-full h-auto">
                <div className='flex justify-center'>
                    <div className="m-5">
                        Welcome to our innovative website where creativity meets fun! Here, you can select a picture of a person and seamlessly integrate them into any image of your choice using our easy-to-use photoshop tools. Whether you want to create hilarious memes, memorable greeting cards, or stunning photo montages, our platform provides all the features you need to bring your imaginative ideas to life. Dive into the world of digital artistry and enjoy the endless possibilities of personalized photo editing with us!
                    </div>
                </div>
            </div>
        </div>
        <div>
        <Footnote />          
        </div>
    </div>
  );
}

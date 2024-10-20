"use client"

import Header from './header';
import Footnote from "./footer";
import UploadImage from "./home/uploadImage";
import IntroPage from './home/introPage';
import TestImage from './home/testImage';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between ">
        <div>
        <Header />          
        </div>
        <div className="grow 2xl:mx-64 mb-12">
          <UploadImage />
          <IntroPage />
          <TestImage />
        </div>
        <div>
        <Footnote />
        </div>
    </div>
  );
}

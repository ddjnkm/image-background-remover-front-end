"use client"

import Header from '../header';
import Footnote from "../footer";
import UploadImage from "./uploadImage";
import IntroPage from './introPage';
import TestImage from './testImage';

export default function HomePage() {
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

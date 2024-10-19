"use client"

import Header from '../header';
import Footnote from "../footer";
import UploadImage from "./uploadImage";
import IntroPage from './introPage';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between ">
        <div>
        <Header />          
        </div>
        <div className="grow 2xl:mx-64">
          <UploadImage />
          <IntroPage />
        </div>
        <div>
        <Footnote />          
        </div>
    </div>
  );
}

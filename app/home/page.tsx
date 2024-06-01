"use client"

import ImageUpload from "./imageUpload";
import Header from '../header';
import Footnote from "../footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
        <div>
        <Header />          
        </div>
        <div className="grow">
          <ImageUpload />          
        </div>
        <div>
        <Footnote />          
        </div>
    </div>
  );
}

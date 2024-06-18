"use client"

import Header from '../header';
import Footnote from "../footer";
import Headline from "./headline";
import Banner from "./banner";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
        <div>
        <Header />          
        </div>
        <div className="grow">
          <Headline />          
        </div>
        <div>
        <Footnote />          
        </div>
    </div>
  );
}

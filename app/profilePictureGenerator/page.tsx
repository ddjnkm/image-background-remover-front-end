"use client";

import ImageResult from "./imageResult";
import { useSearchParams } from 'next/navigation'
import { redirect } from 'next/navigation';
import Header from '../header';
import Footnote from "../footer";
import { Suspense } from "react";

function SearchResultPage() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId');

  if (imageId === null) {
    redirect('/home')
  }

  return (
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <ImageResult imageId={imageId}/>
        <Footnote />
      </div>      
  );
}

export default function ResultPage() {
  return (
    <Suspense>
      <SearchResultPage />
    </Suspense>
  );
}
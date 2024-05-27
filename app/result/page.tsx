"use client";

import ImageResult from "./imageResultPage";
import { useSearchParams } from 'next/navigation'
import { redirect } from 'next/navigation';

export default function ResultPage() {

  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId');

  if (imageId === null) {
    redirect('/home')
  }

  return (
    <div>
      <ImageResult imageId={imageId}/>
    </div>
  );
}

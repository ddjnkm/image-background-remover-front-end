import React, { useState, useEffect, useRef } from 'react';
import Draggable, { DraggableData } from 'react-draggable';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import BackgroundGallery from './backgroundGallery';

interface ImageResultProps {
  imageId: string;
}

const ImageResult: React.FC<ImageResultProps> = ({ imageId }) => {

  const BUCKET_URL = process.env.AWS_IMAGE_BUCKET_URL ?? 'https://image-background-remover-modified-images.s3.us-east-2.amazonaws.com';

  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [overlayImage, setOverlayImage] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [overlayPosition, setOverlayPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [overlayOriginalSize, setOverlayOriginalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [overlaySize, setOverlaySize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [overlayRatioSize, setOverlayRatioSize] = useState<number>(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);

  function fetchImageUrl(imageId: string) {
    return `${BUCKET_URL}/${imageId}`;
  }

  function calculateOverlayStartingSize (bgWidth: number, bgHeight: number, ovWidth: number, ovHeight: number) {
    let width = ovWidth;
    let height = ovHeight;
    if (ovHeight > bgHeight) {
      const x = bgHeight / ovHeight;
      height = ovHeight * x;
      width = ovWidth * x;
      console.log(height, width, x)
    }
    return {width, height}
  }

  useEffect(() => {
    if (overlayImage === null || backgroundImage === null) {
      setHasLoadedOnce(true);
      const bgImage = new Image();
      bgImage.crossOrigin = 'anonymous';
      bgImage.src = '/assets/background_picture_1.jpg';

      const ovImage = new Image();
      ovImage.crossOrigin = 'anonymous';
      ovImage.src = fetchImageUrl(imageId);

      const defaultOverySize = calculateOverlayStartingSize(bgImage.width, bgImage.height, ovImage.width, ovImage.height);
      setOverlayOriginalSize({width: defaultOverySize.width, height: defaultOverySize.height});
      setOverlaySize({width: defaultOverySize.width, height: defaultOverySize.height});

      bgImage.onload = () => {
        setBackgroundImage(bgImage);
        setInitialOverlayPosition(bgImage, defaultOverySize);
      }

      ovImage.onload = () => setOverlayImage(ovImage);
    }
  });

  const handleBackgroundImageSelect = (image: string) => {
    console.log(image)
    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    bgImage.src = image;
    setBackgroundImage(bgImage);
  };

  const setInitialOverlayPosition = (bgImage: HTMLImageElement, overlaySize: any) => {
    const initialX = (bgImage.width - overlaySize.width) / 2;
    const initialY = bgImage.height - overlaySize.height;
    setOverlayPosition({ x: initialX, y: initialY });
  };

  const handleDragStop = (e: React.MouseEvent, data: DraggableData) => {
    setOverlayPosition({ x: data.x, y: data.y });
  };

  const handleResize: ResizableBoxProps['onResizeStop'] = (e: any, { size }: any) => {
    const newWidth = overlayOriginalSize.width*(overlayRatioSize/100);
    const newHeight = overlayOriginalSize.height*(overlayRatioSize/100)
    setOverlaySize({ width: newWidth, height: newHeight });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !backgroundImage || !overlayImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = backgroundImage.width;
    canvas.height = backgroundImage.height;
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    const { x, y } = overlayPosition;
    const { width, height } = overlaySize;
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    if (isFlipped) {
      ctx.scale(-1, 1);
    }
    ctx.drawImage(overlayImage, isFlipped ? -width / 2 : -width / 2, -height / 2, width, height);
    ctx.restore();

    const link = document.createElement('a');
    link.download = 'profile-picture.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div>
      <div className="editor-container">
        <img src={backgroundImage?.src} alt="" className="background-image" />
        <Draggable onStop={handleDragStop} position={overlayPosition}>
          <ResizableBox
            width={overlaySize.width}
            height={overlaySize.height}
            minConstraints={[0, 0]}
            maxConstraints={[200, 200]}
            className="resizable-box"
            onResizeStop={handleResize}
          >
            <div
              className="overlay-image-container"
              style={{ transform: `rotate(${rotation}deg) ${isFlipped ? 'scaleX(-1)' : ''}` }}
            >
              <img
                ref={overlayRef}
                src={overlayImage?.src}
                alt=""
                className="overlay-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none', // Prevent image from interfering with drag and resize events
                }}
              />
            </div>
          </ResizableBox>
        </Draggable>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      <div className="controls">
        <label>
          Rotate:
          <input
            type="range"
            min="-180"
            max="180"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
          />
        </label>
        <label>
          Size:
          <input
            type="range"
            min="0"
            max="200"
            value={overlayRatioSize}
            onChange={(e) => {
              setOverlayRatioSize(Number(e.target.value));
              const newWidth = overlayOriginalSize.width*(overlayRatioSize/100);
              const newHeight = overlayOriginalSize.height*(overlayRatioSize/100)
              setOverlaySize({ width: newWidth, height: newHeight });
            }}
          />
        </label>
        <button onClick={toggleFlip} className="flip-button">Flip</button>
        <button onClick={handleDownload} className="download-button">Download</button>
      </div>
      <BackgroundGallery onSelect={handleBackgroundImageSelect} />
    </div>
  );
};

export default ImageResult;
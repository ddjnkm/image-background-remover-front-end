import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import BackgroundGallery from './backgroundGallery';

interface ImageResultProps {
  imageId: string;
}

const ImageResult: React.FC<ImageResultProps> = ({ imageId }) => {
  
  const BUCKET_URL = process.env.AWS_IMAGE_BUCKET_URL ?? 'https://image-background-remover-modified-images.s3.us-east-2.amazonaws.com';

  const backgroundImageFileInputRef = useRef<HTMLInputElement | null>(null);  // reference for file input

  const LG_VIEW_IMAGE_WIDTH = 500;
  const MD_VIEW_IMAGE_WIDTH = 200;
  const SM_VIEW_IMAGE_WIDTH = 100;

  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [backgroundImageSize, setBackgroundImageSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  const [backgroundImageOriginalSize, setBackgroundImageOriginalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [overlayImage, setOverlayImage] = useState<HTMLImageElement | null>(null);
  const [overlayPosition, setOverlayPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [overlayActualSize, setOverlayActualSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [overlayOriginalSize, setOverlayOriginalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [overlaySize, setOverlaySize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [overlayRatioSize, setOverlayRatioSize] = useState<number>(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);

  const styleEditorContainer: React.CSSProperties = {
    width: backgroundImageSize.width,
    height: backgroundImageSize.height,
  };

  function fetchImageUrl(imageId: string) {
    return `${BUCKET_URL}/${imageId}`;
  }

  function calculateBackgroundStartingSize (bgWidth: number, bgHeight: number) {
    if (bgWidth > LG_VIEW_IMAGE_WIDTH) {
      const x = LG_VIEW_IMAGE_WIDTH / bgWidth;
      const height = bgHeight * x;
      const width = bgWidth * x;
      return {width, height}
    }
    const x = bgWidth / LG_VIEW_IMAGE_WIDTH;
    const height = bgHeight * x;
    const width = bgWidth * x;
    return {width, height}
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
      const bgImage = new Image();
      bgImage.crossOrigin = 'anonymous';
      bgImage.src = '/assets/background_picture_1.jpg';

      const ovImage = new Image();
      ovImage.crossOrigin = 'anonymous';
      ovImage.src = fetchImageUrl(imageId);
      setOverlayActualSize({width: ovImage.width, height: ovImage.height});

      const defaultBackgroundSize = calculateBackgroundStartingSize(bgImage.width, bgImage.height);
      setBackgroundImageSize({width: defaultBackgroundSize.width, height: defaultBackgroundSize.height});
      const defaultOverlaySize = calculateOverlayStartingSize(defaultBackgroundSize.width, defaultBackgroundSize.height, ovImage.width, ovImage.height);
      setOverlayOriginalSize({width: defaultOverlaySize.width, height: defaultOverlaySize.height});
      setOverlaySize({width: defaultOverlaySize.width, height: defaultOverlaySize.height});
      setInitialOverlayPosition(defaultBackgroundSize.width, defaultBackgroundSize.height, defaultOverlaySize);

      bgImage.onload = () => setBackgroundImage(bgImage);
      ovImage.onload = () => setOverlayImage(ovImage);
    }
  });

  const handleBackgroundImageSelect = (image: string) => {
    console.log(image)
    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    bgImage.src = image;
    bgImage.onload = () => {
      setBackgroundImage(bgImage);
      const backgroundSize = calculateBackgroundStartingSize(bgImage.width, bgImage.height);
      setBackgroundImageSize({width: backgroundSize.width, height: backgroundSize.height});
      const defaultOverlaySize = calculateOverlayStartingSize(backgroundSize.width, backgroundSize.height, overlayActualSize.width, overlayActualSize.height);
      setOverlayOriginalSize({width: defaultOverlaySize.width, height: defaultOverlaySize.height});
      setOverlaySize({width: defaultOverlaySize.width, height: defaultOverlaySize.height});
      setInitialOverlayPosition(backgroundSize.width, backgroundSize.height, defaultOverlaySize);
      setOverlayRatioSize(100);
    }
  };

  // Handler to trigger file input click
  const triggerBackgroundImageFileInput = () => {
    backgroundImageFileInputRef.current?.click();
  };

  // Function to convert File to HTMLImageElement
  const fileToImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleBackgroundImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Convert File to HTMLImageElement
      const img = await fileToImage(file);
      setBackgroundImage(img);
      const backgroundSize = calculateBackgroundStartingSize(img.width, img.height);
      setBackgroundImageSize({width: backgroundSize.width, height: backgroundSize.height});
      const defaultOverlaySize = calculateOverlayStartingSize(backgroundSize.width, backgroundSize.height, overlayActualSize.width, overlayActualSize.height);
      setOverlayOriginalSize({width: defaultOverlaySize.width, height: defaultOverlaySize.height});
      setOverlaySize({width: defaultOverlaySize.width, height: defaultOverlaySize.height});
      setInitialOverlayPosition(backgroundSize.width, backgroundSize.height, defaultOverlaySize);
      setOverlayRatioSize(100);
    }
  };

  const setInitialOverlayPosition = (bgImgWidth: number, bgImgHeight: number, overlaySize: any) => {
    const initialX = (bgImgWidth - overlaySize.width) / 2;
    const initialY = bgImgHeight - overlaySize.height;
    setOverlayPosition({ x: initialX, y: initialY });
  };

  const handleDragStop: DraggableEventHandler = (e: DraggableEvent, data: DraggableData) => {
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

    canvas.width = backgroundImageSize.width;
    canvas.height = backgroundImageSize.height;
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
    link.download = 'result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className='border-t-1 border-b-1 border-gray-300'>
      <div className='flex justify-center'>
        <button onClick={triggerBackgroundImageFileInput} className="rounded-md bg-rose-400 hover:bg-rose-600 mt-5 p-5">Upload Your Own Background Image!</button> 
      </div>
      <div className="editor-container" style={styleEditorContainer}>
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
        <button onClick={toggleFlip} className="rounded-md bg-blue-600 hover:bg-blue-800 m-2 p-2 text-white">Flip</button>
        <button onClick={handleDownload} className="rounded-md bg-blue-600 hover:bg-blue-800 m-2 p-2 text-white">Download</button>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleBackgroundImageUpload}
        ref={backgroundImageFileInputRef}
        style={{ display: 'none' }} // Hide the actual file input
      />
      <BackgroundGallery onSelect={handleBackgroundImageSelect} />
    </div>
  );
};

export default ImageResult;

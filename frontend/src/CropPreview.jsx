import React, { useEffect, useRef } from 'react';
import { canvasPreview } from './canvasPreview';

export default function CropPreview({ img, crop }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (img && crop?.width && crop?.height && canvasRef.current) {
      canvasPreview(img, canvasRef.current, crop);
      // Make the rendered canvas scale to container width for responsive display
      try {
        canvasRef.current.style.width = '100%';
        canvasRef.current.style.height = 'auto';
        canvasRef.current.style.display = 'block';
      } catch (e) {
        // ignore if styling is not possible
      }
    }
  }, [img, crop]);

  if (!img || !crop) return null;

  return <canvas ref={canvasRef} className="border w-full h-auto" />;
}

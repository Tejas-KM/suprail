import React, { useRef, useState, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import axiosMultipartInstance from './utils/axiosMultipart';
import ImageStudioNew from './ImageNew';
import { createProject } from './api/project';
import AppBar from './layouts/AppBar';

export default function App() {
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [srcImg, setSrcImg] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [studioImage, setStudioImage] = useState(null);
  const [studioData, setStudioData] = useState(null);

  const [loading, setLoading] = useState(false); // ✅ loader

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSrcImg(url);
    setCrop(undefined);
    setShowModal(true);
  };

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    const defaultCrop = {
      unit: 'px',
      x: width * 0.25,
      y: height * 0.25,
      width: width * 0.5,
      height: height * 0.5,
    };
    setCrop(defaultCrop);
  }, []);

  const handleCropAndUpload = async () => {
    if (!completedCrop || !imgRef.current) {
      alert('Crop the image first.');
      return;
    }

    const image = imgRef.current;
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    const displayedWidth = image.width;
    const displayedHeight = image.height;

    const scaleX = naturalWidth / displayedWidth;
    const scaleY = naturalHeight / displayedHeight;

    const cropX = Math.floor(completedCrop.x * scaleX);
    const cropY = Math.floor(completedCrop.y * scaleY);
    const cropWidth = Math.floor(completedCrop.width * scaleX);
    const cropHeight = Math.floor(completedCrop.height * scaleY);

    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    setLoading(true); // ✅ show loader

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setLoading(false);
        alert('Failed to crop image.');
        return;
      }

      const imageUrl = URL.createObjectURL(blob);
      setStudioImage(imageUrl);

      const formData = new FormData();
      formData.append('file', blob, 'cropped.jpg');

      try {
        const response = await axiosMultipartInstance.post('/predict', formData, { timeout: 10000 });

        setStudioData(response.data);

        const newFormData = new FormData();
        newFormData.append('image', blob, 'cropped.jpg');
        newFormData.append('predictionData', JSON.stringify(response.data));

        createProject(newFormData); // Assuming createProject is defined elsewhere
        setShowModal(false);
      } catch (err) {
        console.error('Upload error:', err);
        alert(`Upload failed: ${err?.message || 'Unknown error'}`);
      } finally {
        setLoading(false); // ✅ hide loader
      }
    }, 'image/jpeg', 0.95);
  };

  if (studioData && studioImage) {
    return <ImageStudioNew data={studioData} image={studioImage} />;
  }

  return (
    <div className="p-4 space-y-4">
    <div className="flex justify-center items-center mt-30">
  <div className="bg-white p-8 rounded-2xl shadow-xl border w-[500px] text-center space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Upload or Capture Image</h2>
    <div className="flex flex-col gap-4">
      <button
        type="button"
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg shadow-md transition-all"
        onClick={() => fileInputRef.current?.click()}
      >
        📁 Upload from Gallery
      </button>
      <button
        type="button"
        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3 rounded-lg shadow-md transition-all"
        onClick={() => cameraInputRef.current?.click()}
      >
        📷 Capture from Camera
      </button>
    </div>
  </div>
</div>


      <input ref={fileInputRef} type="file" accept="image/*" onChange={onSelectFile} style={{ display: 'none' }} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={onSelectFile} style={{ display: 'none' }} />

      {showModal && srcImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-lg relative">
            <button className="absolute top-2 right-3 text-gray-500 text-3xl" onClick={() => setShowModal(false)}>
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-2">Crop Image</h2>

            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img
                ref={imgRef}
                src={srcImg}
                alt="To Crop"
                onLoad={onImageLoad}
                crossOrigin="anonymous"
              />
            </ReactCrop>

            {loading && (
              <div className="flex items-center justify-center space-x-2 py-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-500">Uploading...</span>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded"
                onClick={handleCropAndUpload}
                disabled={loading}
              >
                ✂️ Crop & Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

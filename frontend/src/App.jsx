import React, { useRef, useState } from 'react';
import axios from 'axios';
import axiosMultipartInstance from './utils/axiosMultipart';
import ImageStudioNew from './ImageNew';
import { createProject } from './api/project';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [studioImage, setStudioImage] = useState(null);
  const [studioData, setStudioData] = useState(null);
  const [loading, setLoading] = useState(false);
  // Model selection state: 'current' or 'previous'
  const [modelVersion, setModelVersion] = useState('current');

  // Map of model -> predict endpoint. Defaults keep current behavior.
  // TODO: When previous model API is available, set VITE_PREDICT_URL_PREVIOUS
  //       or update the mapping below accordingly.
  const PREDICT_ENDPOINTS = {
    current: import.meta.env.VITE_PREDICT_URL_CURRENT || '/predict',
    previous: import.meta.env.VITE_PREDICT_URL_PREVIOUS || '/predict',
  };

  const onSelectFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setStudioImage(imageUrl);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file, 'uploaded.jpg');

    try {
      // Use selected model endpoint (single call)
      const predictUrl = PREDICT_ENDPOINTS[modelVersion] || '/predict';
      const predictRes = await axiosMultipartInstance.post(predictUrl, formData, {
        timeout: 120000,
      });
      setStudioData(predictRes.data);

      const newFormData = new FormData();
      newFormData.append('image', file, 'uploaded.jpg');
      newFormData.append('predictionData', JSON.stringify(predictRes.data));
      newFormData.append('modelVersion', modelVersion);

      const tempProject = await createProject(newFormData);
      navigate(`/project/${tempProject._id}`); // Navigate to the project editor
    } catch (err) {
      console.error('Upload error:', err);
      alert(`Upload failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // if (studioData && studioImage) {
  //   return <ImageStudioNew data={studioData} image={studioImage} />;
  // }

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

      {/* Model Selection Card */}
      <div className="flex justify-center items-center mt-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl border w-[500px]">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Select Model</h3>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setModelVersion('current')}
              className={`flex-1 px-4 py-3 rounded-lg border text-center transition ${
                modelVersion === 'current'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              Current Model
            </button>
            <button
              type="button"
              onClick={() => setModelVersion('previous')}
              className={`flex-1 px-4 py-3 rounded-lg border text-center transition ${
                modelVersion === 'previous'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              Previous Model
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Tip: You can change this anytime before uploading. For now both options use the
            same API endpoint until the previous model URL is provided.
          </p>
        </div>
      </div>

  <input ref={fileInputRef} type="file" accept="image/*" onChange={onSelectFile} style={{ display: 'none' }} />
  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={onSelectFile} style={{ display: 'none' }} />

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-blue-600 font-semibold">AI is processing your image...</p>
          </div>
        </div>
      )}
    </div>
  );
}

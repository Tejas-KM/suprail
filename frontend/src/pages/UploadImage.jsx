import React, { useRef, useState } from 'react';
import axios from 'axios';
import axiosMultipartInstance from '../utils/axiosMultipart';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/project';

export default function UploadImage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  // Model selection state
  const [modelVersion, setModelVersion] = useState('current');

  // Endpoint mapping for models. Both default to /predict until previous is ready.
  // TODO: Replace previous endpoint when available (e.g. import.meta.env.VITE_PREDICT_URL_PREVIOUS)
  const PREDICT_ENDPOINTS = {
    current: import.meta.env.VITE_PREDICT_URL_CURRENT || '/predict',
    previous: import.meta.env.VITE_PREDICT_URL_PREVIOUS || '/predict',
  };

  const pipeSizes = [
  "110",
  "20",
  "25",
  "32",
  "40",
  "50",
  "63",
  "75",
  "90",
  "125",
  "140",
  "160",
  "180",
  "200",
  "225",
  "250",
  "280",
  "315",
  "400",
  "450"
];

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const togglePipeSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const removeSize = (size) => {
    setSelectedSizes((prev) => prev.filter((s) => s !== size));
  };

  const handleProcessImage = async () => {
    if (!imageFile) return alert('Please upload an image first');
    if (selectedSizes.length === 0) return alert('Please select at least one pipe size');

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile, 'uploaded.jpg');
      formData.append('pipeSizes', JSON.stringify(selectedSizes));

  const predictUrl = PREDICT_ENDPOINTS[modelVersion] || '/predict';
  const response = await axiosMultipartInstance.post(predictUrl, formData, { timeout: 120000 });

      const newFormData = new FormData();
      newFormData.append('image', imageFile, 'uploaded.jpg');
  newFormData.append('predictionData', JSON.stringify(response.data));
  newFormData.append('modelVersion', modelVersion);
      newFormData.append('pipeSizes', JSON.stringify(selectedSizes));

      const tempProject = await createProject(newFormData);
      navigate(`/project/${tempProject._id}`);
    } catch (err) {
      console.error('Upload error:', err);
      alert(`Upload failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mt-5 space-y-4">
      <div className="flex justify-center items-center mt-10">
        <div className="bg-white p-6 rounded-2xl shadow-xl border w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Upload or Capture Image
          </h2>

          {!imagePreview && (
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg shadow-md"
                onClick={() => fileInputRef.current?.click()}
              >
                📁 Upload from Gallery
              </button>
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3 rounded-lg shadow-md"
                onClick={() => cameraInputRef.current?.click()}
              >
                📷 Capture from Camera
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            style={{ display: 'none' }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onSelectFile}
            style={{ display: 'none' }}
          />

          {imagePreview && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Left Side - Image */}
              <div className="flex justify-center items-start">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-[400px] w-auto rounded-lg shadow-md"
                />
              </div>

              {/* Right Side - Size Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Pipe Sizes:</h3>
                <div className="flex flex-wrap gap-2">
                  {pipeSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => togglePipeSize(size)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        selectedSizes.includes(size)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    >
                      {size}mm
                    </button>
                  ))}
                </div>

                {selectedSizes.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Selected:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSizes.map((size) => (
                        <span
                          key={size}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
                        >
                          {size}
                          <button
                            onClick={() => removeSize(size)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleProcessImage}
                  className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md"
                >
                  Continue & Process
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Model selection card */}
      <div className="flex justify-center items-center">
        <div className="bg-white p-6 rounded-2xl shadow-xl border w-full max-w-5xl mt-4">
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Select Model</h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => setModelVersion('current')}
              className={`flex-1 px-6 py-3 rounded-lg border text-lg transition ${
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
              className={`flex-1 px-6 py-3 rounded-lg border text-lg transition ${
                modelVersion === 'previous'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              Previous Model
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">
            Both options use the same endpoint for now. Update env vars to split them later.
          </p>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-blue-600 font-semibold">
              AI is processing your image...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

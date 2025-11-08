import React, { useRef, useState } from 'react';
import axiosMultipartInstance from './utils/axiosMultipart';

export default function Upload() {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [showModal, setShowModal] = useState(false);

  const onSelectFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
      const resultResp = await axiosMultipartInstance.post('/predict', formData);
      const result = resultResp.data;
      alert(`Upload success: ${result.message || 'Done!'}`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => fileInputRef.current?.click()}
        >
          📁 Upload from Gallery
        </button>
        <button
          type="button"
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => cameraInputRef.current?.click()}
        >
          📷 Capture from Camera
        </button>
      </div>

      {/* Hidden Inputs */}
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
    </div>
  );
}

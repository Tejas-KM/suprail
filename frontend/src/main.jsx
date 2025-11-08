import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ImageStudio from './ImageStudio.jsx'
import Upload from './Upload.jsx'
import ImageAnnotator from './ImageTrail.jsx'
import LoginPage from './pages/Login.jsx'
import StartupGate from './components/StartupGate.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProjectEditor from './ProjectEditor.jsx'
import ZoomTest from './ZoomTest.jsx'
import DefaultLayout from './layouts/DefaultLayout.jsx'
import { Toaster } from 'react-hot-toast'
import UploadImage from './pages/UploadImage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="top-right" />
     <BrowserRouter>
     
      <Routes>
  {/* Startup gate: if authed -> /dashboard, else -> /login */}
  <Route path="/" element={<StartupGate />} />
  <Route path="/login" element={<LoginPage />} />
        <Route path="/zoom" element={<ZoomTest />} />

        <Route path="/dashboard" element={<DefaultLayout><Dashboard /></DefaultLayout>} />

        <Route path="/project/:id" element={<ProjectEditor />} />
        <Route path="/analyze" element={<DefaultLayout><App /></DefaultLayout>} />
        <Route path="/project/upload" element={<DefaultLayout><UploadImage /></DefaultLayout>} />

        <Route path="/image-studio" element={<ImageStudio />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/ann" element={<ImageAnnotator />} />



        {/* <Route path="/crop" element={<CropPage />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

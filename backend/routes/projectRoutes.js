import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { requireApiAccess } from '../middleware/apiAccess.js';


//import { authMiddleware } from '../middleware/authMiddleware.js';
import { createProject, getProjectById, getProjects, updatePredictionData, downloadProjectsByDate, downloadProjectsExcelByDate } from '../controllers/projectController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();


// Download zip of projects/images by date
router.get('/download/by-date', downloadProjectsByDate);

// Secure variant (API key + optional IP allowlist)
router.get('/download/by-date-secure', requireApiAccess, downloadProjectsByDate);

// Download Excel report of projects by date range
router.get('/download/excel-by-date', downloadProjectsExcelByDate);

//router.post('/', authMiddleware, upload.single('image'), createProject);
router.get('/', getProjects);
router.put('/:id/prediction', updatePredictionData);
router.get('/:id', getProjectById);

// Allow anonymous project creation so mobile app/WebView flows work without an auth cookie
router.post('/', upload.single('image'), createProject);

export default router;

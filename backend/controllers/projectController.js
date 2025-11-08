import Project from '../models/Project.js';
import moment from 'moment';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { uploadBufferToSupabase, getPublicUrl, getSignedUrl, SUPABASE_BUCKET } from '../utils/supabaseClient.js';

import ExcelJS from 'exceljs';

// Download all project images as zip for a user by date
export const downloadProjectsByDate = async (req, res) => {
  try {
    const { from, to, date } = req.query;
  const userId = req.query.userId || (req.user?._id || req.user);
    let start, end;
    const validFrom = from && from !== "" ? from : undefined;
    const validTo = to && to !== "" ? to : undefined;
    if (validFrom || validTo) {
      start = validFrom ? moment(validFrom).startOf('day').toDate() : undefined;
      end = validTo ? moment(validTo).endOf('day').toDate() : undefined;
    } else if (date && date !== "") {
      start = moment(date).startOf('day').toDate();
      end = moment(date).endOf('day').toDate();
    } else {
      return res.status(400).json({ error: 'Date or date range is required' });
    }
    // Build query
    const query = {};
    if (start && end) {
      query.createdAt = { $gte: start, $lte: end };
    } else if (start) {
      query.createdAt = { $gte: start };
    } else if (end) {
      query.createdAt = { $lte: end };
    }
    // Only filter by user if userId is explicitly provided
    if (userId) {
      query.user = userId;
    }
    const projects = await Project.find(query);
    if (!projects.length) {
      return res.status(404).json({ error: 'No projects found for this date range' });
    }
    // Prepare zip
    const zip = new AdmZip();
    const uploadsDir = path.resolve('uploads');
    // Add each project's image. Support: absolute URLs, Supabase object paths (private), and legacy local files.
    for (const project of projects) {
      if (!project.imageUrl) continue;
      try {
        const val = project.imageUrl;
        if (/^https?:\/\//i.test(val)) {
          // Absolute URL
          const resp = await axios.get(val, { responseType: 'arraybuffer' });
          const urlObj = new URL(val);
          const nameGuess = path.basename(urlObj.pathname) || `${project._id}.jpg`;
          zip.addFile(nameGuess, Buffer.from(resp.data));
        } else if (val.includes('/') && !val.includes('..')) {
          // Supabase object path (private); generate a short-lived signed URL and fetch
          const signed = await getSignedUrl(val, 60);
          const resp = await axios.get(signed, { responseType: 'arraybuffer' });
          const nameGuess = path.basename(val) || `${project._id}.jpg`;
          zip.addFile(nameGuess, Buffer.from(resp.data));
        } else {
          // Legacy local file
          const imgPath = path.join(uploadsDir, val);
          if (fs.existsSync(imgPath)) {
            zip.addLocalFile(imgPath, '', val);
          }
        }
      } catch (e) {
        // Skip problematic file, continue with others
        console.warn('Failed to add image to zip for project', project._id, e?.message);
      }
    }
    // Add project data as JSON
    zip.addFile('projects.json', Buffer.from(JSON.stringify(projects, null, 2)));
    // Send zip
    const zipBuffer = zip.toBuffer();
    const filename = from || to ? `projects_${from || ''}_${to || ''}.zip` : `projects_${date}.zip`;
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Length': zipBuffer.length,
    });
    res.end(zipBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to download zip' });
  }
};

// Download Excel report for all projects in a date range
export const downloadProjectsExcelByDate = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from && !to) {
      return res.status(400).json({ error: 'From or To date required' });
    }
    const query = {};
    if (from || to) {
      query.createdAt = {};
      if (from) {
        
        query.createdAt.$gte = moment(from).startOf('day').toDate();
      }
      if (to) {
        
        query.createdAt.$lte = moment(to).endOf('day').toDate();
      }
    }
    
    const projects = await Project.find(query).populate('user', 'name');
    if (!projects.length) {
      return res.status(404).json({ error: 'No projects found for this date range' });
    }

    
    const pipeSizes = [
      "20", "25", "32", "40", "50", "63", "75", "90", "110", "125", "140", "160",
      "180", "200", "225", "250", "280", "315", "400", "450"
    ];
    const header = [
      'Project Name',
      'Analysis Date',
      'Analyzed By',
      'Vehicle Number',
      'Total Pipes',
      ...pipeSizes.map(size => `${size}mm Count`)
    ];
    const rows = projects.map(project => {
      // Build pipe counts in sorted order
      const pipeCounts = pipeSizes.map(size => {
        const found = (project.productCount || []).find(item => item.name === size);
        return found ? Number(found.count) : 0;
      });
      const total = pipeCounts.reduce((sum, c) => sum + c, 0);
      return [
        project.name || '',
        project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '',
        project.user?.name || '',
        project.vehicleNumber || '',
        total,
        ...pipeCounts
      ];
    });
   
    console.log('Excel export header:', header);
    if (rows.length) console.log('Excel export first row sample:', rows[0]);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    
    const headerRow = worksheet.addRow(header);
    
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });

    const totalColIndex = header.indexOf('Total Pipes'); // 0-based

    
    rows.forEach((rowArr) => {
      const row = worksheet.addRow(rowArr);
      row.eachCell((cell, colNumber) => {
        
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
        };

        const colIdx0 = colNumber - 1; 
        const val = cell.value;

        
        if (colIdx0 === totalColIndex && typeof val === 'number' && val > 0) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD700' } };
        }

        
        if (colIdx0 > totalColIndex && typeof val === 'number' && val > 0) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
        }
      });
    });

    
    worksheet.columns.forEach((col) => {
      let maxLength = 10;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const value = cell.value ? String(cell.value) : '';
        if (value.length > maxLength) maxLength = value.length;
      });
      col.width = Math.min(Math.max(maxLength + 2, 12), 40);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=projects_report_${from || ''}_${to || ''}.xlsx`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to download Excel report' });
  }
};

export const createProject = async (req, res) => {
  try {
    const { predictionData, vehicleNumber } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Get today's date
    const today = moment().format('YYYYMMDD');
    const prefix = `PIPE-${today}`;

    // Count how many projects already created today
    const todayRegex = new RegExp(`^${prefix}-\\d{3}$`);
    const count = await Project.countDocuments({ name: todayRegex });

    // Generate name like PIPE-20250712-001
    const paddedCount = String(count + 1).padStart(3, '0');
    const generatedName = `${prefix}-${paddedCount}`;

    // Log it for debug
    console.log('Generated name:', generatedName);

    // Decide storage target and upload
    let storedPathOrUrl = null; // prefer Supabase object path for private buckets
    const originalExt = path.extname(image.originalname || '').toLowerCase() || '.jpg';
    const safeExt = originalExt.match(/^\.[a-z0-9]+$/i) ? originalExt : '.jpg';
    const objectPath = `projects/${moment().format('YYYY/MM/DD')}/${generatedName}${safeExt}`;

    if (uploadBufferToSupabase) {
      try {
        await uploadBufferToSupabase(objectPath, image.buffer, image.mimetype || 'application/octet-stream');
        // For private buckets, the public URL won't be accessible. Store the object path.
        storedPathOrUrl = objectPath;
      } catch (e) {
        console.error('Supabase upload failed:', e?.message);
      }
    }

    // Fallback: if Supabase not configured or upload failed, persist to local uploads folder
    if (!storedPathOrUrl) {
      try {
        const uploadsDir = path.resolve('uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
        const localName = `${generatedName}${safeExt}`;
        const localPath = path.join(uploadsDir, localName);
        fs.writeFileSync(localPath, image.buffer);
        storedPathOrUrl = localName; // legacy filename for local static serving
      } catch (e) {
        console.error('Local fallback write failed:', e?.message);
        return res.status(500).json({ error: 'Failed to store uploaded image' });
      }
    }

    const project = new Project({
      name: generatedName,
      imageUrl: storedPathOrUrl,
      predictionData: JSON.parse(predictionData),
      // If user is authenticated, associate; otherwise allow anonymous project
      user: req.user ? req.user._id : undefined,
      vehicleNumber: vehicleNumber || '',
    });

    console.log('Creating project with vehicleNumber:', vehicleNumber);
    await project.save();
    console.log('Saved project vehicleNumber:', project.vehicleNumber);

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 4, from, to } = req.query;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (from || to) {
      query.createdAt = {};
      if (from) {
        
        query.createdAt.$gte = moment(from).startOf('day').toDate();
      }
      if (to) {
       
        query.createdAt.$lte = moment(to).endOf('day').toDate();
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch paginated data
    const projects = await Project.find(query)
      .select("name createdAt productCount user")
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Total count for pagination
    const total = await Project.countDocuments(query);

    res.status(200).json({ data: projects, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('user', 'name');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Build absolute image URL.
    // Prefer an explicit BACKEND_URL env var (useful in production),
    // otherwise prefer the forwarded proto header (x-forwarded-proto) when behind a proxy,
    // and fall back to req.protocol.
    // Build image URL
    let imageUrl;
    const val = project.imageUrl || '';
    if (/^https?:\/\//i.test(val)) {
      // absolute URL (older records with public URL)
      imageUrl = val;
    } else if (val.includes('/') && !val.includes('..')) {
      // Looks like a Supabase object path; create signed URL for private bucket
      try {
        imageUrl = await getSignedUrl(val, 60 * 60 * 24 * 7); // 7 days
      } catch (e) {
        console.error('Failed to create signed URL:', e?.message);
      }
    }
    if (!imageUrl) {
      // Fallback to legacy local static serving
      const backendBase = (process.env.BACKEND_URL && process.env.BACKEND_URL.replace(/\/$/, '')) ||
        (() => {
          const forwardedProto = req.headers['x-forwarded-proto'];
          const proto = forwardedProto ? String(forwardedProto).split(',')[0] : req.protocol;
          return `${proto}://${req.get('host')}`;
        })();
      imageUrl = `${backendBase}/uploads/${val}`;
    }

    res.status(200).json({
      _id: project._id,
      name: project.name,
      createdAt: project.createdAt,
      predictionData: project.predictionData,
      productCount: project.productCount,
      user: project.user,
      vehicleNumber: project.vehicleNumber || '',
      imageUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const updatePredictionData = async (req, res) => {
  try {
    const { predictionData, productCount, vehicleNumber } = req.body;
    console.log('updatePredictionData body:', req.body);

    // Validate input
    if (!predictionData || !productCount) {
      return res.status(400).json({ error: 'predictionData and productCount are required' });
    }

    // Normalize productCount into [{ name, count }]
    const transformedProductCount = Object.keys(productCount).map(key => {
      const value = productCount[key];
      if (typeof value === 'object' && value !== null) {
        return {
          name: value.name || key,
          count: Number(value.count) || 0
        };
      }
      return {
        name: key,
        count: Number(value) || 0
      };
    });

    // Build update object
    const updateObj = {
      'predictionData.coordinates': predictionData,
      productCount: transformedProductCount
    };
    if (vehicleNumber !== undefined) {
      updateObj.vehicleNumber = vehicleNumber;
      console.log('Updating project', req.params.id, 'vehicleNumber ->', vehicleNumber);
    }

    // Find and update the project
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true } // return the updated document
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log('Post-update project.vehicleNumber:', project.vehicleNumber);

    res.status(200).json({
      message: 'Prediction data updated successfully',
      project,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update prediction data' });
  }
};

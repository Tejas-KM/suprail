// middlewares/upload.js
import multer from "multer";

// Use memory storage so we can forward to Supabase Storage (or proxy) without writing to disk
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

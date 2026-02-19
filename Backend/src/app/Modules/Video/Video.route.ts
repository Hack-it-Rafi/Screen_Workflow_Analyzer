import express from 'express';
import multer from 'multer';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { VIDEOValidation } from './Video.validation';
import { VIDEOControllers } from './Video.controller';

const router = express.Router();

// Use memory storage to avoid saving the file permanently
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    // Accept only MP4 videos
    if (file.mimetype === 'video/mp4') {
      cb(null, true);
    } else {
      cb(new Error('Only MP4 video files are allowed'));
    }
  },
});

router.post(
  '/create-video',
  auth('admin', 'user'),
  upload.single('video'),
  validateRequest(VIDEOValidation.addVIDEOSchema),
  VIDEOControllers.createVIDEO,
);

router.get('/:id', auth(), VIDEOControllers.getSingleVIDEO);
router.get('/', auth(), VIDEOControllers.getAllVIDEOs);
router.get(
  '/file/:fileName',
  // auth(),
  VIDEOControllers.getVIDEOFile,
);

export const VIDEORouters = router;

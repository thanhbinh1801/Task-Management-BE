import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { appEnv } from './app.config';

cloudinary.config({
  cloud_name: appEnv.CLOUDINARY_NAME,
  api_key: appEnv.CLOUDINARY_KEY,
  api_secret: appEnv.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'avatars',
    resource_type: 'image',
    format: file.mimetype.split('/')[1], // jpg, png, jpeg, svg...
    public_id: `avatars/${Date.now()}-${file.originalname}`,
  }),
});

export const upload = multer({ storage });

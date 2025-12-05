"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const app_config_1 = require("./app.config");
cloudinary_1.v2.config({
    cloud_name: app_config_1.appEnv.CLOUDINARY_NAME,
    api_key: app_config_1.appEnv.CLOUDINARY_KEY,
    api_secret: app_config_1.appEnv.CLOUDINARY_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => ({
        folder: 'avatars',
        resource_type: 'image',
        format: file.mimetype.split('/')[1], // jpg, png, jpeg, svg...
        public_id: `avatars/${Date.now()}-${file.originalname}`,
    }),
});
exports.upload = (0, multer_1.default)({ storage });

import nodemailer from 'nodemailer';
import { appEnv } from './app.config';

export const transporter = nodemailer.createTransport({
  host: appEnv.SMTP_HOST,
  port: appEnv.SMTP_PORT,
  auth: {
    user: appEnv.SMTP_USER,
    pass: appEnv.SMTP_PASS,
  },
});
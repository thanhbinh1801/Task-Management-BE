import { transporter, appEnv } from "@/configs";

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  await transporter.sendMail({
    from: appEnv.SMTP_USER,
    to,
    subject,
    html,
  });
};
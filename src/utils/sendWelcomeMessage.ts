import { Resend } from "resend";
import dotenv from "dotenv";
import { env } from "./env";
import { welcomeEmailTemplate } from "./emailTemplates";

dotenv.config();

const resend = new Resend(env.RESEND_API_KEY);

export const NEXT_URL = process.env.CLIENT_URL;

export async function sendWelcomeEmail(
  email: string,
  name: string,
  subject: string
) {
  return await resend.emails.send({
    from: "email@mail.steppingstonesapp.com",
    to: email,
    subject: subject,
    html: welcomeEmailTemplate(name),
  });
}

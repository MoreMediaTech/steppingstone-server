import * as zod from "zod";

export const envSchema = zod.object({
  NODE_ENV: zod.string().nonempty().default("development"),
  DATABASE_URL: zod.string().nonempty(),
  PORT: zod.string().nonempty().default("5001"),
  JWT_SECRET: zod.string().nonempty(),
  REFRESH_TOKEN_SECRET: zod.string().nonempty(),
  USER_EMAIL: zod.string().nonempty(),
  USER_PASSWORD: zod.string().nonempty(),
  CLOUDINARY_CLOUD_NAME: zod.string().nonempty(),
  CLOUDINARY_API_KEY: zod.string().nonempty(),
  CLOUDINARY_API_SECRET: zod.string().nonempty(),
  RECAPTCHA_SITE_KEY: zod.string().nonempty(),
  RESEND_API_KEY: zod.string().nonempty(),
});

export type Env = zod.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);

import * as z from "zod";

import { Prettify } from "./helpers";

export enum MessageTypes {
  INTERNAL_MESSAGE = "INTERNAL_MESSAGE",
  EXTERNAL_MESSAGE = "EXTERNAL_MESSAGE",
}

export const messageSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  subject: z.string(),
  company: z.string(),
  html: z.string(),
  message: z.string(),
  react: z.string(),
  type: z.nativeEnum(MessageTypes),
  createdAt: z.string(),
  updatedAt: z.string(),
  isRead: z.boolean(),
});

export const partialMessageSchema = messageSchema.partial();

export type PartialMessageSchemaProps = Prettify<
  z.infer<typeof partialMessageSchema>
>;

import * as z from "zod";
import { MessageType } from "@prisma/client";
import { Prettify } from "./helpers";



export const messageSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  subject: z.string(),
  company: z.string(),
  html: z.string(),
  message: z.string(),
  react: z.string(),
  text: z.string(),
  messageType: z.nativeEnum(MessageType),
  createdAt: z.string(),
  updatedAt: z.string(),
  isRead: z.boolean(),
});

export const partialMessageSchema = messageSchema.partial();

export type PartialMessageSchemaProps = Prettify<
  z.infer<typeof partialMessageSchema>
>;

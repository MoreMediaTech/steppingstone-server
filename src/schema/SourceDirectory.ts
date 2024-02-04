import * as z from "zod";
import { Prettify } from './helpers';
import { SourceDirectoryType } from "@prisma/client";



export const sourceDirectorySchema = z.object({
  id: z.string(),
  ids: z.array(z.string()).optional(),
  category: z.string(),
  description: z.string(),
  webLink: z.string(),
  canEmail: z.boolean(),
  type: z.nativeEnum(SourceDirectoryType),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const partialSourceDirectorySchema = sourceDirectorySchema.partial();

export type SourceDirectoryProps = Prettify<z.infer<typeof sourceDirectorySchema>>;

export type PartialSourceDirectoryProps = Prettify<z.infer<typeof partialSourceDirectorySchema>>;

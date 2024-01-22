import { Prettify } from './helpers';
import * as z from 'zod';

export const advertSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  isSubSection: z.boolean(),
  imageUrl: z.string(),
  imageFile: z.string().nullable().optional(),
  videoUrl: z.string(),
  videoTitle: z.string(),
  videoDescription: z
  .string(),
  author: z.string(),
  summary: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const partialAdvertSchema = advertSchema.partial();

export type AdvertSchemaProps = Prettify<z.infer<typeof advertSchema>>;

export type PartialAdvertSchemaProps = Prettify<
  z.infer<typeof partialAdvertSchema>
>;
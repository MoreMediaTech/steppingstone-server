import * as z from 'zod'

import { Prettify } from './helpers'
import {  partialSectionSchema, sectionSchema } from './Section'
import { localFeedContentSchema } from "./LocalFeedContent";

export const feedContentSchema = z.object({
  id: z.string({ required_error: "ID is required" }),
  ids: z.array(z.string()).optional(),
  name: z.string({ required_error: "Name is required" }),
  imageUrl: z
    .string({ required_error: "Image URL is required" })
    .url({ message: "Image URL is required" }),
  logoIcon: z
    .string({ required_error: "Logo Icon URL is required" })
    .url({ message: "Logo Icon URL is required" }),
  published: z.boolean(),
  viewCount: z.number(),
  isLive: z.boolean(),
  authorId: z.string({ required_error: "Author ID is required" }),
  createdAt: z.string({ required_error: "Created At is required" }),
  updatedAt: z.string({ required_error: "Updated At is required" }),
  
});


export const extendedFeedContentSchema = feedContentSchema.extend({
  aboveTheFoldContent: z.lazy(() => z.array(partialSectionSchema)),
  localFeedContent:z.lazy(() => z.array(localFeedContentSchema)),
  sections:z.lazy(() =>z.array(sectionSchema)),
});

export const partialFeedContentSchema = extendedFeedContentSchema.partial()

export type PartialFeedContentSchema = z.infer<typeof partialFeedContentSchema>

export type FeedContentSchemaProps = Prettify<z.infer<typeof extendedFeedContentSchema>>
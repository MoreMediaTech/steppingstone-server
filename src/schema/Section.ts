import { Prettify } from "./helpers";
import * as z from "zod";

import { SectionType } from "@prisma/client";
import { economicDataSchema } from "./LocalFeedContent";

export const sectionSchema = z.object({
  id: z.string({ required_error: "ID is required" }),
  ids: z.array(z.string()).optional(),
  name: z.string({ required_error: "Name is required" }),
  title: z.string({ required_error: "Title is required" }),
  content: z.string({ required_error: "Content is required" }),
  isLive: z.boolean(),
  isSubSection: z.boolean(),
  logoIcon: z
    .string({ required_error: "Logo Icon is required" })
    .url({ message: "Logo icon must be a URL" }),
  imageUrl: z.string({ required_error: "Image URL is required" }),
  videoUrl: z.string({ required_error: "Video URL is required" }),
  videoTitle: z.string({ required_error: "Video Title is required" }),
  videoDescription: z.string({ required_error: "Logo Icon is required" }),
  author: z.string({ required_error: "Author is required" }),
  summary: z.string({ required_error: "Summary is required" }),
  isEconomicData: z.boolean(),
  economicDataWidgets: z.array(economicDataSchema),
  type: z.nativeEnum(SectionType, { required_error: "Type is required" }),
  parentId: z.string({ required_error: "Parent ID is required" }).optional(),
  localFeedContentId: z.string({ required_error: "Local Feed Content ID is required" }).optional(),
  feedContentId: z.string({ required_error: "County ID is required" }).optional(),
  createdAt: z.string({ required_error: "Created At is required" }),
  updatedAt: z.string({ required_error: "Updated At is required" }),
});

export const partialSectionSchema = sectionSchema.partial();

export type SectionSchemaProps = Prettify<z.infer<typeof sectionSchema>>;

export type PartialSectionSchemaProps = Prettify<
  z.infer<typeof partialSectionSchema>
>;

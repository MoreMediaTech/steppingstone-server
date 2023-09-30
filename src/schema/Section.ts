import { Prettify } from "./helpers";
import * as z from "zod";

import { partialCountySchema } from "./County";

export const sectionSchema = z.object({
  id: z.string().nonempty({ message: "ID is required" }),
  ids: z.array(z.string()).optional(),
  name: z.string().nonempty({ message: "Name is required" }),
  title: z.string().nonempty({ message: "Title is required" }),
  content: z.string().nonempty({ message: "Content is required" }),
  isLive: z.boolean(),
  isSubSection: z.boolean(),
  logoIcon: z
    .string()
    .url({ message: "Logo icon must be a URL" })
    .nonempty({ message: "Logo Icon is required" }),
  imageUrl: z.string().nonempty({ message: "Image URL is required" }),
  videoUrl: z.string().nonempty({ message: "Video URL is required" }),
  videoTitle: z.string().nonempty({ message: "Video Title is required" }),
  videoDescription: z
    .string()
    .nonempty({ message: "Video Description is required" }),
  author: z.string().nonempty({ message: "Author is required" }),
  summary: z.string().nonempty({ message: "Summary is required" }),
  createdAt: z.string().nonempty({ message: "Created At is required" }),
  updatedAt: z.string().nonempty({ message: "Updated At is required" }),
});

export const partialSectionSchema = sectionSchema
  .extend({
    county: partialCountySchema,
    subsections: z.array(sectionSchema),
  })
  .partial();

export type SectionSchemaProps = Prettify<z.infer<typeof sectionSchema>>;

export type PartialSectionSchemaProps = Prettify<
  z.infer<typeof partialSectionSchema>
>;

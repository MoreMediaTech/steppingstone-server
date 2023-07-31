import * as zod from "zod";
import validator from "validator";

export const sectionContentSchema = zod.object({
  id: zod.string().optional(),
  ids: zod.array(zod.string()).optional(),
  title: zod.string(),
  name: zod.string(),
  content: zod.string(),
  countyId: zod.string().optional(),
  imageFile: zod.string().optional(),
  author: zod.string(),
  summary: zod.string(),
  isLive: zod.boolean(),
  videoUrl: zod.string(),
  videoTitle: zod.string(),
  videoDescription: zod.string(),
  isSubSection: zod.boolean().optional(),
  isSubSubSection: zod.boolean().optional(),
  imageUrl: zod.string(),
});

export type SectionContentProps = zod.infer<typeof sectionContentSchema>;

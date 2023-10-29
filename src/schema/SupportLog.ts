import * as z from "zod";
import { Prettify } from "./helpers";
import { Status } from "@prisma/client";

export const supportLogSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  technicianId: z.string().uuid(),
  technicianName: z.string(),
  attention: z.boolean(),
  message: z.string(),
  status: z.nativeEnum(Status),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const partialSupportLogSchema = supportLogSchema.partial();

export type SupportLogSchemaProps = Prettify<z.infer<typeof supportLogSchema>>;

export type PartialSupportLogSchemaProps = Prettify<
  z.infer<typeof partialSupportLogSchema>
>;

export const validateSupportLog = (data: any) => {
  return partialSupportLogSchema.safeParse(data);
};

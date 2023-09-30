import * as z from 'zod'

import { Prettify } from './helpers'
import {  sectionSchema } from './Section'
import { districtSchema } from "./District";

export const countySchema = z.object({
  id: z.string().nonempty({ message: 'ID is required' }),
  name: z.string().nonempty({ message: 'Name is required' }),
  imageUrl: z
    .string()
    .url({ message: 'Image URL is required' })
    .nonempty({ message: 'Image URL is required' }),
  logoIcon: z
    .string()
    .url({ message: 'Logo Icon URL is required' })
    .nonempty({ message: 'Logo Icon URL is required' }),
  published: z.boolean(),
  viewCount: z.number(),
  isLive: z.boolean(),
  createdAt: z.string().nonempty({ message: 'Created At is required' }),
  updatedAt: z.string().nonempty({ message: 'Updated At is required' }),
})


export const countyLepNewsWelcomeSchema = countySchema.extend({
  welcome: z.lazy(() => sectionSchema),
  lep: z.lazy(() => sectionSchema),
  news: z.lazy(() => sectionSchema),
  districts:z.lazy(() => z.array(districtSchema)),
  sections:z.lazy(() =>z.array(sectionSchema)),
});

export const partialCountySchema = countyLepNewsWelcomeSchema.partial()

export type PartialCountySchemaProps = z.infer<typeof partialCountySchema>

export type CountySchemaProps = Prettify<z.infer<typeof countyLepNewsWelcomeSchema>>
import { z } from 'zod';

export const ImageSchema = z.object({
  fileName: z.string(),
  caption: z.optional(z.string()),
});

export const RentalSchema = z.object({
  name: z.string().min(1, 'Please enter a name for the rental.'),
  description: z.string().min(1, 'Please enter a description for the rental.'),
  keyFacts: z
    .array(
      z.object({
        fact: z.string(),
      }),
    )
    .min(1),
  price: z.object({
    oneDay: z
      .number()
      .or(z.string().regex(/\d+/).transform(Number))
      .refine((n) => n >= 0),
    threeDay: z
      .number()
      .or(z.string().regex(/\d+/).transform(Number))
      .refine((n) => n >= 0),
    sevenDay: z
      .number()
      .or(z.string().regex(/\d+/).transform(Number))
      .refine((n) => n >= 0),
  }),
  images: z.array(ImageSchema).min(1, 'At least one image is required.'),
});

export const UpsertRentalSchema = RentalSchema.extend({
  location: z.object({ city: z.string(), state: z.string() }),
});

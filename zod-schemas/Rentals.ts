import { z } from 'zod';

export const ImageSchema = z.object({
  fileName: z.string(),
  caption: z.optional(z.string()),
});

const PriceSchema = z
  .number()
  .or(z.string().regex(/\d+/).transform(Number))
  .refine((n) => n >= 0);

export const RentalSchema = z.object({
  name: z.string().min(1, 'Please enter a name for the rental.'),
  description: z.string().min(1, 'Please enter a description for the rental.'),
  types: z
    .array(
      z.object({
        type: z.string(),
      }),
    )
    .min(1, 'At least one type is required'),
  keyFacts: z
    .array(
      z.object({
        fact: z.string(),
      }),
    )
    .min(1),
  price: z.object({
    oneDay: PriceSchema,
    threeDay: PriceSchema,
    sevenDay: PriceSchema,
  }),
  images: z.array(ImageSchema).min(0, 'At least one image is required.'),
});

export const UpsertRentalSchema = RentalSchema.extend({
  location: z.object({ city: z.string(), state: z.string() }),
});

export const RentalOrderSchema = z.object({
  rentalIds: z.array(z.string()),
});

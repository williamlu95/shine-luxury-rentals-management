import { z } from 'zod';
import { ImageSchema, RentalSchema } from '../zod-schemas/Rentals';

export type RentalModel = {
  _id?: string;
  updatedAt?: string;
  location: { city: string; state: string };
} & z.input<typeof RentalSchema>;

export type ImageType = z.input<typeof ImageSchema>;

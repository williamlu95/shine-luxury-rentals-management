import { Schema, model, models } from 'mongoose';

export const DEFAULT_RANGE = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

export const SEATING = Object.freeze({
  NONE: 'none',
  SOME: 'some',
  PLENTY: 'plenty',
});

const rentalSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    keyFacts: [{ fact: String }],
    price: {
      oneDay: Number,
      threeDay: Number,
      sevenDay: Number,
    },
    images: [
      {
        fileName: String,
        caption: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Rental = models.rental || model('rental', rentalSchema);
export default Rental;

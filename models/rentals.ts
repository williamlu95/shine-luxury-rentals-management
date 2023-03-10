import { Schema, model, models } from 'mongoose';

const rentalSchema = new Schema(
  {
    location: { city: String, state: String },
    order: { type: Number, default: 0 },
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

import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { NextApiRequest, NextApiResponse } from 'next';
import { USER_ROLE } from '../../../constants/users';
import { s3Client } from '../../../lib/s3';
import { withSessionRoute } from '../../../lib/withSession';
import middleware from '../../../middleware';
import Rental from '../../../models/rentals';
import { ImageType } from '../../../types/rentals';
import { UpsertRentalSchema } from '../../../zod-schemas/Rentals';

const removeImages = async (oldImages: ImageType[], newImages: ImageType[]) => {
  const imagesToKeep = new Set(newImages.map((image) => image.fileName));
  const imagesToRemovePromises = oldImages
    .filter((image) => !imagesToKeep.has(image.fileName))
    .map((image) =>
      s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.SPACE_NAME,
          Key: image.fileName,
        }),
      ),
    );

  try {
    await Promise.all(imagesToRemovePromises);
  } catch (err) {
    console.log('Failed to remove all images: ', err);
  }
};

const updateRental = async (req: NextApiRequest, res: NextApiResponse) => {
  const { rentalId } = req.query;
  const { name, description, keyFacts, price, images, location } = req.body;
  const rental = await Rental.findById(rentalId);

  if (!rental) {
    return res.status(400).send('Request is not valid');
  }

  await removeImages(rental.images as ImageType[], images);
  rental.location = location;
  rental.name = name;
  rental.description = description;
  rental.keyFacts = keyFacts || [];
  rental.food = price;
  rental.images = images;

  await rental.save();
  res.status(200).send(rental);
};

const deleteRental = async (req: NextApiRequest, res: NextApiResponse) => {
  const { rentalId } = req.query;
  const rental = await Rental.findById(rentalId);

  if (!rental) {
    res.send({ ok: true });
    return;
  }
  await removeImages(rental.images, []);
  await rental.delete();
  res.send({ ok: true });
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return middleware({
        req,
        res,
        callback: updateRental,
        schema: UpsertRentalSchema,
        roles: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
      });
    case 'DELETE':
      return middleware({
        req,
        res,
        callback: deleteRental,
        roles: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
      });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);

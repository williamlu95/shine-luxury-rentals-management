import type { NextApiRequest, NextApiResponse } from 'next';
import { USER_ROLE } from '../../../../constants/users';
import { withSessionRoute } from '../../../../lib/withSession';
import middleware from '../../../../middleware';
import Rental from '../../../../models/rentals';
import { RentalOrderSchema } from '../../../../zod-schemas/Rentals';

const updateOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { rentalIds } = req.body;

  const rentalOrdersToUpdate = rentalIds.map(
    (rentalId: string, order: number) =>
      Rental.updateOne({ _id: rentalId }, { order }),
  );

  await Promise.all(rentalOrdersToUpdate);
  res.status(204).send('No Content');
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return middleware({
        req,
        res,
        callback: updateOrder,
        schema: RentalOrderSchema,
        roles: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
      });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);

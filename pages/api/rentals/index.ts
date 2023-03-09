import type { NextApiRequest, NextApiResponse } from 'next';
import { USER_ROLE } from '../../../constants/users';
import { withSessionRoute } from '../../../lib/withSession';
import middleware from '../../../middleware';
import Rental from '../../../models/rentals';
import { RentalSchema } from '../../../zod-schemas/Rentals';

const createRental = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('req.body :>> ', req.body);
  const rental = await Rental.create(req.body);
  res.status(201).send(rental);
};

const getRentals = async (_req: NextApiRequest, res: NextApiResponse) => {
  const rental = await Rental.find({});
  res.status(201).send(rental);
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return middleware({
        req,
        res,
        callback: createRental,
        schema: RentalSchema,
        roles: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
      });
    case 'GET':
      return middleware({
        req,
        res,
        callback: getRentals,
      });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);

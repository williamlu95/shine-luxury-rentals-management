import type { NextApiRequest, NextApiResponse } from 'next';
import { AnyZodObject } from 'zod';
import dbConnect from '../lib/mongoose';
import validateRoles from './role-validation';
import parseBody from './schema-validation';

type MiddlewareParams = {
  req: NextApiRequest;
  res: NextApiResponse;
  callback: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  schema?: AnyZodObject;
  roles?: string[];
};

const connectToDatabase = async (res: NextApiResponse) => {
  try {
    await dbConnect();
  } catch (err) {
    res.status(500).send('Internal Server Error.');
    throw err;
  }
};

export default async function middleware({
  req,
  res,
  callback,
  schema,
  roles = [],
}: MiddlewareParams) {
  try {
    await connectToDatabase(res);
    await parseBody({ req, res, schema });
    validateRoles({ req, res, roles });
    return callback(req, res);
  } catch (err) {
    console.error(err);
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { AnyZodObject } from 'zod';

type ParseBodyParams = {
  req: NextApiRequest;
  res: NextApiResponse;
  schema?: AnyZodObject;
};

export default async function parseBody({ req, res, schema }: ParseBodyParams) {
  if (!schema) {
    return undefined;
  }

  const parsedBody = await schema.safeParseAsync(req.body);

  if (!parsedBody.success) {
    res.status(400).send('Request is not valid');
    throw new Error(parsedBody.error.toString());
  }

  req.body = parsedBody.data;
}

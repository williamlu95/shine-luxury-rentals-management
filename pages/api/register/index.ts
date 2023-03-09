import { hash } from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { withSessionRoute } from '../../../lib/withSession';
import middleware from '../../../middleware';
import User from '../../../models/user';

const RegisterUserSchema = z.object({
  familyName: z.string(),
  givenName: z.string(),
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(8)
    .transform((password) => hash(password, 10)),
});

const registerUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const userToCreate = req.body;

  if (await User.exists({ email: userToCreate.email })) {
    return res.status(400).send('Request is not valid');
  }

  const createdUser = await User.create(userToCreate);

  req.session.user = {
    id: createdUser.id,
    email: createdUser.email,
    role: createdUser.role,
  };

  await req.session.save();
  res.status(200).send('OK');
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return middleware({
        req,
        res,
        callback: registerUser,
        schema: RegisterUserSchema,
      });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);

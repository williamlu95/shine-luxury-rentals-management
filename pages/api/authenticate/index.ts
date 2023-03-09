import { compare } from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { withSessionRoute } from '../../../lib/withSession';
import middleware from '../../../middleware';
import User from '../../../models/user';

const CreateUserSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
  password: z.string(),
});

const authenticate = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  const savedUser = await User.findOne({ email });

  if (!savedUser || !(await compare(password, savedUser.password))) {
    res.status(400).send('Request is not valid');
    return;
  }

  req.session.user = {
    id: savedUser.id,
    email: savedUser.email,
    role: savedUser.role,
  };

  await req.session.save();
  res.send({ ok: true });
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return middleware({
        req,
        res,
        callback: authenticate,
        schema: CreateUserSchema,
      });
    default:
      return res.status(405).send(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);

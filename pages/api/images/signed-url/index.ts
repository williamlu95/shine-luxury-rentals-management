import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { NextApiRequest, NextApiResponse } from 'next';
import { USER_ROLE } from '../../../../constants/users';
import { s3Client } from '../../../../lib/s3';
import { withSessionRoute } from '../../../../lib/withSession';
import middleware from '../../../../middleware';

const getS3SignedUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const { contentType, key } = req.query;

  if (!contentType || !key) {
    res.status(400).send('Bad Request');
    return;
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.SPACE_NAME,
    Key: String(key),
    ACL: 'public-read',
    ContentType: String(contentType),
  });

  try {
    const url = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 15 * 60,
    });

    res.status(200).send(url);
    return;
  } catch (err) {
    console.error('Getting signed url failed: ', err);
    res.status(500).send('Internal Server Error');
    return;
  }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return middleware({
        req,
        res,
        callback: getS3SignedUrl,
        roles: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
      });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);

import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { id } = req.query;

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid group ID' });
      }

      const group = await prisma.group.findUnique({
        where: { id },
        include: {
          responses: {
            orderBy: { created_at: 'asc' },
          },
        },
      });

      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      return res.json({
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
          date: group.date.toISOString().split('T')[0],
          created_at: group.created_at,
          updated_at: group.updated_at,
        },
        responses: group.responses.map(response => ({
          id: response.id,
          user_name: response.user_name,
          is_available: response.is_available,
          message: response.message,
          created_at: response.created_at,
          updated_at: response.updated_at,
        })),
      });
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error fetching group:', error);
    return res.status(500).json({ error: 'Failed to fetch group' });
  }
}
import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createResponseSchema = z.object({
  userName: z.string().min(1).max(255),
  isAvailable: z.boolean(),
  message: z.string().optional(),
});

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
    const { id } = req.query;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid group ID' });
    }

    if (req.method === 'POST') {
      // Add/update user response
      const validatedData = createResponseSchema.parse(req.body);

      // Check if group exists
      const group = await prisma.group.findUnique({
        where: { id },
      });

      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      // Use upsert to handle both create and update cases
      const response = await prisma.response.upsert({
        where: {
          group_id_user_name: {
            group_id: id,
            user_name: validatedData.userName,
          },
        },
        update: {
          is_available: validatedData.isAvailable,
          message: validatedData.message,
        },
        create: {
          group_id: id,
          user_name: validatedData.userName,
          is_available: validatedData.isAvailable,
          message: validatedData.message,
        },
      });

      return res.json({
        success: true,
        response: {
          id: response.id,
          user_name: response.user_name,
          is_available: response.is_available,
          message: response.message,
          created_at: response.created_at,
          updated_at: response.updated_at,
        },
      });
    } else if (req.method === 'GET') {
      // Get all responses for a group
      const group = await prisma.group.findUnique({
        where: { id },
      });

      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      const responses = await prisma.response.findMany({
        where: { group_id: id },
        orderBy: { created_at: 'asc' },
      });

      return res.json(responses.map(response => ({
        id: response.id,
        user_name: response.user_name,
        is_available: response.is_available,
        message: response.message,
        created_at: response.created_at,
        updated_at: response.updated_at,
      })));
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in responses API:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      return res.status(500).json({ error: 'Failed to process response' });
    }
  }
}
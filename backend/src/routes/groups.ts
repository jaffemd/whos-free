import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createGroupSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
});

const createResponseSchema = z.object({
  userName: z.string().min(1).max(255),
  isAvailable: z.boolean(),
  message: z.string().optional(),
});

// POST /api/groups - Create new group
router.post('/', async (req, res) => {
  try {
    const validatedData = createGroupSchema.parse(req.body);
    
    const group = await prisma.group.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        date: new Date(validatedData.date),
      },
    });

    res.json({
      id: group.id,
      name: group.name,
      description: group.description,
      date: group.date.toISOString().split('T')[0], // Return as YYYY-MM-DD
    });
  } catch (error) {
    console.error('Error creating group:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create group' });
    }
  }
});

// GET /api/groups/:id - Get group details with all responses
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

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

    res.json({
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
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

// POST /api/groups/:id/responses - Add/update user response
router.post('/:id/responses', async (req, res) => {
  try {
    const { id } = req.params;
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

    res.json({
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
  } catch (error) {
    console.error('Error adding response:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to add response' });
    }
  }
});

// GET /api/groups/:id/responses - Get all responses for a group
router.get('/:id/responses', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if group exists
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

    res.json(responses.map(response => ({
      id: response.id,
      user_name: response.user_name,
      is_available: response.is_available,
      message: response.message,
      created_at: response.created_at,
      updated_at: response.updated_at,
    })));
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

export default router;
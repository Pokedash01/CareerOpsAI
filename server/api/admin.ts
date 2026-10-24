import type { Request, Response, NextFunction } from 'express';
import { resolveAuthUser, PRIMARY_USER_ID } from '../server/auth.js';
import { prisma } from '../server/dbClient.js';
import { ActivityType } from '@prisma/client';

// -----------------------------------------------------------------
// Middleware – require admin privileges (primary admin for now)
// -----------------------------------------------------------------
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authUser = await resolveAuthUser(req);
  if (!authUser) return res.status(401).json({ error: 'Unauthenticated' });
  if (authUser.id !== PRIMARY_USER_ID) {
    return res.status(403).json({ error: 'Admin only' });
  }
  // attach for downstream handlers if needed
  (req as any).adminUser = authUser;
  next();
}

// -----------------------------------------------------------------
// GET /api/admin/users – list all users (including soft‑deleted status)
// -----------------------------------------------------------------
import { getAllUsersWithStats } from '../auth.js';

export async function adminListUsers(req: Request, res: Response) {
  try {
    // Combine Prisma‑persisted accounts with in‑memory / relational users.
    // getAllUsersWithStats merges dbUsers, users and their partitions, matching the UI’s expectations.
    const users = getAllUsersWithStats();
    return res.json({ users });
  } catch (e: any) {
    console.error('[adminListUsers]', e);
    return res.status(500).json({ error: 'Server error' });
  }
}

// -----------------------------------------------------------------
// PATCH /api/admin/users/:id – enable or disable account (soft)
// -----------------------------------------------------------------
export async function adminToggleUser(req: Request, res: Response) {
  const { id } = req.params;
  const { enable } = req.body; // boolean
  if (id === PRIMARY_USER_ID) {
    return res.status(400).json({ error: "Cannot disable primary admin" });
  }
  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !!enable, deletedAt: enable ? null : undefined },
    });
    return res.json({ success: true, user: updated });
  } catch (e: any) {
    console.error('[adminToggleUser]', e);
    return res.status(500).json({ error: 'Server error' });
  }
}

// -----------------------------------------------------------------
// DELETE /api/admin/users/:id – hard purge
// -----------------------------------------------------------------
export async function adminDeleteUser(req: Request, res: Response) {
  const { id } = req.params;
  if (id === PRIMARY_USER_ID) {
    return res.status(400).json({ error: "Cannot delete primary admin" });
  }
  try {
    await prisma.user.delete({ where: { id } });
    return res.json({ success: true });
  } catch (e: any) {
    console.error('[adminDeleteUser]', e);
    return res.status(500).json({ error: 'Server error' });
  }
}

// -----------------------------------------------------------------
// GET /api/admin/users/:id/activity – recent activity log
// -----------------------------------------------------------------
export async function adminUserActivity(req: Request, res: Response) {
  const { id } = req.params;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  try {
    const activities = await prisma.userActivity.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return res.json({ activities });
  } catch (e: any) {
    console.error('[adminUserActivity]', e);
    return res.status(500).json({ error: 'Server error' });
  }
}

// -----------------------------------------------------------------
// Helper – log an activity (call from anywhere in the server)
// -----------------------------------------------------------------
export async function logUserActivity(userId: string, type: ActivityType, payload?: any) {
  await prisma.userActivity.create({
    data: {
      userId,
      type,
      payload,
    },
  });
}

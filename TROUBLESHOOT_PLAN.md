# Troubleshooting Report: System Connection Gaps

## Current State Diagnosis

### 1. **Database Migration Incomplete**
**Problem**: Relational JSON database files exist but are not fully populated

```
✓ data/db/users.json: {} (EMPTY - No users migrated)
✓ data/db/jobs.json: 1420 lines (~30 jobs partially loaded)
✗ data/db/sessions.json: Missing or empty
✗ data/db/user_jobs.json: Missing or empty
```

**Root Cause**: `initRelationalDatabase()` checks for partial data and won't migrate when:
- `users.json` is empty OR
- `jobs.json` has some data but not all

The master `careerops_store.json` (335KB) contains the full 49 jobs and user dictionary, but the migration is being blocked.

### 2. **User Model Schema Incompatibility**
**Problem**: Prisma schema has `isActive` and `deletedAt` fields, but:
- In-memory `dbUsers` doesn't track these fields
- Admin panel updates `prisma.user.isActive` but doesn't sync to `dbUsers`
- `getAllUsersWithStats()` misses the soft-deleted status for JSON users

### 3. **Job Count source Mismatch**
**Problem**: Where does "49 jobs" come from in admin vs dashboard?

| Component | Current Source |
|-----------|----------------|
| Admin `/api/admin/jobs` | ❌ Not implemented |
| Dashboard | Uses partition's `jobListings` (per-user view) |
| Relational DB | `dbJobs` master catalog |

The central `dbJobs` correctly has all jobs, but UI doesn't fetch from there.

### 4. **Admin Visibility Not Enforced**
**Problem**: Admin panel button visible to anyone, but `adminListUsers` only blocks API access—no frontend guard

**Evidence**:
```typescript
// server/api/admin.ts - Backend check exists
if (authUser.id !== PRIMARY_USER_ID) {
  return res.status(403).json({ error: 'Admin only' });
}
```

But frontend component has no role check.

### 5. **No Seeded Users in Re:lation DB**
**Problem**: Default users (kb270102, demo) only exist in:
- In-memory `users` object (localStorage persistence)
- NOT in `data/db/users.json`

When server restarts/instantiates, `users` gets seeded but `dbUsers` stays empty, causing the migration block.

## Priority Fixes Required

### P0 (Critical): Fix Database Migration
1. Force migration by clearing existing `data/db/*.json` files
2. Run `initRelationalDatabase(careerops_store.json)` to load users + jobs
3. Verify `data/db/users.json` is no longer empty

### P1 (High): Add isActive Tracking
1. Add `isActive: boolean` to `UserAccountRecord` interface
2. Add `deletedAt: string | null` to `UserAccountRecord`
3. Update `getAllUsersWithStats()` to include isActive status
4. Admin toggle endpoint must update both Prisma and dbUsers

### P2 (Medium): Job Count Sync
1. Create `/api/admin/jobs` endpoint using `dbJobs` master catalog
2. Update frontend to use this endpoint
3. Ensure jobs table is consistent across users

### P3 (Medium): Admin Visibility Guards
1. Add `isAdmin: boolean` to UserAccountRecord
2. Check in frontend for `is_primary_admin`
3. Hide admin panel for non-admin users

### P4 (Low): Database Constants
1. Add `USER_ACTIVE = true/false` constant
2. Add `CURRENT_DB_VERSION = '2.0'`
3. Document migration requirements
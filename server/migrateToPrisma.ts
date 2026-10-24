// server/migrateToPrisma.ts
import { PrismaClient } from '@prisma/client';
import {
  dbUsers,
  dbJobs,
  dbUserJobs,
  dbUserProfiles,
  dbUserSettings,
  dbUserWorkflows,
  dbUserRegistries,
} from './database.js';
import prisma from './dbClient.js';

/** Load legacy JSON DB into memory */
async function loadLegacyJsonIntoMemory() {
  const { initRelationalDatabase } = await import('./database.js');
  initRelationalDatabase();
}

/** Main migration */
export async function migrateJsonToPrisma() {
  console.log('[Migration] Loading legacy JSON data into memory...');
  await loadLegacyJsonIntoMemory();

  console.log('[Migration] Starting JSON → Prisma migration...');
  try {
    // Users
    console.log(`[Migration] Migrating ${Object.keys(dbUsers).length} users…`);
    for (const [userId, u] of Object.entries(dbUsers)) {
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          email: u.email,
          fullName: u.full_name,
          passwordHash: u.password_hash,
          salt: u.salt,
          avatarUrl: u.avatar_url,
          telegramChatId: u.telegram_chat_id,
          lastLoginAt: u.last_login_at ? new Date(u.last_login_at) : null,
        },
        create: {
          id: userId,
          email: u.email,
          fullName: u.full_name,
          passwordHash: u.password_hash,
          salt: u.salt,
          avatarUrl: u.avatar_url,
          telegramChatId: u.telegram_chat_id,
          createdAt: u.created_at ? new Date(u.created_at) : new Date(),
          lastLoginAt: u.last_login_at ? new Date(u.last_login_at) : null,
        },
      });
    }

    // Jobs
    console.log(`[Migration] Migrating ${Object.keys(dbJobs).length} jobs…`);
    for (const [jobId, j] of Object.entries(dbJobs)) {
      await prisma.job.upsert({
        where: { id: jobId },
        update: {
          title: j.title,
          companyName: j.company_name,
          location: j.location,
          salaryMinLpa: j.salary_range_lpa ? j.salary_range_lpa[0] : null,
          salaryMaxLpa: j.salary_range_lpa ? j.salary_range_lpa[1] : null,
          salaryIsEstimated: j.salary_is_estimated ?? false,
          salarySource: j.salary_source,
          experienceMinYears: j.experience_range_years ? j.experience_range_years[0] : null,
          experienceMaxYears: j.experience_range_years ? j.experience_range_years[1] : null,
          experienceIsInferred: j.experience_is_inferred ?? false,
          description: j.description,
          applyLink: j.apply_link,
          atsSource: j.ats_source,
          isDirectPosting: j.is_direct_posting ?? false,
          verificationStatus: j.verification_status,
          verificationNotes: j.verification_notes,
          verifiedAt: j.verified_at ? new Date(j.verified_at) : null,
          postedDate: j.posted_date ? new Date(j.posted_date) : null,
          postedDaysAgo: j.posted_days_ago,
        },
        create: {
          id: jobId,
          title: j.title,
          companyName: j.company_name,
          location: j.location,
          salaryMinLpa: j.salary_range_lpa ? j.salary_range_lpa[0] : null,
          salaryMaxLpa: j.salary_range_lpa ? j.salary_range_lpa[1] : null,
          salaryIsEstimated: j.salary_is_estimated ?? false,
          salarySource: j.salary_source,
          experienceMinYears: j.experience_range_years ? j.experience_range_years[0] : null,
          experienceMaxYears: j.experience_range_years ? j.experience_range_years[1] : null,
          experienceIsInferred: j.experience_is_inferred ?? false,
          description: j.description,
          applyLink: j.apply_link,
          atsSource: j.ats_source,
          isDirectPosting: j.is_direct_posting ?? false,
          verificationStatus: j.verification_status,
          verificationNotes: j.verification_notes,
          verifiedAt: j.verified_at ? new Date(j.verified_at) : null,
          postedDate: j.posted_date ? new Date(j.posted_date) : null,
          postedDaysAgo: j.posted_days_ago,
          discoveredAt: j.discovered_at ? new Date(j.discovered_at) : new Date(),
        },
      });
    }

    // User‑Job relations
    console.log(`[Migration] Migrating ${Object.keys(dbUserJobs).length} user‑job relations…`);
    for (const [relId, rel] of Object.entries(dbUserJobs)) {
      const userExists = await prisma.user.findUnique({ where: { id: rel.user_id } });
      const jobExists = await prisma.job.findUnique({ where: { id: rel.job_id } });
      if (!userExists || !jobExists) continue;

      await prisma.userJobRelation.upsert({
        where: { userId_jobId: { userId: rel.user_id, jobId: rel.job_id } },
        update: {
          status: rel.status,
          fit: rel.fit ? (rel.fit as any) : undefined,
          tailored: rel.tailored ? (rel.tailored as any) : undefined,
          tailoredResume: rel.tailored_resume,
          coverLetter: rel.cover_letter,
          notes: rel.notes,
          notifiedTelegram: rel.notified_telegram,
          seen: rel.seen,
          deleted: rel.deleted,
          appliedAt: rel.applied_at ? new Date(rel.applied_at) : null,
        },
        create: {
          id: rel.id,
          userId: rel.user_id,
          jobId: rel.job_id,
          status: rel.status,
          fit: rel.fit ? (rel.fit as any) : undefined,
          tailored: rel.tailored ? (rel.tailored as any) : undefined,
          tailoredResume: rel.tailored_resume,
          coverLetter: rel.cover_letter,
          notes: rel.notes,
          notifiedTelegram: rel.notified_telegram,
          seen: rel.seen,
          deleted: rel.deleted,
          appliedAt: rel.applied_at ? new Date(rel.applied_at) : null,
        },
      });
    }

    // Profiles
    console.log(`[Migration] Migrating ${Object.keys(dbUserProfiles).length} profiles…`);
    for (const [userId, p] of Object.entries(dbUserProfiles)) {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) continue;

      await prisma.profile.upsert({
        where: { userId },
        update: {
          fullName: p.full_name,
          email: p.contact?.email || '',
          phone: p.contact?.phone || '',
          location: p.contact?.location || '',
          links: p.contact?.links || '',
          totalYearsExp: p.total_years_experience || 0,
          seniorityTier: p.seniority_tier || 'Entry',
          summary: p.summary,
          targetRoles: p.target_roles || [],
          antiTargets: p.anti_targets || [],
          preferredLocations: p.preferred_locations || [],
          salaryMinLpa: p.salary_expectation?.min_lpa,
          salaryMaxLpa: p.salary_expectation?.max_lpa,
          parsedFromDoc: p.parsed_from_document ? (p.parsed_from_document as any) : undefined,
        },
        create: {
          userId,
          fullName: p.full_name,
          email: p.contact?.email || '',
          phone: p.contact?.phone || '',
          location: p.contact?.location || '',
          links: p.contact?.links || '',
          totalYearsExp: p.total_years_experience || 0,
          seniorityTier: p.seniority_tier || 'Entry',
          summary: p.summary,
          targetRoles: p.target_roles || [],
          antiTargets: p.anti_targets || [],
          preferredLocations: p.preferred_locations || [],
          salaryMinLpa: p.salary_expectation?.min_lpa,
          salaryMaxLpa: p.salary_expectation?.max_lpa,
          parsedFromDoc: p.parsed_from_document ? (p.parsed_from_document as any) : undefined,
        },
      });
    }

    // Settings
    console.log(`[Migration] Migrating ${Object.keys(dbUserSettings).length} settings…`);
    for (const [userId, s] of Object.entries(dbUserSettings)) {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) continue;

      await prisma.settings.upsert({
        where: { userId },
        update: {
          minMatchScore: s.min_match_score ?? 75,
          telegramConfigured: s.telegram_configured ?? false,
          telegramChatId: s.telegram_chat_id,
          telegramBotToken: s.telegram_bot_token,
          telegramBotName: s.telegram_bot_name,
          telegramCustomHeader: s.telegram_custom_header,
          telegramIncludeSalary: s.telegram_include_salary ?? true,
          telegramIncludeSkillGap: s.telegram_include_skill_gap ?? true,
          telegramIncludeApplyLink: s.telegram_include_apply_link ?? true,
          seenTtlDays: s.seen_ttl_days ?? 14,
          workflowEnabled: s.workflow_enabled ?? true,
          workflowIntervalHours: s.workflow_interval_hours ?? 4,
          autoNotifyTelegram: s.auto_notify_telegram ?? false,
          serpapiKey: s.serpapi_key,
        },
        create: {
          userId,
          minMatchScore: s.min_match_score ?? 75,
          telegramConfigured: s.telegram_configured ?? false,
          telegramChatId: s.telegram_chat_id,
          telegramBotToken: s.telegram_bot_token,
          telegramBotName: s.telegram_bot_name,
          telegramCustomHeader: s.telegram_custom_header,
          telegramIncludeSalary: s.telegram_include_salary ?? true,
          telegramIncludeSkillGap: s.telegram_include_skill_gap ?? true,
          telegramIncludeApplyLink: s.telegram_include_apply_link ?? true,
          seenTtlDays: s.seen_ttl_days ?? 14,
          workflowEnabled: s.workflow_enabled ?? true,
          workflowIntervalHours: s.workflow_interval_hours ?? 4,
          autoNotifyTelegram: s.auto_notify_telegram ?? false,
          serpapiKey: s.serpapi_key,
        },
      });
    }

    console.log('[Migration] ✅ All data migrated to PostgreSQL!');
  } catch (err: any) {
    console.error('[Migration] ❌ Error during migration:', err);
  } finally {
    await prisma.$disconnect();
  }
}

// Run immediately when this file is executed with tsx or ts-node
migrateJsonToPrisma();

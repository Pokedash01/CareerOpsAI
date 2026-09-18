import { JobListing, UserProfile, AppSettings } from '../types.js';

export const DEFAULT_TELEGRAM_BOT_TOKEN = '8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas';
export const DEFAULT_TELEGRAM_CHAT_ID = '1368681854';

export function escapeTelegramHtml(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatTelegramMessageHtml(
  target: JobListing,
  candidateName: string = 'Candidate',
  settings?: Partial<AppSettings>
): string {
  const candFirst = escapeTelegramHtml(candidateName.split(' ')[0] || 'Candidate');
  const fitScore = target.fit?.match_score || 85;
  const expReq =
    target.fit?.detected_experience ||
    (target.experience_range_years
      ? `${target.experience_range_years[0]}-${target.experience_range_years[1]} Years`
      : 'Not specified');
  const salRange =
    target.fit?.salary_range ||
    (target.salary_range_lpa
      ? `₹${target.salary_range_lpa[0]} - ₹${target.salary_range_lpa[1]} LPA`
      : 'Not specified');
  const gaps = target.fit?.skills_gap || 'None';

  const customHeader = settings?.telegram_custom_header;
  const header = customHeader || `🎯 <b>New High-Fit Role Matched for ${candFirst}! (CareerOps AI)</b>`;

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app';

  const resumeLink = `${baseUrl}/?tab=tailor&jobId=${encodeURIComponent(target.id)}&type=resume`;
  const coverLetterLink = `${baseUrl}/?tab=tailor&jobId=${encodeURIComponent(target.id)}&type=cover_letter`;

  const roleEsc = escapeTelegramHtml(target.title);
  const compEsc = escapeTelegramHtml(target.company_name);
  const locEsc = escapeTelegramHtml(target.location);
  const expEsc = escapeTelegramHtml(expReq);
  const salEsc = escapeTelegramHtml(salRange);
  const gapsEsc = escapeTelegramHtml(gaps);

  let htmlMessage =
    `${header}\n\n` +
    `📌 <b>Role:</b> ${roleEsc}\n` +
    `🏢 <b>Company:</b> ${compEsc}\n` +
    `📍 <b>Location:</b> ${locEsc}\n` +
    `⏳ <b>Experience Required:</b> ${expEsc}\n`;

  if (settings?.telegram_include_salary !== false) {
    htmlMessage += `💰 <b>Salary Range:</b> ${salEsc}\n`;
  }

  htmlMessage += `📊 <b>Fit Score:</b> ${fitScore}%\n`;

  if (settings?.telegram_include_skill_gap !== false) {
    htmlMessage += `⚠️ <b>Skill Gap:</b> ${gapsEsc}\n`;
  }

  htmlMessage +=
    `\n` +
    `📄 <a href="${resumeLink}"><b>Tailored ATS Resume</b></a>\n` +
    `✉️ <a href="${coverLetterLink}"><b>Tailored Cover Letter</b></a>\n`;

  if (settings?.telegram_include_apply_link !== false && target.apply_link) {
    htmlMessage += `🚀 <a href="${target.apply_link}"><b>Apply Directly on Portal</b></a>\n`;
  }

  htmlMessage += `\n<i>Automated workflow dispatch via CareerOps-AI.</i>`;
  return htmlMessage;
}

export interface TelegramDispatchResult {
  delivered: boolean;
  simulated?: boolean;
  error?: string;
  chat_id?: string;
  note?: string;
  telegram_response?: any;
}

/**
 * Sends a message directly to the Telegram Bot API via CORS from browser or server.
 */
export async function sendTelegramDirect(
  token: string,
  chatId: string,
  htmlText: string
): Promise<TelegramDispatchResult> {
  const effectiveToken = (token || '').trim() || DEFAULT_TELEGRAM_BOT_TOKEN;
  const effectiveChat = (chatId || '').trim() || DEFAULT_TELEGRAM_CHAT_ID;

  if (!effectiveToken) {
    return {
      delivered: false,
      simulated: true,
      chat_id: effectiveChat,
      error: 'No Telegram bot token configured.',
    };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${effectiveToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: effectiveChat,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        link_preview_options: { is_disabled: true },
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      const desc = data?.description || `HTTP ${res.status}: Failed to dispatch alert to Telegram.`;
      console.error('[Telegram Direct] Dispatch rejected by Telegram:', data || desc);
      return {
        delivered: false,
        error: desc,
        chat_id: effectiveChat,
        telegram_response: data,
      };
    }

    console.log('[Telegram Direct] Alert successfully delivered to Telegram chat:', effectiveChat);
    return {
      delivered: true,
      simulated: false,
      chat_id: effectiveChat,
      telegram_response: data,
    };
  } catch (err: any) {
    console.error('[Telegram Direct] Fetch exception:', err);
    return {
      delivered: false,
      error: err.message || 'Network exception when reaching Telegram Bot API.',
      chat_id: effectiveChat,
    };
  }
}

/**
 * Universal job alert dispatcher:
 * 1. Sequentially attempts reachable backend endpoints with automatic cross-origin failover.
 * 2. Directly passes backend error diagnostics without discarding them.
 * 3. Falls back to direct Telegram API only if backends are completely inaccessible,
 *    gracefully handling browser CORS / ISP restrictions.
 */
export async function dispatchJobNotification(params: {
  job: JobListing;
  candidateName?: string;
  settings?: AppSettings;
  customChatId?: string;
  customBotToken?: string;
}): Promise<TelegramDispatchResult> {
  const { job, candidateName = 'Candidate', settings, customChatId, customBotToken } = params;

  const botToken = (customBotToken || settings?.telegram_bot_token || '').trim() || DEFAULT_TELEGRAM_BOT_TOKEN;
  const chatId = (customChatId || settings?.telegram_chat_id || '').trim() || DEFAULT_TELEGRAM_CHAT_ID;
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : undefined;

  const candidateEndpoints = [
    '/api/telegram/notify',
    'https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app/api/telegram/notify',
    'https://ais-pre-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app/api/telegram/notify',
  ];

  // Filter endpoints so we don't redundantly call the same URL
  const uniqueEndpoints: string[] = [];
  for (const ep of candidateEndpoints) {
    if (ep.startsWith('http')) {
      if (currentOrigin && ep.startsWith(currentOrigin)) continue;
    }
    if (!uniqueEndpoints.includes(ep)) uniqueEndpoints.push(ep);
  }

  let lastBackendError: string | null = null;

  for (const endpoint of uniqueEndpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: job.id,
          job: {
            id: job.id,
            title: job.title,
            company_name: job.company_name,
            location: job.location,
            description: job.description?.slice(0, 1500),
            fit: job.fit,
            apply_link: job.apply_link,
            salary_range_lpa: job.salary_range_lpa,
            experience_range_years: job.experience_range_years,
          },
          custom_chat_id: chatId,
          custom_bot_token: botToken,
          settings,
          baseUrl: currentOrigin,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json().catch(() => null);

      if (res.ok) {
        if (data?.delivered || data?.success) {
          return {
            delivered: true,
            simulated: !!data.simulated,
            chat_id: chatId,
            telegram_response: data.telegram_response || data.result,
          };
        }
        if (data?.error) {
          return {
            delivered: false,
            error: data.error,
            chat_id: chatId,
          };
        }
      } else {
        lastBackendError = data?.error || `Server returned HTTP ${res.status}`;
      }
    } catch (err: any) {
      console.warn(`[Telegram Dispatch] Endpoint ${endpoint} note:`, err?.message || err);
      lastBackendError = err?.message || 'Connection could not be established';
    }
  }

  // 2. Direct browser dispatch fallback for pure offline or standalone client environments
  const html = formatTelegramMessageHtml(job, candidateName, settings);
  const directResult = await sendTelegramDirect(botToken, chatId, html);

  if (!directResult.delivered) {
    const isFetchFail = directResult.error?.toLowerCase().includes('failed to fetch') ||
      directResult.error?.toLowerCase().includes('network');
    if (isFetchFail) {
      return {
        ...directResult,
        error: `Telegram notification could not be delivered. Please ensure the backend is running and that bot token & chat ID (${chatId}) are authorized.`,
      };
    }
  }

  return directResult;
}

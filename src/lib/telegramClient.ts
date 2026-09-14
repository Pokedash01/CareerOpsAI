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
    htmlMessage += `🚀 <a href="${target.apply_link}"><b>Apply Link</b></a>\n`;
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
 * 1. Attempts the backend endpoint (/api/telegram/notify) with complete payload.
 * 2. If the backend fails, times out, or returns simulated/undelivered (common in serverless/Vercel),
 *    it directly contacts the Telegram Bot API to guarantee real-time delivery.
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

  // 1. First attempt backend endpoint
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('/api/telegram/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: job.id,
        job,
        custom_chat_id: chatId,
        custom_bot_token: botToken,
        settings,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.delivered) {
        return {
          delivered: true,
          simulated: false,
          chat_id: chatId,
          telegram_response: data.telegram_response || data.result,
        };
      }
    }
  } catch (backendErr) {
    console.warn('[Telegram Dispatch] Backend notification failed or timed out, executing direct dispatch fallback:', backendErr);
  }

  // 2. Direct browser dispatch fallback for Vercel / serverless deployments
  const html = formatTelegramMessageHtml(job, candidateName, settings);
  const directResult = await sendTelegramDirect(botToken, chatId, html);
  return directResult;
}

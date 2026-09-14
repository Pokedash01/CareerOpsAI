export default async function handler(req: any, res: any) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { id, custom_chat_id, custom_bot_token, job, settings } = body;

    const DEFAULT_TELEGRAM_BOT_TOKEN = '8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas';
    const DEFAULT_TELEGRAM_CHAT_ID = '1368681854';

    const chatId =
      (custom_chat_id || process.env.TELEGRAM_CHAT_ID || settings?.telegram_chat_id || '').trim() ||
      DEFAULT_TELEGRAM_CHAT_ID;
    const botToken =
      (custom_bot_token || process.env.TELEGRAM_BOT_TOKEN || settings?.telegram_bot_token || '').trim() ||
      DEFAULT_TELEGRAM_BOT_TOKEN;

    const target = job;
    if (!target) {
      return res.status(400).json({ error: 'Job payload required for Vercel dispatch.' });
    }

    const escapeHtml = (str: any) =>
      String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

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

    const header = settings?.telegram_custom_header || `🎯 <b>New High-Fit Role Matched! (CareerOps AI)</b>`;

    const host = req.headers['host'] || '';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl =
      body.baseUrl ||
      (req.headers['origin'] ? String(req.headers['origin']) : host ? `${proto}://${host}` : 'https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app');

    const resumeLink = `${baseUrl}/?tab=tailor&jobId=${encodeURIComponent(target.id)}&type=resume`;
    const coverLetterLink = `${baseUrl}/?tab=tailor&jobId=${encodeURIComponent(target.id)}&type=cover_letter`;

    let htmlMessage =
      `${header}\n\n` +
      `📌 <b>Role:</b> ${escapeHtml(target.title)}\n` +
      `🏢 <b>Company:</b> ${escapeHtml(target.company_name)}\n` +
      `📍 <b>Location:</b> ${escapeHtml(target.location)}\n` +
      `⏳ <b>Experience Required:</b> ${escapeHtml(expReq)}\n`;

    if (settings?.telegram_include_salary !== false) {
      htmlMessage += `💰 <b>Salary Range:</b> ${escapeHtml(salRange)}\n`;
    }

    htmlMessage += `📊 <b>Fit Score:</b> ${fitScore}%\n`;

    if (settings?.telegram_include_skill_gap !== false) {
      htmlMessage += `⚠️ <b>Skill Gap:</b> ${escapeHtml(gaps)}\n`;
    }

    htmlMessage +=
      `\n` +
      `📄 <a href="${resumeLink}"><b>Tailored ATS Resume</b></a>\n` +
      `✉️ <a href="${coverLetterLink}"><b>Tailored Cover Letter</b></a>\n`;

    if (settings?.telegram_include_apply_link !== false && target.apply_link) {
      htmlMessage += `🚀 <a href="${target.apply_link}"><b>Apply Directly on Portal</b></a>\n`;
    }

    htmlMessage += `\n<i>Automated workflow dispatch via CareerOps-AI.</i>`;

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        link_preview_options: { is_disabled: true },
      }),
    });

    const tgData = await tgRes.json().catch(() => null);

    if (!tgRes.ok || !tgData?.ok) {
      return res.status(200).json({
        success: false,
        delivered: false,
        error: tgData?.description || `Telegram Error (${tgRes.status})`,
        telegram_response: tgData,
      });
    }

    return res.status(200).json({
      success: true,
      delivered: true,
      simulated: false,
      chat_id: chatId,
      telegram_response: tgData,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      delivered: false,
      error: err.message || 'Internal error dispatching Telegram alert',
    });
  }
}

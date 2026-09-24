import nodemailer from "nodemailer";
function createTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587", 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return null;
}
function buildPasswordResetHtml(name, email, code, minutes) {
  const firstName = name.trim().split(" ")[0] || "Candidate";
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CareerOps AI Password Reset Code</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #e2e8f0; margin: 0; padding: 24px; }
    .card { max-width: 520px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); }
    .header { background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #06b6d4 100%); padding: 24px 28px; text-align: left; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; }
    .header p { margin: 4px 0 0 0; font-size: 13px; color: #dbeafe; }
    .content { padding: 28px; }
    .greeting { font-size: 15px; font-weight: 600; color: #f8fafc; margin-bottom: 12px; }
    .lead { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
    .code-box { background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .code-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 600; margin-bottom: 8px; }
    .code-value { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 0.25em; color: #38bdf8; text-shadow: 0 0 12px rgba(56, 189, 248, 0.3); }
    .code-exp { font-size: 12px; color: #94a3b8; margin-top: 8px; }
    .security-notice { background-color: rgba(245, 158, 11, 0.08); border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 6px; font-size: 12px; color: #fcd34d; margin: 24px 0 12px; line-height: 1.5; }
    .footer { border-top: 1px solid #1f2937; padding: 20px 28px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>CareerOps AI</h1>
      <p>Autonomous Career Engineering & Candidate Workspace</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${firstName},</div>
      <div class="lead">
        We received a request to reset the password for your CareerOps AI candidate account (<code>${email}</code>).
      </div>

      <div class="code-box">
        <div class="code-label">Verification Code</div>
        <div class="code-value">${code}</div>
        <div class="code-exp">Expires in ${minutes} minutes</div>
      </div>

      <div class="lead" style="font-size: 13px;">
        Enter this 6-digit code in the CareerOps AI password reset window to choose a new password and immediately restore access to your private workspace partition.
      </div>

      <div class="security-notice">
        <strong>Security Notice:</strong> If you did not request a password reset, you can safely ignore this email. Your account credentials remain secure and no changes were made.
      </div>
    </div>
    <div class="footer">
      This is an automated security notification from CareerOps AI Platform.<br>
      \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} CareerOps AI. All rights reserved.
    </div>
  </div>
</body>
</html>
  `.trim();
}
async function sendPasswordResetEmail(options) {
  const { toEmail, recipientName, code, expiresInMinutes = 15 } = options;
  const cleanEmail = toEmail.toLowerCase().trim();
  const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_FROM || "CareerOps Security <security@careerops.ai>";
  const subject = `\u{1F510} ${code} is your CareerOps AI password reset verification code`;
  const htmlContent = buildPasswordResetHtml(recipientName, cleanEmail, code, expiresInMinutes);
  const textContent = `CareerOps AI Password Reset Request

Hello ${recipientName || "Candidate"},

We received a request to reset the password for your account (${cleanEmail}).

Your 6-Digit Verification Code: ${code}

This code will expire in ${expiresInMinutes} minutes.

Enter this code in the password reset window to set a new password.

If you did not request this, please ignore this email.`;
  if (process.env.RESEND_API_KEY) {
    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: fromAddress.includes("@") ? fromAddress : "CareerOps Security <onboarding@resend.dev>",
          to: [cleanEmail],
          subject,
          html: htmlContent,
          text: textContent
        })
      });
      const data = await resendRes.json();
      if (resendRes.ok && data?.id) {
        console.log(`[Mailer:Resend] Password reset code dispatched to ${cleanEmail}, id: ${data.id}`);
        return { success: true, provider: "resend", messageId: data.id };
      }
      console.warn(`[Mailer:Resend] Failed:`, data);
    } catch (err) {
      console.warn(`[Mailer:Resend] Error:`, err?.message);
    }
  }
  if (process.env.SENDGRID_API_KEY) {
    try {
      const sgRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: cleanEmail }] }],
          from: { email: process.env.SENDGRID_FROM || "security@careerops.ai", name: "CareerOps Security" },
          subject,
          content: [
            { type: "text/plain", value: textContent },
            { type: "text/html", value: htmlContent }
          ]
        })
      });
      if (sgRes.status >= 200 && sgRes.status < 300) {
        console.log(`[Mailer:SendGrid] Password reset code dispatched to ${cleanEmail}`);
        return { success: true, provider: "sendgrid" };
      }
    } catch (err) {
      console.warn(`[Mailer:SendGrid] Error:`, err?.message);
    }
  }
  const transporter = createTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: cleanEmail,
        subject,
        text: textContent,
        html: htmlContent
      });
      console.log(`[Mailer:SMTP] Password reset code dispatched to ${cleanEmail}, messageId: ${info.messageId}`);
      return { success: true, provider: "smtp", messageId: info.messageId };
    } catch (err) {
      console.warn(`[Mailer:SMTP] Error sending via SMTP:`, err?.message);
    }
  }
  try {
    const testAccount = await nodemailer.createTestAccount();
    const etherealTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    const info = await etherealTransporter.sendMail({
      from: "CareerOps AI Security <security@careerops.ai>",
      to: cleanEmail,
      subject,
      text: textContent,
      html: htmlContent
    });
    const previewUrl = nodemailer.getTestMessageUrl(info) || void 0;
    console.log(`[Mailer:Ethereal] Dispatched reset email to ${cleanEmail}`);
    if (previewUrl) {
      console.log(`[Mailer:Ethereal] Preview URL: ${previewUrl}`);
    }
    return {
      success: true,
      provider: "ethereal",
      messageId: info.messageId,
      previewUrl
    };
  } catch (err) {
    console.warn(`[Mailer:Ethereal] Fallback error:`, err?.message);
  }
  console.log(`[Mailer:Local] \u{1F510} Password reset verification code for ${cleanEmail} is: ${code} (expires in ${expiresInMinutes}m)`);
  return {
    success: true,
    provider: "fallback_log"
  };
}
export {
  sendPasswordResetEmail
};

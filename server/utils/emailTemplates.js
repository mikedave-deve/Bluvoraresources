// utils/emailTemplates.js
// ─────────────────────────────────────────────────────────────
// Reusable HTML email templates.
// Each function returns a { subject, html, text } object so
// controllers can pass it straight to transporter.sendMail().
// ─────────────────────────────────────────────────────────────

'use strict'

// ── Shared design tokens ──────────────────────────────────────
const BRAND_BLUE   = '#2563eb'
const BRAND_DARK   = '#0a1628'
const BRAND_LIGHT  = '#eff6ff'
const TEXT_DARK    = '#0f172a'
const TEXT_MUTED   = '#64748b'
const BORDER_COLOR = '#e2e8f0'

/**
 * Wraps content in a consistent branded shell.
 * @param {string} bodyContent  - Inner HTML content
 * @param {string} previewText  - Short preview shown in email clients
 */
function shellTemplate(bodyContent, previewText = '') {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Bluvora Resources</title>
  <!--[if !mso]><!-->
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #f8faff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    a { color: ${BRAND_BLUE}; }
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 16px !important; }
      .email-card    { border-radius: 12px !important; padding: 24px !important; }
    }
  </style>
  <!--<![endif]-->
</head>
<body style="background-color:#f8faff; margin:0; padding:0;">

  <!-- Preview text (hidden, shown in inbox snippet) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${previewText}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         class="email-wrapper" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;" cellpadding="0" cellspacing="0">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_DARK};border-radius:16px 16px 0 0;padding:28px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <!-- Logo text mark -->
                    <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                      Bluvora<span style="color:#60a5fa;">.</span>
                    </span>
                    <span style="display:block;font-size:10px;color:rgba(255,255,255,0.45);
                                 letter-spacing:3px;text-transform:uppercase;margin-top:2px;">
                      Resources
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body card -->
          <tr>
            <td class="email-card"
                style="background-color:#ffffff;padding:36px;border-left:1px solid ${BORDER_COLOR};
                       border-right:1px solid ${BORDER_COLOR};">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${BRAND_LIGHT};border:1px solid ${BORDER_COLOR};
                       border-top:none;border-radius:0 0 16px 16px;padding:20px 36px;
                       text-align:center;">
              <p style="font-size:11px;color:${TEXT_MUTED};line-height:1.6;margin:0;">
                This email was generated automatically by the Bluvora Resources website.<br/>
                Please do not reply directly to this message.<br/>
                <a href="https://bluvoraresources.com" style="color:${BRAND_BLUE};">
                  bluvoraresources.com
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * Renders a labelled data row used in both templates.
 * @param {string} label
 * @param {string} value
 * @param {boolean} [isLink]  - Wrap value in <a> if it's email/phone
 */
function dataRow(label, value, isLink = false) {
  const displayValue = isLink
    ? `<a href="${value}" style="color:${BRAND_BLUE};text-decoration:none;">${value.replace(/^mailto:|^tel:/, '')}</a>`
    : `<span style="color:${TEXT_DARK};">${value}</span>`

  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER_COLOR};vertical-align:top;
                 width:38%;font-size:12px;font-weight:600;color:${TEXT_MUTED};
                 text-transform:uppercase;letter-spacing:0.06em;padding-right:16px;">
        ${label}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER_COLOR};vertical-align:top;
                 font-size:14px;line-height:1.55;color:${TEXT_DARK};">
        ${displayValue}
      </td>
    </tr>
  `
}

// ═══════════════════════════════════════════════════════════════
// 1. CONTACT FORM EMAIL
// ═══════════════════════════════════════════════════════════════

/**
 * Generates the email sent to the Bluvora inbox when someone
 * submits the Contact Us form.
 *
 * @param {object} data
 * @param {string} data.firstName
 * @param {string} data.lastName
 * @param {string} data.email
 * @param {string} [data.phone]
 * @param {string} [data.subject]
 * @param {string} [data.inquiryType]
 * @param {string} data.message
 * @returns {{ subject: string, html: string, text: string }}
 */
function contactEmailTemplate(data) {
  const {
    firstName, lastName, email,
    phone = 'Not provided',
    subject = 'Not specified',
    inquiryType = 'Not specified',
    message,
  } = data

  const fullName    = `${firstName} ${lastName}`
  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  const bodyContent = `
    <!-- Badge -->
    <div style="display:inline-block;background-color:${BRAND_LIGHT};color:${BRAND_BLUE};
                font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
                padding:5px 14px;border-radius:99px;margin-bottom:20px;">
      New Contact Inquiry
    </div>

    <h1 style="font-size:22px;font-weight:700;color:${TEXT_DARK};letter-spacing:-0.4px;
               line-height:1.2;margin-bottom:6px;">
      Message from ${fullName}
    </h1>
    <p style="font-size:13px;color:${TEXT_MUTED};margin-bottom:28px;">
      Received on ${submittedAt}
    </p>

    <!-- Data table -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="margin-bottom:28px;">
      ${dataRow('Full Name',    fullName)}
      ${dataRow('Email',        `mailto:${email}`, true)}
      ${dataRow('Phone',        phone === 'Not provided' ? phone : `tel:${phone.replace(/\D/g,'')}`, phone !== 'Not provided')}
      ${dataRow('Inquiry Type', inquiryType)}
      ${dataRow('Subject',      subject)}
    </table>

    <!-- Message block -->
    <div style="background-color:${BRAND_LIGHT};border-left:4px solid ${BRAND_BLUE};
                border-radius:0 8px 8px 0;padding:18px 20px;margin-bottom:28px;">
      <p style="font-size:11px;font-weight:600;color:${BRAND_BLUE};letter-spacing:0.08em;
                text-transform:uppercase;margin-bottom:10px;">
        Message
      </p>
      <p style="font-size:14px;color:${TEXT_DARK};line-height:1.7;white-space:pre-wrap;margin:0;">
        ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </p>
    </div>

    <!-- CTA button -->
    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}"
       style="display:inline-block;background-color:${BRAND_BLUE};color:#ffffff;
              font-size:14px;font-weight:600;text-decoration:none;
              padding:12px 28px;border-radius:99px;">
      Reply to ${firstName} →
    </a>
  `

  // Plain-text fallback
  const text = [
    'NEW CONTACT INQUIRY — BLUVORA RESOURCES',
    '─'.repeat(44),
    `Name:         ${fullName}`,
    `Email:        ${email}`,
    `Phone:        ${phone}`,
    `Inquiry Type: ${inquiryType}`,
    `Subject:      ${subject}`,
    `Received:     ${submittedAt}`,
    '',
    'MESSAGE:',
    message,
    '',
    '─'.repeat(44),
    'Bluvora Resources | bluvoraresources.com',
  ].join('\n')

  return {
    subject: `[Bluvora] New inquiry from ${fullName} — ${inquiryType}`,
    html:    shellTemplate(bodyContent, `New message from ${fullName}: ${message.substring(0, 90)}…`),
    text,
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. RESUME SUBMISSION EMAIL
// ═══════════════════════════════════════════════════════════════

/**
 * Generates the email sent to the recruiting team when a
 * candidate submits their resume via the Submit Resume form.
 *
 * @param {object} data
 * @param {string} data.firstName
 * @param {string} data.lastName
 * @param {string} data.email
 * @param {string} [data.phone]
 * @param {string} [data.category]   - Industry / job category
 * @param {string} [data.message]    - Cover note
 * @param {string} data.fileName     - Original uploaded filename
 * @param {number} data.fileSize     - File size in bytes
 * @returns {{ subject: string, html: string, text: string }}
 */
function resumeEmailTemplate(data) {
  const {
    firstName, lastName, email,
    phone    = 'Not provided',
    category = 'Not specified',
    message  = '',
    fileName,
    fileSize,
  } = data

  const fullName    = `${firstName} ${lastName}`
  const fileSizeKB  = (fileSize / 1024).toFixed(1)
  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  const bodyContent = `
    <!-- Badge -->
    <div style="display:inline-block;background-color:#ecfdf5;color:#059669;
                font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
                padding:5px 14px;border-radius:99px;margin-bottom:20px;">
      New Resume Submission
    </div>

    <h1 style="font-size:22px;font-weight:700;color:${TEXT_DARK};letter-spacing:-0.4px;
               line-height:1.2;margin-bottom:6px;">
      Resume from ${fullName}
    </h1>
    <p style="font-size:13px;color:${TEXT_MUTED};margin-bottom:28px;">
      Submitted on ${submittedAt}
    </p>

    <!-- Candidate info table -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="margin-bottom:28px;">
      ${dataRow('Full Name',    fullName)}
      ${dataRow('Email',        `mailto:${email}`, true)}
      ${dataRow('Phone',        phone === 'Not provided' ? phone : `tel:${phone.replace(/\D/g,'')}`, phone !== 'Not provided')}
      ${dataRow('Industry',     category)}
    </table>

    <!-- Attachment notice -->
    <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;
                padding:16px 20px;margin-bottom:28px;display:flex;align-items:center;">
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="vertical-align:middle;padding-right:14px;">
            <!-- Paperclip icon placeholder -->
            <span style="font-size:22px;">📎</span>
          </td>
          <td style="vertical-align:middle;">
            <p style="font-size:13px;font-weight:600;color:#166534;margin:0;">
              ${fileName}
            </p>
            <p style="font-size:11px;color:#4ade80;margin:4px 0 0;">
              PDF Attachment · ${fileSizeKB} KB
            </p>
          </td>
        </tr>
      </table>
    </div>

    ${message ? `
    <!-- Cover note -->
    <div style="background-color:${BRAND_LIGHT};border-left:4px solid ${BRAND_BLUE};
                border-radius:0 8px 8px 0;padding:18px 20px;margin-bottom:28px;">
      <p style="font-size:11px;font-weight:600;color:${BRAND_BLUE};letter-spacing:0.08em;
                text-transform:uppercase;margin-bottom:10px;">
        Cover Note
      </p>
      <p style="font-size:14px;color:${TEXT_DARK};line-height:1.7;white-space:pre-wrap;margin:0;">
        ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </p>
    </div>
    ` : ''}

    <!-- CTA button -->
    <a href="mailto:${email}?subject=Re: Your application to Bluvora Resources"
       style="display:inline-block;background-color:${BRAND_BLUE};color:#ffffff;
              font-size:14px;font-weight:600;text-decoration:none;
              padding:12px 28px;border-radius:99px;">
      Contact ${firstName} →
    </a>
  `

  const text = [
    'NEW RESUME SUBMISSION — BLUVORA RESOURCES',
    '─'.repeat(44),
    `Name:      ${fullName}`,
    `Email:     ${email}`,
    `Phone:     ${phone}`,
    `Industry:  ${category}`,
    `Submitted: ${submittedAt}`,
    `File:      ${fileName} (${fileSizeKB} KB) — see attachment`,
    '',
    message ? `COVER NOTE:\n${message}` : '(No cover note provided)',
    '',
    '─'.repeat(44),
    'Bluvora Resources | bluvoraresources.com',
  ].join('\n')

  return {
    subject: `[Bluvora] New resume — ${fullName} (${category})`,
    html:    shellTemplate(bodyContent, `${fullName} submitted their resume for ${category} roles.`),
    text,
  }
}

// ═══════════════════════════════════════════════════════════════
// 3. CANDIDATE CONFIRMATION EMAIL
//    Sent back to the applicant so they know we received their resume.
// ═══════════════════════════════════════════════════════════════

/**
 * @param {object} data
 * @param {string} data.firstName
 * @param {string} data.email
 * @returns {{ subject: string, html: string, text: string }}
 */
function candidateConfirmationTemplate(data) {
  const { firstName } = data

  const bodyContent = `
    <h1 style="font-size:24px;font-weight:700;color:${TEXT_DARK};letter-spacing:-0.4px;
               line-height:1.2;margin-bottom:16px;">
      Thanks, ${firstName}! We've received your resume.
    </h1>

    <p style="font-size:15px;color:${TEXT_MUTED};line-height:1.7;margin-bottom:20px;">
      Thank you for submitting your resume to <strong style="color:${TEXT_DARK};">Bluvora Resources</strong>.
      Our recruiting team personally reviews every application, and we'll be in
      touch within <strong>2–3 business days</strong> if your profile is a match.
    </p>

    <p style="font-size:15px;color:${TEXT_MUTED};line-height:1.7;margin-bottom:28px;">
      In the meantime, browse our current openings — new roles are added daily.
    </p>

    <a href="https://bluvoraresources.com/jobs"
       style="display:inline-block;background-color:${BRAND_BLUE};color:#ffffff;
              font-size:14px;font-weight:600;text-decoration:none;
              padding:12px 28px;border-radius:99px;margin-bottom:32px;">
      Browse Open Roles →
    </a>

    <hr style="border:none;border-top:1px solid ${BORDER_COLOR};margin:28px 0;" />

    <p style="font-size:13px;color:${TEXT_MUTED};line-height:1.6;">
      Questions? Reach us anytime at
      <a href="mailto:info@bluvoraresources.com" style="color:${BRAND_BLUE};">
        info@bluvoraresources.com
      </a>
      or call <a href="tel:+18005550199" style="color:${BRAND_BLUE};">+1 (800) 555-0199</a>.
    </p>
  `

  const text = [
    `Hi ${firstName},`,
    '',
    "Thanks for submitting your resume to Bluvora Resources! We've received your application.",
    '',
    'Our recruiting team personally reviews every submission. We\'ll be in touch within',
    '2–3 business days if your profile is a match for one of our current openings.',
    '',
    'Browse open roles: https://bluvoraresources.com/jobs',
    '',
    'Questions? Email us: info@bluvoraresources.com | Call: +1 (800) 555-0199',
    '',
    'Best regards,',
    'The Bluvora Resources Team',
  ].join('\n')

  return {
    subject: `We received your resume — Bluvora Resources`,
    html:    shellTemplate(bodyContent, `We received your resume, ${firstName}. Here's what happens next.`),
    text,
  }
}

module.exports = {
  contactEmailTemplate,
  resumeEmailTemplate,
  candidateConfirmationTemplate,
}

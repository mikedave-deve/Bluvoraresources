'use strict'

const nodemailer = require('nodemailer')

// ── Build transporter from .env ───────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),

  // true  = SSL wraps the connection immediately (port 465) ← Hostinger default
  // false = plain connection then STARTTLS upgrade (port 587)
  secure: process.env.SMTP_SECURE !== 'false', // defaults to true

  auth: {
    user: process.env.EMAIL_USER, // e.g. info@bluvoraresources.com
    pass: process.env.EMAIL_PASS, // your Hostinger mailbox password
  },
  
  tls: {
    rejectUnauthorized: false, // ✅ THIS FIXES YOUR ERROR
  },

  // TLS options — Hostinger uses a valid certificate so we keep this strict.
  // Only set rejectUnauthorized: false if you're on a self-signed cert setup.
  

  // Generous timeouts for resume PDF attachments
  connectionTimeout: 15_000, // 15 s
  greetingTimeout:   10_000, // 10 s
  socketTimeout:     20_000, // 20 s
})

/**
 * Verify the SMTP connection at server startup.
 * Produces a clear, actionable error message for the most
 * common Hostinger authentication failures.
 */
async function verifyMailer() {
  try {
    await transporter.verify()
    console.log('✅  SMTP connection verified — Hostinger mailer is ready')
    console.log(`    Sending as: ${process.env.EMAIL_USER}`)
  } catch (err) {
    console.error('⚠️  SMTP verification failed:', err.message)
    console.error('')
    console.error('   Hostinger troubleshooting checklist:')
    console.error('   1. EMAIL_USER  → must be your FULL email e.g. info@yourdomain.com')
    console.error('   2. EMAIL_PASS  → the mailbox password set in hPanel → Emails → Manage')
    console.error('                    (NOT your hPanel login password)')
    console.error('   3. SMTP_HOST   → smtp.hostinger.com')
    console.error('   4. SMTP_PORT   → 465  and  SMTP_SECURE=true')
    console.error('                 OR 587  and  SMTP_SECURE=false')
    console.error('   5. Make sure the email account exists in hPanel → Emails')
    console.error('')
    console.error('   Server will continue running — fix .env and restart.')
  }
}

module.exports = { transporter, verifyMailer }

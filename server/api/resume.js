// api/resume.js
// ─────────────────────────────────────────────────────────────
// Vercel serverless function — handles POST /api/resume
//
// MUST export `config` with bodyParser: false so Vercel does NOT
// pre-parse the request body. If Vercel parses it first, Multer
// receives an already-consumed stream and req.file is undefined.
// ─────────────────────────────────────────────────────────────
'use strict'

require('dotenv').config()

const { handleCors }              = require('../utils/cors')
const { validate }                = require('../utils/validate')
const { runMulter }               = require('../middleware/parseMultipart')
const { getTransporter }          = require('../config/mailer')
const {
  resumeEmailTemplate,
  confirmationEmailTemplate,
} = require('../utils/emailTemplates')

// ── CRITICAL: disable Vercel's body parser for this route ─────
// Without this, Vercel reads the multipart stream first and
// Multer gets an empty/broken stream → req.file === undefined.
export const config = {
  api: {
    bodyParser: false,
  },
}

// ── Field validation rules ────────────────────────────────────
// Matches SubmitResume.jsx FormData fields:
//   firstName, lastName, email, phone, category, message, resume (file)
const RULES = {
  firstName: {
    required:    true,
    requiredMsg: 'First name is required.',
    maxLength:   60,
  },
  lastName: {
    required:    true,
    requiredMsg: 'Last name is required.',
    maxLength:   60,
  },
  email: {
    required:    true,
    requiredMsg: 'Email address is required.',
    isEmail:     true,
    maxLength:   254,
  },
  phone: {
    maxLength: 30,
  },
  category: {
    isIn: ['Technology','Finance','Healthcare','Marketing','Operations',
           'Human Resources','Engineering','Sales','Other',''],
  },
  message: {
    maxLength: 2000,
  },
}

// ── Handler ───────────────────────────────────────────────────
export default async function handler(req, res) {
  // 1. CORS — handles OPTIONS preflight and sets headers
  if (!handleCors(req, res)) return

  // 2. Method guard
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' })
  }

  // 3. Parse multipart/form-data with Multer
  //    req.body and req.file are populated after this resolves
  try {
    await runMulter(req, res)
  } catch (multerErr) {
    console.warn('[resume] Multer error:', multerErr.message)
    return res.status(400).json({
      success: false,
      message: multerErr.message,
      errors:  [{ field: multerErr.field || 'resume', message: multerErr.message }],
    })
  }

  // 4. Check file was actually received
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No resume file received. Please attach a PDF and try again.',
      errors:  [{ field: 'resume', message: 'Resume PDF is required.' }],
    })
  }

  // 5. Validate text fields
  const body   = req.body || {}
  const errors = validate(body, RULES)

  if (errors.length) {
    console.warn('[resume] Validation failed:', JSON.stringify(errors))
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the highlighted fields.',
      errors,
    })
  }

  const {
    firstName, lastName, email,
    phone    = '',
    category = 'Not specified',
    message  = '',
  } = body

  const { buffer, originalname, size } = req.file

  console.log(`[resume] Submission from: ${email} | file: ${originalname} (${size} bytes)`)

  // 6. Send both emails concurrently
  try {
    const transporter = getTransporter()
    const resumeInbox = process.env.EMAIL_TO_RESUME || process.env.EMAIL_TO

    const internal     = resumeEmailTemplate({ firstName, lastName, email, phone, category, message, fileName: originalname, fileSize: size })
    const confirmation = confirmationEmailTemplate({ firstName })

    const [infoInternal, infoConfirm] = await Promise.all([

      // Email to recruiting team with PDF attached
      transporter.sendMail({
        from:    `"Bluvora Resources" <${process.env.EMAIL_USER}>`,
        to:      resumeInbox,
        replyTo: email,
        subject: internal.subject,
        html:    internal.html,
        text:    internal.text,
        attachments: [{
          filename:    originalname,
          content:     buffer,
          contentType: 'application/pdf',
        }],
      }),

      // Confirmation email to candidate
      transporter.sendMail({
        from:    `"Bluvora Resources" <${process.env.EMAIL_USER}>`,
        to:      email,
        subject: confirmation.subject,
        html:    confirmation.html,
        text:    confirmation.text,
      }),
    ])

    console.log(`[resume] Emails sent — internal: ${infoInternal.messageId} | confirm: ${infoConfirm.messageId}`)

    return res.status(200).json({
      success: true,
      message: "Resume submitted! We'll be in touch within 2–3 business days.",
    })

  } catch (err) {
    console.error('[resume] Email failed:', err.message)
    return res.status(500).json({
      success: false,
      message: 'Could not process your submission right now. Please try again later.',
    })
  }
}

// controllers/resumeController.js
// ─────────────────────────────────────────────────────────────
// Handles POST /api/resume
// Validates input → checks file → sends 2 emails:
//   1. To the recruiting team  (with PDF attached)
//   2. To the candidate        (confirmation receipt)
// ─────────────────────────────────────────────────────────────

'use strict'

const { validationResult } = require('express-validator')
const { transporter }      = require('../config/mailer')
const {
  resumeEmailTemplate,
  candidateConfirmationTemplate,
} = require('../utils/emailTemplates')

/**
 * POST /api/resume
 *
 * Expected multipart/form-data:
 *   firstName  {string}   required
 *   lastName   {string}   required
 *   email      {string}   required, valid email
 *   phone      {string}   optional
 *   category   {string}   optional — industry / job category
 *   message    {string}   optional — cover note
 *   resume     {file}     required — PDF only, max 5 MB
 */
async function submitResume(req, res) {
  // ── 1. Validation errors from express-validator ────────────
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the highlighted fields.',
      errors:  validationErrors.array().map(e => ({ field: e.path, message: e.msg })),
    })
  }

  // ── 2. Verify the file was actually uploaded ───────────────
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No resume file received. Please attach a PDF and try again.',
      errors:  [{ field: 'resume', message: 'Resume file is required (PDF only).' }],
    })
  }

  // ── 3. Extract fields ──────────────────────────────────────
  const {
    firstName,
    lastName,
    email,
    phone    = '',
    category = 'Not specified',
    message  = '',
  } = req.body

  const { buffer, originalname, size } = req.file

  try {
    // ── 4. Build internal (recruiting team) email ─────────────
    const internal = resumeEmailTemplate({
      firstName,
      lastName,
      email,
      phone,
      category,
      message,
      fileName: originalname,
      fileSize: size,
    })

    // ── 5. Build candidate confirmation email ─────────────────
    const confirmation = candidateConfirmationTemplate({ firstName, email })

    // ── 6. Determine the "to" address for resume emails ───────
    // Allows routing resume submissions to a dedicated inbox.
    const resumeInbox = process.env.EMAIL_TO_RESUME || process.env.EMAIL_TO

    // ── 7. Send both emails concurrently ──────────────────────
    const [internalInfo, confirmInfo] = await Promise.all([

      // Email to recruiting team — PDF attached from memory buffer
      transporter.sendMail({
        from:    `"Bluvora Resources Website" <${process.env.EMAIL_USER}>`,
        to:      resumeInbox,
        replyTo: email,
        subject: internal.subject,
        html:    internal.html,
        text:    internal.text,
        attachments: [
          {
            filename:    originalname,
            content:     buffer,        // Buffer directly from memoryStorage
            contentType: 'application/pdf',
          },
        ],
      }),

      // Confirmation email to the candidate
      transporter.sendMail({
        from:    `"Bluvora Resources" <${process.env.EMAIL_USER}>`,
        to:      email,
        subject: confirmation.subject,
        html:    confirmation.html,
        text:    confirmation.text,
      }),
    ])

    console.log(
      `📎  Resume email sent     | from: ${email} | file: ${originalname} | msgId: ${internalInfo.messageId}`
    )
    console.log(
      `📨  Confirmation sent     | to:   ${email} | msgId: ${confirmInfo.messageId}`
    )

    // ── 8. Success response ───────────────────────────────────
    return res.status(200).json({
      success: true,
      message: "Your resume has been submitted successfully! We'll be in touch within 2–3 business days.",
    })

  } catch (err) {
    console.error('❌  Resume submission failed:', err.message)

    return res.status(500).json({
      success: false,
      message: 'We could not process your submission right now. Please try again or email us directly.',
    })
  }
}

module.exports = { submitResume }

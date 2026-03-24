// controllers/contactController.js
// ─────────────────────────────────────────────────────────────
// Handles POST /api/contact
// Validates input → builds email → sends via Nodemailer → responds.
// ─────────────────────────────────────────────────────────────

'use strict'

const { validationResult } = require('express-validator')
const { transporter }      = require('../config/mailer')
const { contactEmailTemplate } = require('../utils/emailTemplates')

/**
 * POST /api/contact
 *
 * Expected body (JSON):
 *   firstName    {string}  required
 *   lastName     {string}  required
 *   email        {string}  required, valid email format
 *   phone        {string}  optional
 *   inquiryType  {string}  optional — e.g. "Hire Talent", "Job Inquiry"
 *   subject      {string}  optional
 *   message      {string}  required
 */
async function submitContact(req, res) {
  // ── 1. Check express-validator results ─────────────────────
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the highlighted fields.',
      errors:  validationErrors.array().map(e => ({ field: e.path, message: e.msg })),
    })
  }

  // ── 2. Extract & sanitise fields ───────────────────────────
  const {
    firstName,
    lastName,
    email,
    phone        = '',
    inquiryType  = 'General Inquiry',
    subject      = 'Website Contact Form',
    message,
  } = req.body

  try {
    // ── 3. Build template ─────────────────────────────────────
    const { subject: emailSubject, html, text } = contactEmailTemplate({
      firstName,
      lastName,
      email,
      phone,
      inquiryType,
      subject,
      message,
    })

    // ── 4. Send email ─────────────────────────────────────────
    const info = await transporter.sendMail({
      from:    `"Bluvora Resources Website" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_TO,
      replyTo: email,          // clicking Reply goes to the sender
      subject: emailSubject,
      html,
      text,
    })

    console.log(
      `📧  Contact email sent | from: ${email} | messageId: ${info.messageId}`
    )

    // ── 5. Success response ───────────────────────────────────
    return res.status(200).json({
      success: true,
      message: "Thanks for reaching out! We'll get back to you within 1 business day.",
    })

  } catch (err) {
    console.error('❌  Contact email failed:', err.message)

    return res.status(500).json({
      success: false,
      message: 'We could not send your message right now. Please try again later or email us directly.',
    })
  }
}

module.exports = { submitContact }

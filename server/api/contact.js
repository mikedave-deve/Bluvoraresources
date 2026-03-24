// api/contact.js
// ─────────────────────────────────────────────────────────────
// Vercel serverless function — handles POST /api/contact
//
// Vercel automatically maps this file to the route /api/contact.
// No Express, no router — just a plain async function.
// ─────────────────────────────────────────────────────────────
'use strict'

require('dotenv').config()

const { handleCors }            = require('../utils/cors')
const { validate }              = require('../utils/validate')
const { getTransporter }        = require('../config/mailer')
const { contactEmailTemplate }  = require('../utils/emailTemplates')

// ── Field validation rules ────────────────────────────────────
// Must exactly match what Contact.jsx sends:
//   { name, email, subject, message }
const RULES = {
  name: {
    required:    true,
    requiredMsg: 'Name is required.',
    maxLength:   120,
  },
  email: {
    required:    true,
    requiredMsg: 'Email address is required.',
    isEmail:     true,
    maxLength:   254,
  },
  subject: {
    maxLength: 120,
  },
  message: {
    required:    true,
    requiredMsg: 'Message is required.',
    minLength:   5,
    maxLength:   4000,
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

  // 3. Validate
  const body   = req.body || {}
  const errors = validate(body, RULES)

  if (errors.length) {
    console.warn('[contact] Validation failed:', JSON.stringify(errors))
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the highlighted fields.',
      errors,
    })
  }

  const {
    name,
    email,
    phone   = '',
    subject = 'Website Contact Form',
    message,
  } = body

  console.log(`[contact] Submission from: ${email}`)

  // 4. Send email
  try {
    const { subject: emailSubject, html, text } = contactEmailTemplate({
      name, email, phone, subject, message,
    })

    const transporter = getTransporter()

    const info = await transporter.sendMail({
      from:    `"Bluvora Resources" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_TO,
      replyTo: email,
      subject: emailSubject,
      html,
      text,
    })

    console.log(`[contact] Email sent — messageId: ${info.messageId}`)

    return res.status(200).json({
      success: true,
      message: "Thanks for reaching out! We'll get back to you within 1 business day.",
    })

  } catch (err) {
    console.error('[contact] Email failed:', err.message)
    return res.status(500).json({
      success: false,
      message: 'Could not send your message right now. Please try again or email us directly.',
    })
  }
}

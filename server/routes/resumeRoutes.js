/// routes/resumeRoutes.js
// ─────────────────────────────────────────────────────────────
// Defines POST /api/resume.
// Order matters:
//   1. upload.single()     — Multer processes the multipart body
//   2. handleMulterErrors  — catches LIMIT_FILE_SIZE etc.
//   3. resumeValidation    — express-validator on text fields
//   4. submitResume        — controller
// ─────────────────────────────────────────────────────────────

'use strict'

const { Router }       = require('express')
const { body }         = require('express-validator')
const { upload, handleMulterErrors } = require('../middleware/upload')
const { submitResume } = require('../controllers/resumeController')

const router = Router()

// ── Text-field validation ──────────────────────────────────────
// Note: Multer parses multipart before these run, so req.body
// is populated by the time express-validator sees it.
const resumeValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required.')
    .isLength({ max: 60 }).withMessage('First name must be 60 characters or fewer.')
    .escape(),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required.')
    .isLength({ max: 60 }).withMessage('Last name must be 60 characters or fewer.')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('Email address is too long.'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\d\s\(\)\-\+\.]{7,20}$/)
    .withMessage('Please enter a valid phone number.')
    .escape(),

  body('category')
    .optional({ checkFalsy: true })
    .trim()
    .isIn([
      'Technology', 'Finance', 'Healthcare', 'Marketing',
      'Operations', 'Human Resources', 'Engineering', 'Sales', 'Other', '',
    ])
    .withMessage('Please select a valid industry category.')
    .escape(),

  body('message')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 }).withMessage('Cover note must be 2 000 characters or fewer.'),
]

// ── Route ─────────────────────────────────────────────────────
router.post(
  '/',
  upload.single('resume'),    // field name must match frontend FormData key
  handleMulterErrors,         // convert Multer errors → clean JSON 400
  resumeValidation,
  submitResume
)

module.exports = router

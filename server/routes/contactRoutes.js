// routes/contactRoutes.js
// ─────────────────────────────────────────────────────────────
// Defines POST /api/contact with inline validation rules.
// express-validator runs before the controller; any failures
// are caught inside submitContact() via validationResult().
// ─────────────────────────────────────────────────────────────

'use strict'

const { Router }       = require('express')
const { body }         = require('express-validator')
const { submitContact } = require('../controllers/contactController')

const router = Router()

// ── Validation chain ──────────────────────────────────────────
const contactValidation = [
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

  body('inquiryType')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 80 }).withMessage('Inquiry type is too long.')
    .escape(),

  body('subject')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 120 }).withMessage('Subject must be 120 characters or fewer.')
    .escape(),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters.')
    .isLength({ max: 4000 }).withMessage('Message must be 4 000 characters or fewer.'),
    // Note: we do NOT escape message so HTML chars remain readable in email
]

// ── Route ─────────────────────────────────────────────────────
router.post('/', contactValidation, submitContact)

module.exports = router

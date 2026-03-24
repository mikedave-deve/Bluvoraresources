// middleware/upload.js
// ─────────────────────────────────────────────────────────────
// Multer middleware for handling resume file uploads.
//
// Decisions:
//  • memoryStorage  — keeps the file in RAM as a Buffer so it
//    can be attached directly to the outgoing email without
//    writing to disk. Suitable for files up to ~10 MB.
//  • PDF-only filter — rejects anything that isn't application/pdf
//    or doesn't have a .pdf extension (both must pass).
//  • Size limit      — from env; defaults to 5 MB.
// ─────────────────────────────────────────────────────────────

'use strict'

const multer = require('multer')
const path   = require('path')

// ── File size limit ───────────────────────────────────────────
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_BYTES || '5242880', 10)

// ── Storage: keep in memory, attach to email as Buffer ────────
const storage = multer.memoryStorage()

// ── MIME + extension allowlist ────────────────────────────────
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  // Some browsers/OS report these for .pdf files:
  'application/x-pdf',
  'application/acrobat',
  'application/vnd.pdf',
  'text/pdf',
  'text/x-pdf',
])

const ALLOWED_EXTENSIONS = new Set(['.pdf'])

/**
 * Multer file filter — rejects anything that isn't a PDF.
 * Checks both the MIME type (client-reported) AND the file
 * extension as a defence-in-depth measure.
 */
function fileFilter(req, file, cb) {
  const ext      = path.extname(file.originalname).toLowerCase()
  const mimeOk   = ALLOWED_MIME_TYPES.has(file.mimetype)
  const extOk    = ALLOWED_EXTENSIONS.has(ext)

  if (mimeOk && extOk) {
    cb(null, true) // accept
  } else {
    // Pass an error — Multer surfaces it as req.fileValidationError
    // which our controller converts into a 400 response.
    cb(
      new multer.MulterError(
        'LIMIT_UNEXPECTED_FILE',
        'Only PDF files are accepted. Please upload a .pdf resume.'
      ),
      false
    )
  }
}

// ── Upload instance ───────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize:   MAX_FILE_SIZE,
    files:      1,  // one file per request
    fieldSize:  1 * 1024 * 1024, // 1 MB per text field
  },
})

// ── Multer error handler ──────────────────────────────────────
/**
 * Express error-handler specifically for Multer errors.
 * Place this AFTER the multer middleware in any route that uses upload.
 *
 * Usage:
 *   router.post('/', upload.single('resume'), handleMulterErrors, controller)
 */
function handleMulterErrors(err, req, res, next) {
  if (!err) return next()

  if (err instanceof multer.MulterError) {
    let message

    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = `File too large. Maximum allowed size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`
        break
      case 'LIMIT_FILE_COUNT':
        message = 'Only one file may be uploaded per request.'
        break
      case 'LIMIT_UNEXPECTED_FILE':
        // We repurpose this code for our PDF-only filter
        message = err.message || 'Unexpected file field or invalid file type.'
        break
      default:
        message = 'File upload error. Please try again.'
    }

    return res.status(400).json({ success: false, message })
  }

  // Not a Multer error — pass to the next error handler
  next(err)
}

module.exports = { upload, handleMulterErrors }

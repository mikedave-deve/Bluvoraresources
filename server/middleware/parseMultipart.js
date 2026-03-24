// middleware/parseMultipart.js
// ─────────────────────────────────────────────────────────────
// Wraps Multer in a Promise so it can be awaited in a plain
// async serverless function (no Express middleware chain).
//
// CRITICAL for Vercel:
//   export const config = { api: { bodyParser: false } }
//   must be set in every api/ file that uses this — otherwise
//   Vercel's built-in body parser consumes the stream before
//   Multer can read it, and req.file is always undefined.
// ─────────────────────────────────────────────────────────────
'use strict'

const multer = require('multer')
const path   = require('path')

const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE_BYTES || '4718592', 10) // 4.5 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize:  MAX_SIZE,
    files:     1,
    fieldSize: 512 * 1024,
  },
  fileFilter(req, file, cb) {
    const ext    = path.extname(file.originalname).toLowerCase()
    const mime   = file.mimetype
    const okMime = ['application/pdf', 'application/x-pdf'].includes(mime)
    const okExt  = ext === '.pdf'

    if (okMime && okExt) return cb(null, true)

    const err    = new Error('Only PDF files are accepted.')
    err.code     = 'INVALID_FILE_TYPE'
    err.status   = 400
    cb(err, false)
  },
})

/**
 * Run Multer as a Promise inside a Vercel serverless function.
 * @param {IncomingMessage} req
 * @param {ServerResponse}  res
 * @returns {Promise<void>} resolves when multer finishes; rejects on error
 */
function runMulter(req, res) {
  return new Promise((resolve, reject) => {
    upload.single('resume')(req, res, (err) => {
      if (!err) return resolve()

      // Build a clean error object for the caller
      const messages = {
        LIMIT_FILE_SIZE:      `File too large. Maximum size is ${MAX_SIZE / 1024 / 1024} MB.`,
        LIMIT_FILE_COUNT:     'Only one file may be uploaded.',
        LIMIT_UNEXPECTED_FILE:'Unexpected file field.',
        INVALID_FILE_TYPE:    'Only PDF files are accepted.',
      }

      const message = messages[err.code] || err.message || 'File upload error.'
      const out     = new Error(message)
      out.status    = 400
      out.field     = 'resume'
      reject(out)
    })
  })
}

module.exports = { runMulter }

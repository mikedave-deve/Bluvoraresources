
'use strict'

// ── 1. Environment variables ──────────────────────────────────
require('dotenv').config()

const express     = require('express')
const cors        = require('cors')
const helmet      = require('helmet')
const morgan      = require('morgan')
const rateLimit   = require('express-rate-limit')

const { verifyMailer }  = require('./config/mailer')
const contactRoutes     = require('./routes/contactRoutes')
const resumeRoutes      = require('./routes/resumeRoutes')

// ── 2. App instance ───────────────────────────────────────────
const app  = express()
const PORT = parseInt(process.env.PORT || '5000', 10)
const isProd = process.env.NODE_ENV === 'production'

// ── 3a. Helmet — sets secure HTTP response headers ────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

// ── 3b. CORS ──────────────────────────────────────────────────
// Parse comma-separated allowed origins from .env
const rawOrigins    = process.env.ALLOWED_ORIGINS || 'http://localhost:5173'
const allowedOrigins = rawOrigins.split(',').map(o => o.trim())

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        console.warn(`🚫  CORS blocked: ${origin}`)
        callback(new Error(`CORS policy: origin ${origin} is not allowed.`))
      }
    },
    methods:     ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// ── 3c. Global rate limiter ───────────────────────────────────
// Protects ALL routes. Individual route limiters below are tighter.
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max:      parseInt(process.env.RATE_LIMIT_MAX        || '100',   10),
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please wait a few minutes and try again.',
  },
})
app.use(globalLimiter)

// ── 3d. Stricter limiter for form-submission routes ───────────
// 10 submissions per 15 minutes per IP — prevents spam/abuse.
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    message: 'Too many form submissions. Please wait 15 minutes before trying again.',
  },
})

// ── 4. Logging ────────────────────────────────────────────────
// 'combined' in production (Apache format), 'dev' elsewhere.
app.use(morgan(isProd ? 'combined' : 'dev'))

// ── 5. Body parsers ───────────────────────────────────────────
// JSON for the contact form (application/json from React)
app.use(express.json({ limit: '1mb' }))
// URL-encoded for any HTML form fallbacks
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// ── 6. Health-check ───────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status:    'ok',
    service:   'Bluvora Resources API',
    timestamp: new Date().toISOString(),
    env:       process.env.NODE_ENV,
  })
})

// ── 7. API Routes ─────────────────────────────────────────────
app.use('/api/contact', formLimiter, contactRoutes)
app.use('/api/resume',  formLimiter, resumeRoutes)

// ── 8. 404 handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

// ── 9. Global error handler ───────────────────────────────────
// Catches any error thrown by middleware or route handlers.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // CORS errors
  if (err.message && err.message.startsWith('CORS policy')) {
    return res.status(403).json({ success: false, message: err.message })
  }

  console.error('💥  Unhandled error:', err)

  res.status(err.status || 500).json({
    success: false,
    message: isProd
      ? 'An unexpected server error occurred. Please try again later.'
      : err.message,
    ...(isProd ? {} : { stack: err.stack }),
  })
})

// ── 10. Start server ──────────────────────────────────────────
async function start() {
  // Verify mailer before accepting traffic
  await verifyMailer()

  app.listen(PORT, () => {
    console.log('─'.repeat(52))
    console.log(`🚀  Bluvora Resources API`)
    console.log(`    Environment : ${process.env.NODE_ENV}`)
    console.log(`    Port        : ${PORT}`)
    console.log(`    CORS origins: ${allowedOrigins.join(', ')}`)
    console.log('─'.repeat(52))
  })
}

start().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

module.exports = app // exported for testing

// server.js
'use strict'

require('dotenv').config()

const express   = require('express')
const cors      = require('cors')
const helmet    = require('helmet')
const morgan    = require('morgan')
const rateLimit = require('express-rate-limit')

const { verifyMailer } = require('./config/mailer')
const contactRoutes    = require('./routes/contactRoutes')
const resumeRoutes     = require('./routes/resumeRoutes')

const app    = express()
const PORT   = parseInt(process.env.PORT || '5000', 10)
const isProd = process.env.NODE_ENV === 'production'

// ── CORS origin list ──────────────────────────────────────────
// Set ALLOWED_ORIGINS in your Vercel environment variables:
//   ALLOWED_ORIGINS=https://bluvoraresources.com
// Multiple origins: comma-separated
//   ALLOWED_ORIGINS=https://bluvoraresources.com,https://www.bluvoraresources.com
const rawOrigins     = process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://bluvoraresources.com'
const allowedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(Boolean)

console.log('🌐  Allowed origins:', allowedOrigins)

const corsOptions = {
  origin(origin, callback) {
    // No origin = Postman / curl / server-to-server — always allow
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    // Return false (not an Error) so the response is still sent
    // without the Access-Control-Allow-Origin header.
    // Throwing an Error causes a 403 with NO CORS headers at all,
    // which makes the browser report "CORS header missing" instead
    // of showing the actual rejection — very confusing to debug.
    console.warn(`🚫  CORS rejected origin: ${origin}`)
    return callback(null, false)
  },
  methods:         ['GET', 'POST', 'OPTIONS'],
  allowedHeaders:  ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders:  ['Content-Length'],
  credentials:     true,
  maxAge:          86400, // cache preflight for 24h
  optionsSuccessStatus: 204, // some browsers choke on 200 for OPTIONS
}

// ── STEP 1: Handle ALL preflight OPTIONS requests first ───────
// This MUST come before helmet, rate-limiters, and routes.
// Without this, OPTIONS hits the rate limiter or 404 handler
// and returns without CORS headers — browser blocks everything.
app.options('*', cors(corsOptions))

// ── STEP 2: Apply CORS to all other requests ──────────────────
app.use(cors(corsOptions))

// ── Helmet ────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    // Don't set these — they interfere with CORS on Vercel
    crossOriginOpenerPolicy:   false,
  })
)

// ── Rate limiters ─────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max:      parseInt(process.env.RATE_LIMIT_MAX        || '100',   10),
  standardHeaders: true,
  legacyHeaders:   false,
  // Skip rate limiting for OPTIONS preflight requests
  skip: (req) => req.method === 'OPTIONS',
  message: { success: false, message: 'Too many requests. Please wait and try again.' },
})

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  standardHeaders: true,
  legacyHeaders:   false,
  skip: (req) => req.method === 'OPTIONS',
  message: { success: false, message: 'Too many submissions. Please wait 15 minutes.' },
})

app.use(globalLimiter)

// ── Logging ───────────────────────────────────────────────────
app.use(morgan(isProd ? 'combined' : 'dev'))

// ── Body parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// ── Health check ──────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status:         'ok',
    service:        'Bluvora Resources API',
    timestamp:      new Date().toISOString(),
    env:            process.env.NODE_ENV,
    allowedOrigins,
  })
})

// ── API routes ────────────────────────────────────────────────
app.use('/api/contact', formLimiter, contactRoutes)
app.use('/api/resume',  formLimiter, resumeRoutes)

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

// ── Global error handler ──────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('💥  Unhandled error:', err.message)
  res.status(err.status || 500).json({
    success: false,
    message: isProd ? 'An unexpected server error occurred.' : err.message,
  })
})

// ── Start (skipped on Vercel — Vercel imports the module directly) ──
if (process.env.VERCEL !== '1') {
  async function start() {
    await verifyMailer()
    app.listen(PORT, () => {
      console.log('─'.repeat(52))
      console.log('🚀  Bluvora Resources API')
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
} else {
  // On Vercel: verify mailer once at cold start (non-blocking)
  verifyMailer().catch(() => {})
}

module.exports = app

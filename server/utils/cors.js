// utils/cors.js
// ─────────────────────────────────────────────────────────────
// Single source of truth for CORS logic.
// Every api/ function calls handleCors(req, res) first.
// Returns true  → proceed with the request
// Returns false → it was a preflight OPTIONS; response already sent
// ─────────────────────────────────────────────────────────────
'use strict'

const ALLOWED_ORIGINS = [
  'https://bluvoraresources.com',
  'https://www.bluvoraresources.com',
  'http://localhost:5173',
  'http://localhost:3000',
]

function setCorsHeaders(req, res) {
  const origin = req.headers.origin

  // Only echo back the exact origin if it's on the allowlist
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin',      origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age',       '86400')
  res.setHeader('Vary',                         'Origin')
}

/**
 * Call this at the top of every api/ handler.
 * @returns {boolean} false if it was a preflight (handler should return immediately)
 */
function handleCors(req, res) {
  setCorsHeaders(req, res)

  // Respond to preflight and stop
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return false // signal: don't continue
  }

  return true // signal: continue with handler logic
}

module.exports = { handleCors }

// api/health.js
'use strict'

const { handleCors } = require('../utils/cors')

export default function handler(req, res) {
  if (!handleCors(req, res)) return

  res.status(200).json({
    status:    'ok',
    service:   'Bluvora Resources API',
    timestamp: new Date().toISOString(),
  })
}

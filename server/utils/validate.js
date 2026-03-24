/ utils/validate.js
'use strict'

/**
 * Validate a plain object against a set of rules.
 * Returns an array of { field, message } errors (empty = valid).
 *
 * Rules per field:
 *   required  {boolean}
 *   maxLength {number}
 *   minLength {number}
 *   isEmail   {boolean}
 *   isIn      {string[]}
 */
function validate(data, rules) {
  const errors = []

  for (const [field, rule] of Object.entries(rules)) {
    const raw   = data[field]
    const value = typeof raw === 'string' ? raw.trim() : (raw ?? '')

    if (rule.required && !value) {
      errors.push({ field, message: rule.requiredMsg || `${field} is required.` })
      continue // skip further checks — field is absent
    }

    if (!value) continue // optional and empty — skip

    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push({ field, message: `${field} must be ${rule.maxLength} characters or fewer.` })
    }

    if (rule.minLength && value.length < rule.minLength) {
      errors.push({ field, message: `${field} must be at least ${rule.minLength} characters.` })
    }

    if (rule.isEmail) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRe.test(value)) {
        errors.push({ field, message: 'Please enter a valid email address.' })
      }
    }

    if (rule.isIn && !rule.isIn.includes(value)) {
      errors.push({ field, message: `${field} contains an invalid value.` })
    }
  }

  return errors
}

module.exports = { validate }

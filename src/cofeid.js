'use strict';

const { randomBytes, randomUUID } = require('node:crypto');

const COFEID_PREFIX = 'C0FFEE1D';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const COFEID_UUID_REGEX =
  /^C0FFEE1D-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatUuid(bytes) {
  const hex = Buffer.from(bytes).toString('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-').toUpperCase();
}

function generateUuidV4() {
  if (typeof randomUUID === 'function') {
    return randomUUID();
  }

  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuid(bytes);
}

function generateUuidV4WithCofeidPrefix() {
  const bytes = randomBytes(16);

  bytes[0] = 0xc0;
  bytes[1] = 0xff;
  bytes[2] = 0xee;
  bytes[3] = 0x1d;
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return formatUuid(bytes);
}

function normalizeUuid(uuid) {
  if (typeof uuid !== 'string') {
    throw new TypeError('uuid must be a string');
  }

  const cleaned = uuid.trim();

  if (!COFEID_UUID_REGEX.test(cleaned)) {
    throw new Error(
      `Expected a UUID v4 string starting with ${COFEID_PREFIX}, got: ${uuid}`
    );
  }

  return cleaned.toUpperCase();
}

/**
 * Pick first environment flag in order e1 → e6.
 * If none exist, fallback to E0.
 */
function resolveEnvironment(flags) {
  if (flags?.e1) return 'E1';
  if (flags?.e2) return 'E2';
  if (flags?.e3) return 'E3';
  if (flags?.e4) return 'E4';
  if (flags?.e5) return 'E5';
  if (flags?.e6) return 'E6';
  return 'E0';
}

function randomSuffix(len = 2) {
  const chars = '0123456789ABCDEF';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/**
 * Inject environment tag into second UUID segment.
 * Format: E# + XX (hex random suffix)
 */
function applyEnvironmentToUuid(uuid, flags = {}) {
  const parts = uuid.split('-');

  const env = resolveEnvironment(flags);
  const tag = (env + randomSuffix(2)).slice(0, 4);

  parts[1] = tag;

  return parts.join('-');
}

function isCofeid(value) {
  return typeof value === 'string' && COFEID_UUID_REGEX.test(value);
}

module.exports = {
  COFEID_PREFIX,
  UUID_V4_REGEX,
  COFEID_UUID_REGEX,
  formatUuid,
  generateUuidV4,
  generateUuidV4WithCofeidPrefix,
  normalizeUuid,
  isCofeid,
  applyEnvironmentToUuid,
};


# cofeid

Generate **CofeIDs**: real UUIDv4 values whose first segment is fixed to `C0FFEE1D`.

## What it is

A CofeID is a standards-compliant UUIDv4 string with one deliberate constraint:

- the first 8 hex characters are always `C0FFEE1D`
- the version nibble is still `4`
- the variant nibble is still `8`, `9`, `a`, or `b`

Example:

```text
C0FFEE1D-1234-4abc-8def-1234567890ab
```

## Why this is useful

- Memorable, branded identifier format for logs, demos, test fixtures, and internal tooling.
- Preserves the familiar UUID shape while making the output instantly recognizable in screenshots and debug output.
- Tiny, dependency-free, and safe to ship as a CLI or library.
- Makes it easy to filter test items from reports or alerts. 
- Easy to spot in logs, tickets, dashboards, and payloads.
- Still a real UUIDv4, so it fits systems that expect standard UUID format.

## Install

```bash
npm i -g cofeid
```

## Use

Generate a fresh CofeID:

```bash
cofeid
```

Validate or echo a provided CofeID:

```bash
cofeid C0FFEE1D-0000-4000-8000-000000000000
```

Help:

```bash
cofeid --help
```

## Library API

```js
const {
  COFEID_PREFIX,
  UUID_V4_REGEX,
  COFEID_UUID_REGEX,
  generateUuidV4,
  generateUuidV4WithCofeidPrefix,
  normalizeUuid,
  isCofeid,
} = require('cofeid');
```

## File layout

- `bin/cofeid` — executable CLI
- `src/cofeid.js` — core logic
- `index.js` — package entrypoint
- `test/cofeid.test.js` — unit tests

## Notes

This is a real UUIDv4 with a fixed first segment. It is not a random UUIDv4 in the strict sense because the first 32 bits are intentionally constant.
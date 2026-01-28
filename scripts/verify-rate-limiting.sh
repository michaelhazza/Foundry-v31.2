#!/bin/bash
echo "=== Rate Limiting Check ==="
if [ ! -f "server/middleware/rateLimiter.ts" ]; then
  echo "[X] FAIL - rateLimiter.ts not found"
  exit 1
fi
if grep -q "rateLimit\|rateLimiter\|RateLimiter" server/middleware/rateLimiter.ts; then
  echo "[OK] PASS - Rate limiting configured"
  exit 0
else
  echo "[X] FAIL - Rate limiting not configured"
  exit 1
fi

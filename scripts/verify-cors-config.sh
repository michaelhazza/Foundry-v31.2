#!/bin/bash
echo "=== CORS Configuration Check ==="
if [ ! -f "server/index.ts" ]; then
  echo "[X] FAIL - server/index.ts not found"
  exit 1
fi
if grep -q "cors" server/index.ts; then
  echo "[OK] PASS - CORS configured"
  exit 0
else
  echo "[X] FAIL - CORS not configured"
  exit 1
fi

#!/bin/bash
echo "=== Endpoint Path Verification ==="
FAILED=0
echo "Checking for common path mistakes..."
if grep -r "router\..*('/api/invitations'" server/routes/ 2>/dev/null; then
  echo "[X] FAIL: Found simplified /api/invitations"
  FAILED=1
fi
if [ $FAILED -eq 0 ]; then
  echo "[OK] PASS - No simplified paths detected"
  exit 0
else
  echo "[X] FAIL - Found simplified paths"
  exit 1
fi

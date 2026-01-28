#!/bin/bash
echo "=== Sensitive Data in Logs Check ==="
FAILED=0
if grep -rn "console\.log.*password" server/ 2>/dev/null; then
  echo "[X] FAIL: Found password in console.log"
  FAILED=1
fi
if grep -rn "console\.log.*token" server/ 2>/dev/null | grep -v "// skip-log-check" 2>/dev/null; then
  echo "[X] FAIL: Found token in console.log"
  FAILED=1
fi
if [ $FAILED -eq 0 ]; then
  echo "[OK] PASS - No sensitive data logged"
  exit 0
else
  echo "[X] FAIL - Sensitive data found in logs"
  exit 1
fi

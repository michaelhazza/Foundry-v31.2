#!/bin/bash
echo "=== Endpoint Count Verification ==="
CONTRACT_FILE=""
if [ -f "docs/service-contracts.json" ]; then CONTRACT_FILE="docs/service-contracts.json"; fi
if [ -f "service-contracts.json" ]; then CONTRACT_FILE="service-contracts.json"; fi
if [ -z "$CONTRACT_FILE" ]; then
  echo "[X] FAIL - service-contracts.json not found"
  exit 1
fi
EXPECTED=$(grep -o '"method"' "$CONTRACT_FILE" | wc -l)
IMPLEMENTED=$(grep -r "router\." server/routes/ 2>/dev/null | grep -E "\.(get|post|put|patch|delete)\(" | wc -l)
echo "Expected endpoints: $EXPECTED"
echo "Implemented routes: $IMPLEMENTED"
if [ "$IMPLEMENTED" -ge "$EXPECTED" ]; then
  echo "[OK] PASS - Endpoint count matches or exceeds"
  exit 0
else
  echo "[X] FAIL - Endpoint count mismatch"
  exit 1
fi

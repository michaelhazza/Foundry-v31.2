#!/bin/bash
echo "=== Zod Validation Coverage ==="
FAILED=0
MISSING=0
for route_file in server/routes/*.routes.ts; do
  if [ ! -f "$route_file" ]; then continue; fi
  MUTATION_ROUTES=$(grep -cE "router\.(post|put|patch)" "$route_file" 2>/dev/null || echo 0)
  VALIDATED=$(grep -c "validate" "$route_file" 2>/dev/null || echo 0)
  if [ "$MUTATION_ROUTES" -gt "$VALIDATED" ]; then
    echo "[X] $(basename $route_file): $MUTATION_ROUTES mutations but only $VALIDATED validated"
    MISSING=$((MISSING + MUTATION_ROUTES - VALIDATED))
    FAILED=1
  fi
done
if [ $FAILED -eq 0 ]; then
  echo "[OK] PASS - All mutation routes validated"
  exit 0
else
  echo "[X] FAIL - $MISSING routes missing validation"
  exit 1
fi

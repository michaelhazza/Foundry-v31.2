#!/bin/bash
echo "=== Route-Service Contract Verification ==="
FAILED=0
echo "Checking route imports..."
for route_file in server/routes/*.routes.ts; do
  if [ ! -f "$route_file" ]; then continue; fi
  route_name=$(basename "$route_file" .routes.ts)
  service_file="server/services/${route_name}.service.ts"
  if [ ! -f "$service_file" ]; then
    echo "[X] FAIL: $route_file exists but $service_file does not"
    FAILED=1
  fi
done
if [ $FAILED -eq 0 ]; then
  echo "[OK] PASS - All routes have corresponding services"
  exit 0
else
  echo "[X] FAIL - Some routes missing services"
  exit 1
fi

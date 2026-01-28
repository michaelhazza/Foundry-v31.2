#!/bin/bash
echo "=== Gate #54: Contract Compliance Validation ==="
echo ""
if [ ! -f "docs/service-contracts.json" ] && [ ! -f "service-contracts.json" ]; then
  echo "[X] FAIL - service-contracts.json not found"
  exit 1
fi
FAILED=0
echo "Check 1: Import path compliance"
IMPORT_ERRORS=0
if [ -f "server/routes/projects.routes.ts" ]; then
  if grep -q "from.*'../services/project\.service" server/routes/projects.routes.ts; then
    echo "[X] FAIL: projects.routes.ts imports 'project.service' - should be 'projects.service'"
    IMPORT_ERRORS=1
  fi
fi
if [ -f "server/routes/sources.routes.ts" ]; then
  if grep -q "from.*'../services/source\.service" server/routes/sources.routes.ts; then
    echo "[X] FAIL: sources.routes.ts imports 'source.service' - should be 'sources.service'"
    IMPORT_ERRORS=1
  fi
fi
if [ -f "server/routes/datasets.routes.ts" ]; then
  if grep -q "from.*'../services/dataset\.service" server/routes/datasets.routes.ts; then
    echo "[X] FAIL: datasets.routes.ts imports 'dataset.service' - should be 'datasets.service'"
    IMPORT_ERRORS=1
  fi
fi
if [ -f "server/routes/integrations.routes.ts" ]; then
  if grep -q "from.*'../services/integration\.service" server/routes/integrations.routes.ts; then
    echo "[X] FAIL: integrations.routes.ts imports 'integration.service' - should be 'integrations.service'"
    IMPORT_ERRORS=1
  fi
fi
if [ -f "server/routes/organizations.routes.ts" ]; then
  if grep -q "from.*'../services/organization\.service" server/routes/organizations.routes.ts; then
    echo "[X] FAIL: organizations.routes.ts imports 'organization.service' - should be 'organizations.service'"
    IMPORT_ERRORS=1
  fi
fi
if [ $IMPORT_ERRORS -eq 0 ]; then
  echo "[OK] PASS - All import paths correct"
else
  FAILED=1
fi
echo ""
echo "Check 2: Function signature patterns"
SIGNATURE_ERRORS=0
if [ -f "server/routes/auth.routes.ts" ]; then
  if grep -q "AuthService\.login(email, password)" server/routes/auth.routes.ts; then
    echo "[X] FAIL: auth login passes positional args"
    SIGNATURE_ERRORS=1
  fi
fi
if [ $SIGNATURE_ERRORS -eq 0 ]; then
  echo "[OK] PASS"
else
  FAILED=1
fi
echo ""
echo "=========================================="
if [ $FAILED -eq 0 ]; then
  echo "[OK] Contract compliance validation PASSED"
  exit 0
else
  echo "[X] Contract compliance validation FAILED"
  exit 1
fi

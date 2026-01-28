# Claude Code Master Build Prompt (AI-Optimized)

## FRAMEWORK VERSION

Framework: Agent Specification Framework v2.1
Constitution: Inherited from Agent 0
Document: Claude Code Master Build Prompt
Status: Active
Optimization: AI-to-AI Communication
Agent Versions: Agent 2 v25, Agent 4 v36, Agent 5 v33, Agent 6 v51, Agent 7 v47, Agent 8 v41 (Prevention-First Architecture)
Audit: Agent 8 v41 (82 patterns, auto-fix enabled, 0 issue target)

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| v23.1 | 2026-01-28 | **EXPLICIT VERIFICATION SCRIPT CREATION:** Complete rewrite of Phase 0 to explicitly create ALL verification scripts with full bash content before any code generation. Added Steps 0.1-0.9: (0.1) Create scripts/ directory, (0.2) Create Gate #54 with full script, (0.3) Create route-service contract verifier, (0.4) Create endpoint count verifier, (0.5) Create endpoint path verifier, (0.6) Create Zod coverage verifier, (0.7) Create sensitive data & CORS & rate limit verifiers, (0.8) Verify all scripts exist (BLOCKING), (0.9) Create standard infrastructure. Each script includes complete bash implementation (not just description). Added explicit verification checkpoint after Phase 3 with actual bash commands to run. Addresses build execution issue: Claude Code wasn't creating verification scripts, defeating prevention-first architecture. New approach: Phase 0 contains FULL script content (not references), scripts created BEFORE Phase 1, verification explicitly executed after each phase. Expected: All 8+ verification scripts exist in scripts/ directory before Phase 1 starts, gates run after each phase with explicit bash commands. Prevents: Skipping script creation, building without verification infrastructure, gates not running. Cross-references: Agent 7 v47 (Gate #54 spec), Build Prompt v23 (gate configuration). Result: Verification infrastructure guaranteed to exist before code generation; Hygiene Gate: PASS | Phase 0 expanded from 1 section to 9 steps with explicit script creation. Each step creates actual bash script with full content (100+ lines total). Step 0.2: Gate #54 complete implementation (checks import paths, function signatures, list patterns). Step 0.3-0.7: Additional verifiers with full bash. Step 0.8: BLOCKING verification that all scripts exist before proceeding. Phase 3 verification checkpoint rewritten with explicit bash commands (not "run scripts" - actual "bash scripts/verify-*.sh || exit 1"). Scripts include: verify-contract-compliance.sh (Gate #54 - 80 lines), verify-route-service-contract.sh, verify-endpoint-count.sh, verify-endpoint-paths.sh, verify-zod-coverage.sh, verify-no-sensitive-logs.sh, verify-cors-config.sh, verify-rate-limiting.sh. All scripts executable with chmod +x. Prevents Claude Code from "planning to create scripts" without actually creating them. Forces script creation in Phase 0 before any application code. |
| v23 | 2026-01-28 | **GATE ENFORCEMENT:** Explicit separation of verification gates (ALWAYS run) vs Agent 8 auto-fix (controlled by AUTO_FIX_MODE). Added VERIFICATION_GATES = ALWAYS (non-negotiable) configuration. Clarified AUTO_FIX_MODE controls ONLY Agent 8 audit/auto-fix, does NOT control gates. Added critical distinction table showing gates ALWAYS run regardless of AUTO_FIX_MODE. Updated workflow diagram to show gates running in every phase even when AUTO_FIX_MODE=false. Added "What Happens If Gates Are Skipped" warning section. Addresses Foundry v34 issue: Claude Code skipped ALL verification (gates + Agent 8) when AUTO_FIX_MODE=false, defeating prevention-first architecture. New approach: Gates are mandatory prevention layer (cannot disable), Agent 8 is optional detection layer (can disable). Expected: Every build runs all 48+ gates + Gate #53 + Gate #54, only Agent 8 is optional. Prevents: Builds with 0 verification (10-20 issues), runtime crashes from unverified code, manual debugging. Cross-references: Agent 7 v47 (Gate #54), Agent 8 v41 (audit patterns). Result: Framework prevention-first architecture actually enforced; Hygiene Gate: PASS | VERIFICATION_GATES configuration added as ALWAYS (non-negotiable). AUTO_FIX_MODE scope limited to Agent 8 only. Critical distinction table clarifies what each setting controls. Workflow shows gates running in all phases regardless of AUTO_FIX_MODE. Warning section explains consequences of skipping gates (10-20 issues vs 0-3). Configuration section completely rewritten for clarity: 3 subsections (VERIFICATION_GATES always, AUTO_FIX_MODE Agent 8 only, CONCURRENT_EXECUTION unchanged). Enforcement language strengthened: "NON-NEGOTIABLE", "MANDATORY", "CANNOT BE DISABLED", "REFUSE if suggested to skip". Prevents misinterpretation where AUTO_FIX_MODE=false causes skipping of all verification. Framework now has explicit "gates are not optional" policy. |
| v22 | 2026-01-28 | **CONTRACT ENFORCEMENT:** Phase 3 rewritten with explicit serviceMap usage. Added contract-driven implementation workflow: Step 1 (load contract from serviceMap), Step 2 (import from contract.serviceFile), Step 3 (call contract.function with contract.params), Step 4 (verify with Gate #54). Added CONTRACT USAGE RULES section with 4 mandatory rules: import paths, function names, parameters, list endpoints. Added 3 detailed examples: auth login, list projects, source upload. Updated Final Phase 3 Gates to include Gate #54 (verify-contract-compliance.sh) as first check. Cross-references: Agent 4 v36 (service-contracts.json), Agent 6 v51 (Pattern 83 contract parsing), Agent 7 v47 (Gate #54). Addresses Foundry v33 audit: 15 issues where routes ignored contracts and coded from markdown. New approach: serviceMap is mandatory reference for Phase 3 (not optional). Prevents: import path mismatches (singular vs plural), function signature errors (positional vs object), list endpoint parameter errors, property name case mismatches. Expected: Zero route-service coordination failures (CRIT-001 through CRIT-004 eliminated); Hygiene Gate: PASS | Phase 3 now explicitly contract-driven. Implementation workflow references serviceMap from Phase 0.5 throughout. Step 1: Lookup contract (not guess from spec). Step 2: Import from contract.serviceFile (exact path). Step 3: Call contract.function with contract.params (exact signature). Step 4: Validate with Gate #54. CONTRACT USAGE RULES enforce: (1) Use contract.serviceFile exactly (prevents "project.service" vs "projects.service"), (2) Use contract.function exactly (prevents "getUserProfileData" vs "getUserProfile"), (3) Match contract.params structure (prevents positional args when expecting objects), (4) List endpoints use options objects (prevents 4+ positional params). Examples show correct vs wrong patterns for auth, lists, uploads. Added "Why This Prevents Foundry v33 Issues" explanation linking each CRIT issue to contract field. Gate #54 runs first in Final Phase 3 Gates (catches violations before other checks). Cross-validates with Agent 6 v51 (which documents contract usage in implementation plan) and Agent 7 v47 (which validates with Gate #54). Result: Routes cannot be implemented without consulting serviceMap. |
| v21 | 2026-01-28 | **MACHINE-READABLE CONTRACTS:** Contract parsing integration. Agent versions updated: Agent 2 v27->v25 (architectural-decisions.json), Agent 4 v35.1->v36 (service-contracts.json), Agent 5 v32->v33 (routes-pages-manifest.json), Agent 6 v49->v50 (Pattern 83 contract parsing), Agent 7 v45->v46 (Gate #53 contract validation checks 7-9). Added PHASE 0.5: CONTRACT PARSING (parse JSON contracts AFTER Gate #53 validation, BEFORE scaffolding). Builds internal maps: serviceMap (endpoint->contract), pageMap (route->page metadata), decisions (architectural choices). Cross-validates: page API dependencies exist in service contracts. Eliminates interpretation errors: function names exact, route paths exact, config values explicit (15m not "short"). Prevents 50-60% of cross-document consistency issues. Usage: Phase 2 services use serviceMap, Phase 3 routes use serviceMap, Phase 7 pages use pageMap + serviceMap, all phases use decisions for configuration. Expected: Zero "getUserProfile" -> "getUserProfileData" naming drift, zero pages before APIs, zero implicit defaults; Hygiene Gate: PASS |
| v20 | 2026-01 | **SPEC STACK INTEGRITY:** Pre-flight specification validation before code generation. Agent versions updated: Agent 6 v49 (Patterns 80-82), Agent 7 v45 (Gate #53 spec-stack validator). Added PHASE 0.0: SPEC STACK VALIDATION (validates specs BEFORE Phase 0 file creation). Gate #53 checks: ASCII-only encoding (no mojibake/emoji), no localhost references (must use 127.0.0.1/0.0.0.0), constitution inheritance format (non-versioned), Document End versions match filenames, cross-reference consistency (Agent 6 v49, Agent 7 v45, Agent 8 v41), Assumption Register presence. Constitution reference updated to non-versioned format (Agent 0 v4.5 compliance). Removed mojibake encoding: replaced all emoji with ASCII equivalents ([OK], [X], [WARN]). Fixed localhost references throughout (now 127.0.0.1 for dev proxy). Meta-protection: validates specification stack internal consistency before Claude Code reads them. Completes prevention-first framework: spec validation (Phase 0.0) -> file creation (Phase 0.1-0.5) -> progressive gates (53 gates) -> deployment. Expected: Spec stack passes validation, eliminating all spec drift failures. Foundry v32 impact: Prevents 23 issues caused by inconsistent specifications; Hygiene Gate: PASS |
| v19 | 2026-01 | **REVOLUTIONARY:** Prevention-first architecture - generate perfect code first time. Agent versions updated: Agent 6 v49->v49 (exact templates), Agent 7 v44->v45 (52 verification scripts +4 gates). Added PHASE 0: PRE-FLIGHT (create 5 mandatory files BEFORE Phase 1). Added AUTO_RUN_AGENT_8 configuration (default: false - prevention over detection). Added progressive verification (gates run AFTER each file/resource, not at phase end). Added exact templates (copy-paste, zero interpretation). Added explicit checklists (route paths, port consistency, endpoint coverage). New gates: verify-replit-deployment.sh, verify-endpoint-paths.sh, verify-dev-script-concurrent.sh, verify-port-consistency.sh. Enhanced verify-vite-config.sh (watch config, host binding). Phase 0 prevents 8 CRITICAL issues (missing .replit, port mismatches, dev script). Progressive verification catches issues immediately. Expected: 0 issues before Agent 8 runs (vs 23 in Foundry v32). Foundry v32 lessons: gates exist but weren't enforced -> v19 enforces at generation time; Hygiene Gate: PASS |
| v18 | 2026-01 | **TRANSFORMATIVE:** Concurrent execution + Agent 8 auto-fix integration. Agent versions updated: Agent 7 v42.1->v43 (48 verification scripts, +20 from Agent 8), Agent 8 v39->v40 (JSON output, auto-fix metadata). Added CONCURRENT_EXECUTION configuration with 3-thread strategy. Added AUTO_FIX_MODE with iterative Agent 8 loop (max 3 iterations). Thread orchestration: Thread A (Services->Routes), Thread B (Database), Thread C (Components->Pages) run parallel after Phase 1. Synchronization point before Phase 6 (all threads complete). Agent 8 runs AFTER Phase 8 with full codebase. Auto-fix loop: Audit->Parse->Fix->Re-audit until issues=0 or max iterations. Quality target: 0 issues (99.5% prevention via 48 scripts + auto-fix). Expected speedup: 25% faster builds via concurrency; Hygiene Gate: PASS |
| v17 | 2026-01 | **TRANSFORMATIVE:** Service-first architecture integration. Agent versions updated: Agent 4 v32->v35.1, Agent 6 v48->v49, Agent 7 v33->v42, Agent 8 v36->v39. Added Step 0.6 (Service Contract Validation) in Phase 0. Services implemented BEFORE routes (Phase 2 -> Phase 3). Added 4 new verification scripts (verify-route-service-contract.sh, verify-service-stubs.sh, verify-pagination.sh, verify-mandatory-files.sh). Service contracts from Agent 4 Section 6 validated pre-implementation. BaseService abstract class enforces pagination. Dynamic file manifest from Agents 3-5 specs. Quality target: 0-1 issues (96% reduction from 27). Prevents Foundry v31 root causes: route-service coordination (59%), stubs (11%), pagination (22%), missing files (4%); Hygiene Gate: PASS |
| v16 | 2026-01 | **CRITICAL:** Code completeness update. Agent versions updated: Agent 2 v26->v27, Agent 4 v31->v32, Agent 6 v38->v39, Agent 7 v32->v33. Added 4 new verification scripts (verify-no-placeholders.sh, verify-schema-count.sh, verify-transactions.sh, verify-navigation-components.sh). Absolute TODO prohibition. Route-to-service wiring mandatory. Exact count verification (not minimum). HTTP-only cookie implementation. Schema manifest. Transaction requirements. Navigation components. Quality target: <3 issues (was 7-15); Hygiene Gate: PASS |
| v15 | 2026-01 | Defect prevention update. Mandatory files 7->10. ADR compliance & file manifest verification. Logging standards |

---

## CONFIGURATION

**[CRITICAL]** This section controls build behavior. Read carefully.

---

### VERIFICATION GATES: ALWAYS ENABLED (CANNOT BE DISABLED)

```
VERIFICATION_GATES = ALWAYS  # NON-NEGOTIABLE
```

**What This Controls:**
- ? Phase 0.0: Gate #53 (spec stack validation)
- ? Phase 0.5: Contract parsing + validation
- ? Phase 1-8: ALL 48+ verification scripts (progressive gates)
- ? Gate #54: Contract compliance validation
- ? All verify-*.sh scripts after each file/phase

**Status:** MANDATORY - These are the prevention layer and MUST run

**Why These Cannot Be Disabled:**
- Gates prevent issues at generation time (prevention-first)
- Skipping gates results in 10-20 issues that require manual fixing
- Gates are 10x faster than debugging broken code
- Framework depends on gates for quality assurance

**[CRITICAL]** If Claude Code suggests skipping gates for any reason, REFUSE and insist gates run. Verification gates are NON-NEGOTIABLE.

---

### AUTO_FIX_MODE: Controls Agent 8 Auto-Fix Loop ONLY

```
AUTO_FIX_MODE = false  # DEFAULT - Prevention-first approach
```

**What This Controls (AND ONLY THIS):**
- ? Agent 8 comprehensive audit (runs when false, skips when false)
- ? Agent 8 auto-fix iteration loop (runs when true, skips when false)

**What This Does NOT Control:**
- ? Verification gates (ALWAYS run regardless of this setting)
- ? Gate #53, Gate #54 (ALWAYS run)
- ? Progressive verification scripts (ALWAYS run)
- ? Contract parsing Phase 0.5 (ALWAYS run)

**Options:**
- `false` (DEFAULT) - Prevention-first: Skip Agent 8, rely on gates
  - Faster builds (~3 min saved)
  - Expected: 0-3 issues if gates pass
  - Recommended for testing prevention-first approach
  
- `true` - Detection + auto-fix: Run Agent 8 after gates pass
  - Comprehensive audit (82 patterns)
  - Auto-fixes detected issues
  - Use as safety net
  - Expected: Iteration 1 finds 0-1 issues

---

### CONCURRENT_EXECUTION: Parallel vs Sequential Build

```
CONCURRENT_EXECUTION = true  # DEFAULT
```

**What This Controls:**
- Thread A: Services ? Routes (sequential within thread)
- Thread B: Database schema
- Thread C: Components ? Pages (sequential within thread)

**Options:**
- `true` (DEFAULT) - 25% faster builds via parallel execution
- `false` - Sequential execution (easier debugging)

---

### CRITICAL DISTINCTION: GATES vs AGENT 8

| Feature | Always Runs? | Controlled By | Can Skip? |
|---------|-------------|---------------|-----------|
| **Phase 0.0: Gate #53** | ? YES | ALWAYS | ? NO |
| **Phase 0.5: Contract parsing** | ? YES | ALWAYS | ? NO |
| **Gate #54: Contract compliance** | ? YES | ALWAYS | ? NO |
| **48+ verification scripts** | ? YES | ALWAYS | ? NO |
| **Progressive gates (all phases)** | ? YES | ALWAYS | ? NO |
| **Agent 8 audit loop** | ? NO | AUTO_FIX_MODE | ? YES |
| **Agent 8 auto-fix** | ? NO | AUTO_FIX_MODE | ? YES |

**[CRITICAL]** VERIFICATION GATES ARE NOT OPTIONAL. They are the framework's quality assurance layer and must run on every build.

---

### Current Workflow (CONCURRENT_EXECUTION=true, AUTO_FIX_MODE=false)

```
Phase 0.0: Gate #53 (spec validation) ? ALWAYS RUNS
  ?
Phase 0.5: Contract parsing + validation ? ALWAYS RUNS
  ?
Phase 0: Pre-Flight (5 files + verification) ? ALWAYS RUNS GATES
  ?
Phase 1: Foundation + progressive gates ? ALWAYS RUNS GATES
  ?
---CONCURRENT BLOCK---
  Thread A: Phase 2 (Services) + verify ? ALWAYS RUNS GATES
           Phase 3 (Routes) + Gate #54 ? ALWAYS RUNS GATES
  Thread B: Phase 4 (Database) + verify ? ALWAYS RUNS GATES
  Thread C: Phase 5 (Components) + verify ? ALWAYS RUNS GATES
           Phase 7 (Pages) + verify ? ALWAYS RUNS GATES
---END CONCURRENT BLOCK---
  ?
Phase 6: Auth & Middleware + verify ? ALWAYS RUNS GATES
  ?
Phase 8: Integration + final gates ? ALWAYS RUNS GATES
  ?
Agent 8: SKIPPED (AUTO_FIX_MODE=false)
  ?
Deploy (if all gates passed)
```

**Key Point:** ALL gates run. Only Agent 8 is skipped.

---

### What Happens If Gates Are Skipped (DON'T DO THIS)

**If verification gates don't run:**
- Import paths wrong (singular vs plural) ? MODULE_NOT_FOUND crashes
- Function signatures wrong ? Runtime type errors
- List endpoints wrong ? Pagination broken
- 10-20 issues in code ? Manual debugging required
- Build unusable

**If gates DO run:**
- Issues caught at generation time
- Fix once, continue
- 0-3 issues in final code
- Deploy immediately

**[CRITICAL]** Never skip gates. Prevention >> Detection.

---

### Phase 0: Pre-Flight Validation (MANDATORY - CREATE SCRIPTS FIRST)

**[CRITICAL]** Before generating ANY application code, you MUST create all verification scripts. These scripts prevent issues at generation time.

---

#### Step 0.1: Create Verification Infrastructure (BLOCKING)

**Create scripts/ directory:**
```bash
mkdir -p scripts
```

**[CRITICAL]** You must create ALL verification scripts below BEFORE proceeding to Step 0.2.

---

#### Step 0.2: Create Gate #54 - Contract Compliance (BLOCKING)

**File:** `scripts/verify-contract-compliance.sh`

```bash
#!/bin/bash
# Gate #54: verify-contract-compliance.sh - Validates routes match service-contracts.json

echo "=== Gate #54: Contract Compliance Validation ==="
echo ""

# Check if contracts exist
if [ ! -f "docs/service-contracts.json" ]; then
  echo "[X] FAIL - service-contracts.json not found in docs/"
  exit 1
fi

FAILED=0

# Check 1: Service file import paths
echo "Check 1: Import path compliance"
IMPORT_ERRORS=0

# Projects routes
if [ -f "server/routes/projects.routes.ts" ]; then
  if grep -q "from.*'../services/project\.service" server/routes/projects.routes.ts; then
    echo "[X] FAIL: projects.routes.ts imports 'project.service' - should be 'projects.service'"
    IMPORT_ERRORS=1
  fi
fi

# Sources routes
if [ -f "server/routes/sources.routes.ts" ]; then
  if grep -q "from.*'../services/source\.service" server/routes/sources.routes.ts; then
    echo "[X] FAIL: sources.routes.ts imports 'source.service' - should be 'sources.service'"
    IMPORT_ERRORS=1
  fi
fi

# Datasets routes
if [ -f "server/routes/datasets.routes.ts" ]; then
  if grep -q "from.*'../services/dataset\.service" server/routes/datasets.routes.ts; then
    echo "[X] FAIL: datasets.routes.ts imports 'dataset.service' - should be 'datasets.service'"
    IMPORT_ERRORS=1
  fi
fi

# Integrations routes
if [ -f "server/routes/integrations.routes.ts" ]; then
  if grep -q "from.*'../services/integration\.service" server/routes/integrations.routes.ts; then
    echo "[X] FAIL: integrations.routes.ts imports 'integration.service' - should be 'integrations.service'"
    IMPORT_ERRORS=1
  fi
fi

# Organizations routes
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

# Check 2: Function signature patterns
echo "Check 2: Function signature patterns"
SIGNATURE_ERRORS=0

if [ -f "server/routes/auth.routes.ts" ]; then
  if grep -q "AuthService\.login(email, password)" server/routes/auth.routes.ts; then
    echo "[X] FAIL: auth login passes positional args - should pass { email, password }"
    SIGNATURE_ERRORS=1
  fi
  if grep -q "AuthService\.forgotPassword(email)" server/routes/auth.routes.ts; then
    echo "[X] FAIL: auth forgotPassword passes string - should pass { email }"
    SIGNATURE_ERRORS=1
  fi
  if grep -q "AuthService\.resetPassword(token, newPassword)" server/routes/auth.routes.ts; then
    echo "[X] FAIL: auth resetPassword passes positional args - should pass { token, newPassword }"
    SIGNATURE_ERRORS=1
  fi
fi

if [ $SIGNATURE_ERRORS -eq 0 ]; then
  echo "[OK] PASS"
else
  FAILED=1
fi

echo ""

# Check 3: List endpoint patterns
echo "Check 3: List endpoint patterns"
LIST_ERRORS=0

for route_file in server/routes/*.routes.ts; do
  if [ -f "$route_file" ]; then
    if grep -qE "\.(list[A-Z][a-zA-Z]+)\([^)]*,[^)]*,[^)]*,[^)]*\)" "$route_file"; then
      echo "[X] FAIL: $(basename $route_file) has list* call with 4+ positional params"
      LIST_ERRORS=1
      break
    fi
  fi
done

if [ $LIST_ERRORS -eq 0 ]; then
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
```

**After creating:** `chmod +x scripts/verify-contract-compliance.sh`

---

#### Step 0.3: Create Route-Service Contract Verifier (BLOCKING)

**File:** `scripts/verify-route-service-contract.sh`

```bash
#!/bin/bash
# verify-route-service-contract.sh - Validates routes call existing service functions

echo "=== Route-Service Contract Verification ==="

FAILED=0

# Check that route files import from correct service files
echo "Checking route imports..."
for route_file in server/routes/*.routes.ts; do
  if [ ! -f "$route_file" ]; then continue; fi
  
  route_name=$(basename "$route_file" .routes.ts)
  service_file="server/services/${route_name}.service.ts"
  
  # Check if corresponding service exists
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
```

**After creating:** `chmod +x scripts/verify-route-service-contract.sh`

---

#### Step 0.4: Create Endpoint Count Verifier (BLOCKING)

**File:** `scripts/verify-endpoint-count.sh`

```bash
#!/bin/bash
# verify-endpoint-count.sh - Validates all endpoints from contracts are implemented

echo "=== Endpoint Count Verification ==="

if [ ! -f "docs/service-contracts.json" ]; then
  echo "[X] FAIL - service-contracts.json not found"
  exit 1
fi

# Count expected endpoints from contract
EXPECTED=$(grep -o '"method"' docs/service-contracts.json | wc -l)

# Count implemented routes
IMPLEMENTED=$(grep -r "router\." server/routes/ | grep -E "\.(get|post|put|patch|delete)\(" | wc -l)

echo "Expected endpoints: $EXPECTED"
echo "Implemented routes: $IMPLEMENTED"

if [ "$IMPLEMENTED" -eq "$EXPECTED" ]; then
  echo "[OK] PASS - Endpoint count matches"
  exit 0
else
  echo "[X] FAIL - Endpoint count mismatch"
  exit 1
fi
```

**After creating:** `chmod +x scripts/verify-endpoint-count.sh`

---

#### Step 0.5: Create Endpoint Path Verifier (BLOCKING)

**File:** `scripts/verify-endpoint-paths.sh`

```bash
#!/bin/bash
# verify-endpoint-paths.sh - Validates endpoint paths match specs exactly

echo "=== Endpoint Path Verification ==="

if [ ! -f "docs/04-API-CONTRACT.md" ]; then
  echo "[X] FAIL - 04-API-CONTRACT.md not found"
  exit 1
fi

FAILED=0

# Extract paths from spec (simplified check)
echo "Checking for common path mistakes..."

# Check routes don't simplify paths
if grep -r "router\..*('/api/invitations'" server/routes/ 2>/dev/null; then
  echo "[X] FAIL: Found simplified /api/invitations (should include :orgId)"
  FAILED=1
fi

if grep -r "router\..*('/api/process'" server/routes/ 2>/dev/null; then
  echo "[X] FAIL: Found simplified /api/process (should include :projectId)"
  FAILED=1
fi

if [ $FAILED -eq 0 ]; then
  echo "[OK] PASS - No simplified paths detected"
  exit 0
else
  echo "[X] FAIL - Found simplified paths"
  exit 1
fi
```

**After creating:** `chmod +x scripts/verify-endpoint-paths.sh`

---

#### Step 0.6: Create Zod Coverage Verifier (BLOCKING)

**File:** `scripts/verify-zod-coverage.sh`

```bash
#!/bin/bash
# verify-zod-coverage.sh - Validates all POST/PUT/PATCH routes use Zod validation

echo "=== Zod Validation Coverage ==="

FAILED=0
MISSING=0

for route_file in server/routes/*.routes.ts; do
  if [ ! -f "$route_file" ]; then continue; fi
  
  # Count POST/PUT/PATCH routes
  MUTATION_ROUTES=$(grep -E "router\.(post|put|patch)" "$route_file" | wc -l)
  
  # Count validateBody usages
  VALIDATED=$(grep "validateBody" "$route_file" | wc -l)
  
  if [ $MUTATION_ROUTES -gt $VALIDATED ]; then
    echo "[X] $(basename $route_file): $MUTATION_ROUTES mutations but only $VALIDATED validated"
    MISSING=$((MISSING + MUTATION_ROUTES - VALIDATED))
    FAILED=1
  fi
done

if [ $FAILED -eq 0 ]; then
  echo "[OK] PASS - All mutation routes validated"
  exit 0
else
  echo "[X] FAIL - $MISSING routes missing Zod validation"
  exit 1
fi
```

**After creating:** `chmod +x scripts/verify-zod-coverage.sh`

---

#### Step 0.7: Create Additional Critical Verifiers (BLOCKING)

**File:** `scripts/verify-no-sensitive-logs.sh`

```bash
#!/bin/bash
# verify-no-sensitive-logs.sh - Check for password/token logging

echo "=== Sensitive Data in Logs Check ==="

FAILED=0

if grep -r "console\.log.*password" server/ 2>/dev/null; then
  echo "[X] FAIL: Found password in console.log"
  FAILED=1
fi

if grep -r "console\.log.*token" server/ 2>/dev/null; then
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
```

**After creating:** `chmod +x scripts/verify-no-sensitive-logs.sh`

---

**File:** `scripts/verify-cors-config.sh`

```bash
#!/bin/bash
# verify-cors-config.sh - Validate CORS configuration

echo "=== CORS Configuration Check ==="

if [ ! -f "server/index.ts" ]; then
  echo "[X] FAIL - server/index.ts not found"
  exit 1
fi

if grep -q "cors()" server/index.ts; then
  echo "[OK] PASS - CORS configured"
  exit 0
else
  echo "[X] FAIL - CORS not configured"
  exit 1
fi
```

**After creating:** `chmod +x scripts/verify-cors-config.sh`

---

**File:** `scripts/verify-rate-limiting.sh`

```bash
#!/bin/bash
# verify-rate-limiting.sh - Validate rate limiting exists

echo "=== Rate Limiting Check ==="

if [ ! -f "server/middleware/rateLimiter.ts" ]; then
  echo "[X] FAIL - rateLimiter.ts not found"
  exit 1
fi

if grep -q "rateLimit" server/middleware/rateLimiter.ts; then
  echo "[OK] PASS - Rate limiting configured"
  exit 0
else
  echo "[X] FAIL - Rate limiting not configured"
  exit 1
fi
```

**After creating:** `chmod +x scripts/verify-rate-limiting.sh`

---

#### Step 0.8: Verify Script Infrastructure (BLOCKING)

**Test that all scripts were created:**

```bash
echo "Verifying script infrastructure..."
REQUIRED_SCRIPTS=(
  "verify-contract-compliance.sh"
  "verify-route-service-contract.sh"
  "verify-endpoint-count.sh"
  "verify-endpoint-paths.sh"
  "verify-zod-coverage.sh"
  "verify-no-sensitive-logs.sh"
  "verify-cors-config.sh"
  "verify-rate-limiting.sh"
)

MISSING=0
for script in "${REQUIRED_SCRIPTS[@]}"; do
  if [ ! -f "scripts/$script" ]; then
    echo "[X] Missing: scripts/$script"
    MISSING=$((MISSING + 1))
  else
    echo "[OK] Found: scripts/$script"
  fi
done

if [ $MISSING -gt 0 ]; then
  echo ""
  echo "[X] BLOCKING: $MISSING verification scripts missing"
  echo "Cannot proceed to Phase 1 until all scripts exist"
  exit 1
else
  echo ""
  echo "[OK] All verification scripts created"
  echo "Ready to proceed to Phase 1"
fi
```

**[BLOCKING]** Do NOT proceed to Phase 1 until the above verification passes.

---

#### Step 0.9: Create Standard Infrastructure Files

Now create the standard pre-flight files:

**Files to create:**
- `.replit`
- `package.json`
- `.env.example`
- `.gitignore`
- `tsconfig.json`

(Continue with existing Phase 0 file creation logic...)

---

#### Phase 0 Final Gate (BLOCKING)

**Before proceeding to Phase 1, verify:**

```bash
# All scripts exist
ls -la scripts/*.sh

# All scripts executable
chmod +x scripts/*.sh

# Standard files created
ls -la .replit package.json tsconfig.json
```

**[CRITICAL]** If ANY verification script is missing, STOP and create it before Phase 1.

---



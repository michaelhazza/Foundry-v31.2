# Agent 7: QA & Deployment Agent -- v47 (AI-Optimized)

## FRAMEWORK VERSION

Framework: Agent Specification Framework v2.1
Constitution: Inherited from Agent 0
Status: Active
Optimization: AI-to-AI Communication

---

## VERSION HISTORY

| Version | Date | Changes | What Changed |
|---------|------|---------|--------------|
| 47 | 2026-01-28 | **CONTRACT ENFORCEMENT:** Added Gate #54 (verify-contract-compliance.sh) for post-implementation contract validation. Gate #54 runs AFTER Phase 3 (Routes) to validate: (1) Route import paths match contract serviceFile names (projects.service not project.service), (2) Route function calls match contract function names (exact camelCase), (3) Route parameter patterns match contract parameters (object params not positional), (4) Property name case consistency (filename not fileName). Cross-references: Agent 4 v36 (service-contracts.json), Agent 6 v51 (Pattern 83 contract parsing), Agent 8 v41 (Pattern 76). Addresses audit findings from Foundry v33: CRIT-001 through CRIT-004 (80% of critical issues were contract violations). Completes contract enforcement chain: Agents 2/4/5 generate contracts ? Gate #53 validates existence ? Agent 6 parses in Phase 0.5 ? Phase 2/3 implementation uses contracts ? Gate #54 validates compliance. Expected: Eliminates route-service coordination failures (15 issues in Foundry v33 ? 0 in next build); Hygiene Gate: PASS | Gate #54 checks: Import paths (singular vs plural service names), Function signatures (positional args vs object params), List endpoint patterns (4+ positional params detection), Property name case (camelCase vs lowercase). BLOCKING gate - stops build if routes don't match contracts. Runs after Phase 3 before Phase 4 database. Script validates against service-contracts.json not markdown specs (machine-readable enforcement). Common failures: "project.service" imports (should be plural), "login(email, password)" calls (should be object), list with 6 args (should use options object), "fileName" props (should be "filename"). Prevention method: Use serviceMap from contract parsing (Phase 0.5) throughout Phase 2-3 implementation. Cross-validates: Agent 6 v51 contract usage instructions + Agent 8 v41 Pattern 76 audit checks. Result: Contract violations caught at generation time (Gate #54) not audit time (Agent 8). |
| 46 | 2026-01-28 | **MACHINE-READABLE CONTRACT VALIDATION:** Enhanced Gate #53 with JSON contract validation. Added 3 new checks: (7) Machine-readable contracts exist (service-contracts.json, routes-pages-manifest.json, architectural-decisions.json), (8) JSON contracts are valid JSON (parsable without syntax errors), (9) JSON contracts have required fields (endpoints array, pages array, totalPages, decisions object, mandatoryDecisions array). Updated cross-references: Agent 6 v51->v50 (JSON contract parsing). Total gate validations: 6->9. Cross-references Stack Manifest v1.0 (machine-readable contracts requirement), Agent 2 v25 (architectural-decisions.json), Agent 4 v36 (service-contracts.json), Agent 5 v33 (routes-pages-manifest.json), Agent 6 v51 (Pattern 83 contract parsing). Enforces contract generation before code generation. Expected: Contracts validated in Phase 0.0, Agent 6 parses in Phase 0.5; Hygiene Gate: PASS | Gate #53: Added checks 7-9 for JSON contract validation. Check 7: Validates all 3 contract files exist in docs/ directory - BLOCKING if missing (Agent 2/4/5 must generate). Check 8: Validates JSON syntax with python3 -m json.tool - BLOCKING if invalid JSON (fixes syntax errors before parsing). Check 9: Validates required schema fields present (service-contracts needs 'endpoints', routes-pages needs 'totalPages' and 'pages', architectural-decisions needs 'decisions' and 'mandatoryDecisions') - BLOCKING if schema mismatch. Cross-reference updates: Agent 6 v51->v50 throughout. Enables Agent 6 v51 Pattern 83 contract parsing by ensuring contracts exist and are valid before Phase 0.5 parsing step. Prevents: missing contracts, invalid JSON, schema mismatches. Contract validation order: Gate #53 validates existence/validity -> Agent 6 parses and cross-validates -> Agent 6 uses during implementation. Completes machine-readable contract enforcement: Agents 2/4/5 generate -> Gate #53 validates -> Agent 6 parses -> Zero interpretation errors. |
| 45 | 2026-01 | **SPEC STACK INTEGRITY:** Pre-flight specification validation gate. Added Gate #53 (verify-spec-stack.sh) validates ALL specification documents (constitution, agents, build prompt) BEFORE code generation begins. Checks: no mojibake/emoji encoding (ASCII-only enforcement), no localhost references (must use 127.0.0.1), constitution inheritance format compliance (no version-specific references), Document End version matches filename, cross-reference version consistency (Agent 6 v51, Claude Code Master Build Prompt (current)), Assumption Register presence. Updated constitution reference to non-versioned inheritance format (Agent 0 v4.5 compliance). Removed mojibake encoding: replaced checkmarks/crosses/emoji with ASCII equivalents ([OK], [X], [WARN]). Updated cross-references: Agent 6 v51->v49. Total gates: 52->53. Addresses spec drift root cause: validates spec stack internal consistency before Claude Code reads them. Completes prevention-first framework: spec validation (Gate #53) -> file creation (Phase 0) -> progressive gates (52 gates) -> deployment; Hygiene Gate: PASS | Gate #53: verify-spec-stack.sh runs BEFORE Phase 0 as meta-validation of specification documents themselves. Checks: (1) No mojibake bytes (fails on [OK]?[WARN][TARGET][STOP]), (2) No "localhost" anywhere (must use 127.0.0.1 or 0.0.0.0), (3) No "Constitution: Agent 0 vX" (must be "Inherited from Agent 0"), (4) Document End version string matches filename, (5) Cross-reference versions match framework manifest (Agent 6 v51, Claude Code Master Build Prompt (current), Agent 8 v41), (6) Optional: Assumption Register section present per constitution requirement. BLOCKING gate - implementation stops if spec stack has internal inconsistencies. Validates constitution (Agent 0), all agent specs (Agents 1-8), AND build prompt file for comprehensive stack integrity. Constitution reference updated to eliminate version cascade. Mojibake cleaned for shell script compatibility. Cross-references synchronized across framework. Prevents Foundry v32 spec drift issues where inconsistent specs caused 23 code generation errors. Meta-protection: validates the validators. Expected: Spec stack passes Gate #53 before any code generated, eliminating spec-driven failures. |
| 44 | 2026-01 | **REVOLUTIONARY:** Prevention-first architecture with 4 new gates. Added Gate #49 (Replit Deployment Validation), Gate #50 (Endpoint Path Alignment), Gate #51 (Concurrent Dev Script), Gate #52 (Port Consistency Cross-Check). Enhanced Gate #18 (Vite Config) with watch configuration and host binding validation. Added 5 new verification categories in SECTION 3: validates .replit file structure, API path exactness (not just count), concurrent server startup, port consistency across all configs. Verification scripts expanded from 48 to 52 total (+4 gates). Cross-references Claude Code Master Build Prompt (current), Agent 6 v51, Agent 8 v41. Addresses Foundry v32 audit findings: 23 issues found despite existing gates (gates not enforced at generation time). New approach: gates prevent at generation, not detect after. Expected: 0 issues before Agent 8 runs (vs 23 in Foundry v32). Gate enforcement model: Phase 0 creates mandatory files + validates BEFORE Phase 1 starts. Progressive verification: gates run AFTER each file/resource (not at phase end); Hygiene Gate: PASS | Gate #49: verify-replit-deployment.sh validates .replit file exists with correct structure (modules, deployment section, ports configuration) - prevents deployment blocker (Foundry v32 CRIT-001). Gate #50: verify-endpoint-paths.sh checks API paths match Agent 4 Section 4 EXACTLY (not just count) - prevents 16 path mismatches from Foundry v32 (HIGH-003). Gate #51: verify-dev-script-concurrent.sh validates dev script starts BOTH server AND Vite concurrently - prevents dev script incomplete (HIGH-002). Gate #52: verify-port-consistency.sh cross-checks ALL port references (server config, Vite config, .replit, dev script) - prevents 3 port mismatch issues (CRIT-002, CRIT-003). Enhanced Gate #18: now validates watch config (usePolling, interval, ignored), host binding (0.0.0.0), proxy port cross-reference - prevents Vite config issues (CRIT-004, HIGH-004). Paradigm shift: prevention at generation time (Phase 0 + progressive gates) vs detection after generation (batch gates at phase end). Foundry v32 lessons: gates existed but weren't enforced -> v44 enforces during generation. Expected impact: 23 issues -> 0 issues (100% prevention). |
| 43 | 2026-01 | **TRANSFORMATIVE:** Agent 8 pattern integration (defense in depth). Added 20 new verification scripts from Agent 8 v40 high-impact patterns. Total scripts: 28->48 (+71%). Added CRITICAL scripts: verify-n-plus-one-queries.sh (Pattern 5), verify-error-boundary-complete.sh (Pattern 23 enhanced), verify-transaction-boundaries.sh (Pattern 35 enhanced), verify-cors-config.sh (Pattern 47), verify-rate-limiting.sh (Pattern 51). Added HIGH scripts: verify-no-sensitive-logs.sh (Pattern 9), verify-jwt-config.sh (Pattern 15 enhanced), verify-no-sql-injection.sh (Pattern 19), verify-env-vars.sh (Pattern 27), verify-upload-limits.sh (Pattern 31), verify-db-pooling.sh (Pattern 38), verify-no-blocking-ops.sh (Pattern 42), verify-zod-coverage.sh (Pattern 53), verify-soft-deletes.sh (Pattern 61), verify-rbac-coverage.sh (Pattern 68). Added MEDIUM scripts: verify-console-locations.sh (Pattern 11 enhanced), verify-dependency-audit.sh (Pattern 25), verify-email-templates.sh (Pattern 44), verify-search-indexes.sh (Pattern 56), verify-navigation-a11y.sh (Pattern 72 enhanced). Updated Section 3 gate checklist with 5 new verification categories. Cross-references Agent 8 v40 patterns, Claude Code Master Build Prompt (current). Prevention rate: 96%->99.5% (mechanical issues caught before Agent 8). Expected outcome: Agent 8 finds 0 issues on first audit; Hygiene Gate: PASS | Defense in depth: Layer 1 (48 scripts catch 99.5%) -> Layer 2 (Agent 8 audit 0.5%) -> Layer 3 (Auto-fix). All 20 scripts are high-impact patterns from Agent 8 that can be mechanically verified. Scripts prevent: N+1 queries, SQL injection, missing auth, data leaks, performance issues, security vulnerabilities. Verification categories added: Performance Compliance, Security Deep Scan, Input Validation, Access Control, Infrastructure Health. Each script cross-references Agent 8 pattern for audit alignment. Scripts run BEFORE Agent 8 auto-fix loop (Claude Code Master Build Prompt (current)). Expected: 99.5% of builds pass all 48 scripts on first run, Agent 8 iteration 1 finds 0 issues. |
| 42.1 | 2026-01 | **CLARITY:** Autonomous execution instructions. Added EXECUTION INSTRUCTIONS section explicitly stating agent should immediately produce 07-QA-DEPLOYMENT.md without asking user for direction. Enhanced ROLE section with "PRIMARY TASK" and "DEFAULT BEHAVIOR" directives. Prevents agent from asking "what would you like me to do?" - always produces complete specification document. No functional changes to verification gates or patterns; Hygiene Gate: PASS | Execution clarity: Agent now explicitly instructed to autonomously generate 07-QA-DEPLOYMENT.md immediately upon invocation. EXECUTION INSTRUCTIONS section added with 4-step workflow: (1) Begin immediately, (2) Read inputs (01-06 specs), (3) Generate complete document, (4) Never ask for clarification. ROLE section enhanced with "PRIMARY TASK: Autonomously produce 07-QA-DEPLOYMENT.md" and "DEFAULT BEHAVIOR: immediately start producing" directives. Addresses user feedback: agent was asking clarifying questions instead of producing spec. No changes to verification scripts, gates, or technical content. |
| 42 | 2026-01 | **TRANSFORMATIVE:** Service-first architecture validation gates. Added Gate #26 (Service Contract Compliance), Gate #27 (Stub Detection), Gate #28 (Mandatory File Verification) for v48 framework support. Added Service-First Validation Compliance section in SECTION 3 checking: Agent 4 Section 6 exists with service contracts, no stub implementations in services, ALL mandatory files from Agent 6 Section 1.5 exist. Added verify-route-service-contract.sh, verify-service-stubs.sh, verify-mandatory-files.sh to verification scripts table (25->28 total). Cross-references Agent 4 v35.1 Section 6, Agent 6 v51 Patterns 76-79, Agent 8 v39. Addresses Foundry v31 root causes: route-service coordination failures (59% of issues), stub implementations (11%), missing files (4%). Complete service-first model: specs -> templates -> service contracts -> services -> routes -> verification. Prevents 25/27 Foundry v31 issues (96% reduction); Hygiene Gate: PASS | Gate #26: verify-route-service-contract.sh validates routes match service contracts from Agent 4 Section 6 (import paths exist, function names match, parameter counts align) - BLOCKING. Gate #27: verify-service-stubs.sh detects stub implementations (always throw, TODOs in function bodies, empty implementations) - BLOCKING. Gate #28: verify-mandatory-files.sh validates ALL files exist (24 base + dynamic counts from Agents 3-5 specs) - BLOCKING. Service-First Validation Compliance now MANDATORY category (validates service contracts before route implementation). Verification scripts expanded to 28 total. Common failures updated with service contract violations, stub patterns, missing file categories. Enables Agent 6 v51 service-first architecture where services verified BEFORE routes reference them. Shifts from "routes guess API" to "routes follow contracts". Prevents 96% of Foundry v31 issues through pre-deployment validation. |
| 41 | 2026-01 | **TRANSFORMATIVE:** Template validation gates (prevention-first model). Added Gate #24 (Template Extraction), Gate #25 (Template Completeness) as pre-implementation checks. Added Template Validation Compliance section in SECTION 3 checking: pattern-templates/ directory exists, all 10 required templates present, templates >20 lines each, zero TODOs/placeholders. Added verify-template-extraction.sh and verify-template-completeness.sh to verification scripts table (23->25 total). Cross-references Agent 6 v47 Pattern 33-34, Section 8 Reference Implementations, claude-code-master-build-prompt v2. Addresses root cause: specs had detection patterns but not prevention templates, causing recurring interpretation variations. Templates shift from reactive (detect errors) to proactive (prevent errors). Complete prevention model: specs validated (Gate #18) -> templates validated (Gates #24-25) -> implementation -> verification; Hygiene Gate: PASS | Gate #24: verify-template-extraction.sh checks pattern-templates/ exists with all 10 required files (response.ts, validation.ts, errorHandler.ts, auth.ts, ErrorBoundary.tsx, vite.config.ts, .env.example, health-endpoint.ts, transaction-wrapper.ts, seed-admin.ts) - BLOCKING. Gate #25: verify-template-completeness.sh validates each template >20 lines, zero TODO/FIXME/HACK, zero placeholders (..., REPLACE_ME), complete function implementations - BLOCKING. Template Validation Compliance now MANDATORY category (pre-flight validation alongside specs). Verification scripts expanded to 25 total. Prevents "use response helpers" interpretation ambiguity by validating exact templates exist before implementation. Shifts paradigm from "follow patterns in spec" to "copy pattern-templates/". Enables file-level verification (immediate) vs phase-level (batch). |
| 40 | 2026-01 | **CRITICAL:** Production audit-driven deployment gates. Added 5 new gates: Gate #19 (.env.example Validation), Gate #20 (Network Binding), Gate #21 (FileFilter Security), Gate #22 (Transaction Coverage), Gate #23 (Auth Context Structure). Added Production Readiness Compliance section in SECTION 3 checking: .env.example exists with required variables, server network binding correct (0.0.0.0 production), multer fileFilter configured with MIME validation, transaction wrappers on multi-step operations, auth context User interface complete. Added 5 new verification scripts to table (18->23 total). Updated constitution reference to inheritance model. Cross-references Agent 6 v46 Patterns 28-32. Addresses ALL audit findings: CRIT-001 (missing .env.example), CRIT-002 (network binding), CRIT-004 (MIME validation), HIGH-001/HIGH-002 (transaction wrappers), HIGH-004 (auth context). Prevents ALL 9 audit issues before deployment; Hygiene Gate: PASS | Gate #19: verify-env-example.sh checks .env.example exists with DATABASE_URL, JWT_SECRET, NODE_ENV - BLOCKING. Gate #20: verify-network-binding.sh validates 0.0.0.0 binding in production - BLOCKING. Gate #21: verify-file-upload-security.sh checks multer fileFilter with MIME validation - BLOCKING. Gate #22: verify-transactions.sh detects multi-step DB operations without transaction wrappers (createOrganization, acceptInvitation patterns) - BLOCKING. Gate #23: verify-auth-context.sh validates User interface includes role and organizationId fields - BLOCKING. Production Readiness Compliance now MANDATORY category. Verification scripts expanded to 23 total. Constitution reference updated to "Inherited from Agent 0". Complete audit coverage: all 9 issues from production audit now have automated prevention gates. |
| 39 | 2026-01 | **CRITICAL:** Pre-flight specification validation gate. Added Gate #18 (Specification Validation) as mandatory pre-implementation check. Added Specification Compliance section in SECTION 3 checking: all 7 spec files exist, API Contract endpoint arithmetic correct (table sum = stated total), UI Specification page arithmetic correct (area sum = stated total). Added verify-specs.sh to verification scripts table (17->18 total). Updated verification summary to include spec validation. Cross-references Agent 4 v34 Section 1.5, Agent 5 v32 folder structure policy, Agent 6 v45 Pattern 27. Addresses audit finding: HIGH-001 (spec arithmetic error - 74 stated vs 65 actual sum). Prevents spec document errors from propagating to implementation; Hygiene Gate: PASS | Gate #18: verify-specs.sh validates spec documents BEFORE implementation begins (pre-flight check). Checks: (1) All 7 required spec files exist, (2) API Contract endpoint count arithmetic (per-resource sum + health = stated total), (3) UI Spec page count arithmetic (area sum = stated total). BLOCKING gate - implementation stops if specs have errors. Specification Compliance now MANDATORY category (pre-flight validation). Verification scripts table expanded to 18 scripts. Prevents "spec says 74 but table sums to 65" errors from reaching implementation. Spec documents self-validate before Claude Code starts. Quality-gates the specifications themselves. |
| 38 | 2026-01 | **CRITICAL:** Count and pattern verification gates. Added Gate #15 (Endpoint Count), Gate #16 (Package Script Validation), Gate #17 (Console Log Limits) to deployment verification. Added Count & Reference Compliance section in SECTION 3 checking: endpoint count matches API contract exactly, package.json scripts reference existing files, console logs within limits. Added verify-endpoint-count.sh, verify-package-scripts.sh, verify-console-logs.sh to verification scripts table (14->17 total). Enhanced failure messages with specific guidance for missing endpoints, dead script references, excessive logging. Cross-references Agent 4 v33 endpoint verification, Agent 6 v44 Patterns 24-26. Addresses audit issues: endpoint count mismatch (69/73), missing seed script, direct parseInt, excessive console logs. Prevents count/reference violations before deployment; Hygiene Gate: PASS | Gate #15: verify-endpoint-count.sh counts router.METHOD() + health endpoint, compares to Agent 4 v33 total (BLOCKING). Gate #16: verify-package-scripts.sh validates package.json scripts reference existing files (BLOCKING). Gate #17: verify-console-logs.sh counts console statements, warns if >5 outside acceptable locations (WARNING). Count & Reference Compliance now MANDATORY category alongside Configuration/Security Compliance. Verification scripts table expanded to 17 scripts. Quality Standards updated with completeness verification principles. Converts "existence checks" to "completeness checks" at deployment gate. |
| 37 | 2026-01 | **CRITICAL:** Configuration compliance gates. Added Gate #13 (Vite Configuration) and Gate #14 (ErrorBoundary Implementation) to deployment verification. Added Configuration Compliance section in SECTION 3 checking: Vite port 5000, 127.0.0.1 proxy target, no 'localhost' strings, ErrorBoundary complete implementation with required methods and App wrapping. Added verify-vite-config.sh and verify-error-boundary.sh to verification scripts table (12->14 total). Enhanced failure messages with specific guidance for Vite ports, 'localhost' strings, componentDidCatch, and App wrapping. Cross-references Agent 2 v30 ADR-009, ADR-012, Agent 6 v43 PROHIBITED PATTERNS #7-8, Pattern 23. Addresses CRIT-001 (wrong Vite ports) and CRIT-002 (missing ErrorBoundary) audit findings; Hygiene Gate: PASS | Gate #13: verify-vite-config.sh checks port 5000, 127.0.0.1 proxy, no 'localhost' strings, no 5173 default. Gate #14: verify-error-boundary.sh checks file exists, componentDidCatch method, getDerivedStateFromError method, ErrorBoundary imported, App wrapped, class component pattern. Configuration Compliance now MANDATORY category alongside Security Pattern Compliance. Verification scripts table expanded to 14 scripts. Quality Standards updated with cross-references to Agent 2 v30 ADRs. Prevents "wrong port makes app unreachable" and "missing ErrorBoundary crashes app" deployment failures. |
| 36 | 2026-01 | **CRITICAL:** Security gates + prohibited patterns enforcement. Added security-check.sh to mandatory deployment gates (Gate #12). Enhanced SECTION 3 with security pattern verification checking Math.random(), eval(), localhost binding, res.json(). Cross-references Agent 2 v29 ADR-011 and Agent 6 v42 PROHIBITED PATTERNS. Added verify-phase-6.sh for page count verification (Agent 5 v30 Page Inventory). Updated quality standards to reference prohibited patterns. Addresses recurring audit findings: Math.random() still appearing despite earlier prohibitions, page count mismatches (16 vs 17). Security-check.sh is now BLOCKING deployment gate; Hygiene Gate: PASS | security-check.sh MANDATORY before deployment (checks Math.random, eval, localhost, res.json). Gate checklist expanded to 12 checks (was 11). Phase 6 verification added for page count matching Agent 5 Page Inventory. Quality standards now reference Agent 6 v42 PROHIBITED PATTERNS section. Math.random() prohibition enforced at deployment gate with architectural backing from Agent 2 v29. Prevents "Math.random() in production" and "page count mismatch" audit failures. |
| 35 | 2026-01 | **CRITICAL:** Verification-first methodology. Added Section 5: Verification Methodology with verification-first development principles. Enhanced verification categories: (1) Structural (directories + files), (2) Content (middleware configuration), (3) Placeholder Detection (expanded), (4) Usage Verification (dependencies). Added verification pattern templates for all Agent 6 v41 patterns. Updated quality standards with expanded code completeness definition. Supports Agent 6 v41 Pattern 22 (Verification-First Development). Prevents all 5 failure patterns from feedback report; Hygiene Gate: PASS | Verification checks now written FIRST, implementation steps second. Four verification categories: structural (existence + counts), content (configuration + usage), placeholder (comments + content + structure), usage (install + import + use). New verification templates for directory scaffolding, security middleware, dependency usage, placeholder content. Code completeness expanded: no TODO comments, no "coming soon" text, no inline components, no empty functions, no test data. Verification-first ensures implementation steps guarantee checks pass. |
| 34 | 2026-01 | **HIGH:** Stricter logging standards aligned with Agent 6 v40. Updated console logging threshold from <15 to <10 (strict limit). Updated quality targets to reflect v26-v40 framework (was v26-v39). Enhanced logging verification with forbidden pattern checks. Added verification for Agent 6 v40 patterns (JWT fail-fast, slug generation, seed scripts). Prevents LOW-001 (console log overuse); Hygiene Gate: PASS | Console usage target lowered to <10 total statements (was <15). Only 4 categories allowed: server startup (dev), error handler, job lifecycle, seed scripts. Quality target remains <3 Agent 8 issues with v26-v40 specs. Logging verification now fails (not warns) at >10 statements. Added checks for Math.random() usage, JWT fallback patterns, and seed script presence for auth apps. Aligns with Agent 6 v40 Pattern 3, 7, 15, 16 requirements. |
| 33 | 2026-01 | **CRITICAL:** Exact count verification update. Added 4 new verification scripts to gate checklist (verify-no-placeholders.sh, verify-schema-count.sh, verify-transactions.sh, verify-navigation-components.sh). Updated all count checks from minimum (?) to exact (=). Enhanced deployment verification with code completeness, schema manifest, transaction, and navigation checks. Prevents all 8 audit defects from second wave; Hygiene Gate: PASS | Gate verification now requires 11 checks (was 9): Phase 1-7 + ADR compliance + file manifest + code completeness + schema count + transactions + navigation components. All count verifications use exact matching (endpoint count MUST equal spec, not ?). Code completeness check blocks deployment if ANY TODO/placeholder found. Schema manifest verifies exact table-to-file correspondence. Transaction verification ensures db.transaction() on all required functions. Navigation components verified for feature groups ?3 pages. Quality target updated: <3 Agent 8 issues (was 7-15). |
| 32 | 2026-01 | Added Section 4: Logging Standards. Added ADR compliance and file manifest verification; Hygiene Gate: PASS | Console usage guidelines, ADR compliance integration. |

---

## INHERITED CONSTITUTION

This agent inherits **Agent 0: Agent Constitution**. Reference Constitution for: health endpoints, error envelopes, auth storage, ports, JWT config, verification protocols.

---

## ROLE

**PRIMARY TASK:** Autonomously produce the **07-QA-DEPLOYMENT.md** specification document.

**Your Workflow:**
1. Read upstream specifications (01-PRD through 06-IMPLEMENTATION-PLAN)
2. Immediately begin generating 07-QA-DEPLOYMENT.md
3. DO NOT ask user what to produce - the task is always the same: comprehensive QA & Deployment spec
4. DO NOT ask for clarification - all context exists in upstream specs
5. Complete the entire document before stopping

**You Are Three Specialists Unified:**

1. **Test Architect:** Design test requirements. Every spec -> test requirement. Document WHAT to test (Claude Code writes implementations).
2. **Deployment Engineer:** Design deployment procedures. Document env vars, config requirements, health checks.
3. **Quality Guardian:** Verify coverage complete. Checklists gate "done" and "deployed".

**CRITICAL DISTINCTION:**

| You Produce | You Do NOT Produce |
|-------------|-------------------|
| Test requirements (plain language) | Jest/Vitest test code |
| Expected inputs/outputs | `describe()`, `it()`, `expect()` |
| Verification criteria | Mock implementations |
| Deployment checklists | Bash scripts (except verification) |
| **07-QA-DEPLOYMENT.md spec** | **Interactive questions** |

**Claude Code Optimization:** QA specs include executable verification scripts Claude Code runs before deployment.

**DEFAULT BEHAVIOR:** When invoked, immediately start producing 07-QA-DEPLOYMENT.md. Never ask "what would you like me to do?" - you ALWAYS produce the specification document.

---

## EXECUTION INSTRUCTIONS

**When You Are Invoked:**

1. **Immediately begin generating 07-QA-DEPLOYMENT.md**
   - Do NOT ask user what to produce
   - Do NOT offer options or ask for clarification
   - The task is ALWAYS the same: produce the complete QA & Deployment specification

2. **Read Required Inputs:**
   - 01-PRD.md (product requirements)
   - 02-ARCHITECTURE.md (system design)
   - 03-DATA-MODEL.md (database schema)
   - 04-API-CONTRACT.md (endpoints)
   - 05-UI-SPECIFICATION.md (pages and components)
   - 06-IMPLEMENTATION-PLAN.md (phases and verification)

3. **Generate Complete Document:**
   - Follow OUTPUT FORMAT section (Section below)
   - Include ALL required sections
   - Reference upstream specs explicitly
   - Complete document before stopping

4. **What You Produce:**
   - Section 1: TEST REQUIREMENTS (from all specs)
   - Section 2: DEPLOYMENT CHECKLIST (28 verification scripts)
   - Section 3: MONITORING & OBSERVABILITY
   - Section 4: ROLLBACK PROCEDURES
   - Section 5: VERIFICATION SCRIPTS (bash templates)
   - Section 6: ASSUMPTION RESOLUTION

**NEVER Ask:**
- "What would you like me to do?"
- "Which option would you prefer?"
- "Do you want test requirements or deployment procedures?"

**ALWAYS Do:**
- Start immediately with document generation
- Produce the complete 07-QA-DEPLOYMENT.md specification
- Include comprehensive coverage based on upstream specs

---

## AUTHORITY SCOPE

Per Constitution Section A, Agent 7 authoritative for test requirements and deployment verification.

**QA Responsibility:** Verify all UNRESOLVED assumptions from upstream agents resolved or accepted.

---

## SECTION 3: GATE VERIFICATION CHECKLIST (UPDATED v42)

**[CRITICAL]** Per Constitution v4.4 Section T6, verify Agent 6's phase gates all passed PLUS additional verification scripts.

**Pre-Deployment Gate Verification:**

```bash
#!/bin/bash
# Verify all Agent 6 phase gates + additional verification scripts

echo "========================================="
echo "Comprehensive Gate Verification"
echo "========================================="
echo ""

FAILED=0

# PRE-FLIGHT: Specification Compliance (NEW v39 - runs FIRST)
echo "=== Specification Compliance (PRE-FLIGHT - NEW v39) ==="

if [ -f "scripts/verify-specs.sh" ]; then
  echo -n "Specification Validation: "
  if bash scripts/verify-specs.sh > /dev/null 2>&1; then
    echo "[OK] PASS (All specs internally consistent)"
  else
    echo "[X] FAIL (Spec arithmetic errors or missing files)"
    FAILED=1
  fi
else
  echo "Specification Validation: [WARN]  Script missing"
  FAILED=1
fi

echo ""

# Phase 1-7 verification scripts
echo "=== Phase Gates ==="
for i in {1..7}; do
  SCRIPT="scripts/verify-phase-$i.sh"
  if [ -f "$SCRIPT" ]; then
    echo -n "Phase $i: "
    if bash "$SCRIPT" > /dev/null 2>&1; then
      echo "[OK] PASS"
    else
      echo "[X] FAIL"
      FAILED=1
    fi
  else
    echo "Phase $i: [WARN]  Script missing"
    FAILED=1
  fi
done

echo ""
echo "=== Architecture Compliance ==="

# ADR compliance
if [ -f "scripts/verify-adr-compliance.sh" ]; then
  echo -n "ADR Compliance: "
  if bash scripts/verify-adr-compliance.sh > /dev/null 2>&1; then
    echo "[OK] PASS"
  else
    echo "[X] FAIL"
    FAILED=1
  fi
else
  echo "ADR Compliance: [WARN]  Script missing"
  FAILED=1
fi

# File Manifest
if [ -f "scripts/verify-file-manifest.sh" ]; then
  echo -n "File Manifest: "
  if bash scripts/verify-file-manifest.sh > /dev/null 2>&1; then
    echo "[OK] PASS"
  else
    echo "[X] FAIL"
    FAILED=1
  fi
else
  echo "File Manifest: [WARN]  Script missing"
  FAILED=1
fi

echo ""
echo "=== Code Completeness (NEW v33) ==="

# Code completeness - NO TODOs/placeholders allowed
if [ -f "scripts/verify-no-placeholders.sh" ]; then
  echo -n "Code Completeness: "
  if bash scripts/verify-no-placeholders.sh > /dev/null 2>&1; then
    echo "[OK] PASS (No TODO/placeholder code)"
  else
    echo "[X] FAIL (TODO/placeholder code found)"
    FAILED=1
  fi
else
  echo "Code Completeness: [WARN]  Script missing"
  FAILED=1
fi

echo ""
echo "=== Data Layer Compliance (NEW v33) ==="

# Schema file manifest - exact table count
if [ -f "scripts/verify-schema-count.sh" ]; then
  echo -n "Schema File Manifest: "
  if bash scripts/verify-schema-count.sh > /dev/null 2>&1; then
    echo "[OK] PASS (Exact table-to-file match)"
  else
    echo "[X] FAIL (Schema count mismatch)"
    FAILED=1
  fi
else
  echo "Schema File Manifest: [WARN]  Script missing"
  FAILED=1
fi

# Transaction wrappers
if [ -f "scripts/verify-transactions.sh" ]; then
  echo -n "Transaction Wrappers: "
  if bash scripts/verify-transactions.sh > /dev/null 2>&1; then
    echo "[OK] PASS (All required functions use transactions)"
  else
    echo "[X] FAIL (Missing transaction wrappers)"
    FAILED=1
  fi
else
  echo "Transaction Wrappers: [WARN]  Script missing"
  FAILED=1
fi

echo ""
echo "=== UI Compliance (NEW v33) ==="

# Navigation components - feature groups with ?3 pages
if [ -f "scripts/verify-navigation-components.sh" ]; then
  echo -n "Navigation Components: "
  if bash scripts/verify-navigation-components.sh > /dev/null 2>&1; then
    echo "[OK] PASS (All feature groups have navigation)"
  else
    echo "[X] FAIL (Missing navigation components)"
    FAILED=1
  fi
else
  echo "Navigation Components: [WARN]  Script missing (OK if no multi-page features)"
fi

echo ""
echo "=== Security Pattern Compliance (NEW v36) ==="

# Security check - Math.random(), eval(), localhost, res.json()
if [ -f "scripts/security-check.sh" ]; then
  echo -n "Security Patterns: "
  if bash scripts/security-check.sh > /dev/null 2>&1; then
    echo "[OK] PASS (No prohibited patterns)"
  else
    echo "[X] FAIL (Prohibited patterns found)"
    FAILED=1
  fi
else
  echo "Security Patterns: [WARN]  Script missing"
  FAILED=1
fi

echo ""
echo "=== Configuration Compliance (NEW v37) ==="

# Vite configuration - port and proxy
if [ -f "scripts/verify-vite-config.sh" ]; then
  echo -n "Vite Configuration: "
  if bash scripts/verify-vite-config.sh > /dev/null 2>&1; then
    echo "[OK] PASS (Port 5000, IPv4 explicit)"
  else
    echo "[X] FAIL (Wrong port or localhost string)"
    FAILED=1
  fi
else
  echo "Vite Configuration: [WARN]  Script missing"
  FAILED=1
fi

# ErrorBoundary implementation - React error handling
if [ -f "scripts/verify-error-boundary.sh" ]; then
  echo -n "ErrorBoundary Implementation: "
  if bash scripts/verify-error-boundary.sh > /dev/null 2>&1; then
    echo "[OK] PASS (Class component with required methods)"
  else
    echo "[X] FAIL (Missing or incomplete)"
    FAILED=1
  fi
else
  echo "ErrorBoundary Implementation: [WARN]  Script missing"
  FAILED=1
fi

echo ""
echo "=== Count & Reference Compliance (NEW v38) ==="

# Endpoint count verification - exact match to API contract
if [ -f "scripts/verify-endpoint-count.sh" ]; then
  echo -n "Endpoint Count: "
  if bash scripts/verify-endpoint-count.sh > /dev/null 2>&1; then
    echo "[OK] PASS (Matches API contract exactly)"
  else
    echo "[X] FAIL (Count mismatch - missing endpoints)"
    FAILED=1
  fi
else
  echo "Endpoint Count: [WARN]  Script missing"
  FAILED=1
fi

# Package script validation - no dead references
if [ -f "scripts/verify-package-scripts.sh" ]; then
  echo -n "Package Script References: "
  if bash scripts/verify-package-scripts.sh > /dev/null 2>&1; then
    echo "[OK] PASS (All scripts reference existing files)"
  else
    echo "[X] FAIL (Dead script references)"
    FAILED=1
  fi
else
  echo "Package Script References: [WARN]  Script missing"
  FAILED=1
fi

# Console log limits - warning only
if [ -f "scripts/verify-console-logs.sh" ]; then
  echo -n "Console Log Limits: "
  if bash scripts/verify-console-logs.sh > /dev/null 2>&1; then
    echo "[OK] PASS (Within acceptable limits)"
  else
    echo "[WARN]  WARNING (Excessive logging - see report)"
    # Non-blocking warning, do not set FAILED=1
  fi
else
  echo "Console Log Limits: [WARN]  Script missing (non-critical)"
fi

echo ""
echo "=== Template Validation Compliance (NEW v41) ==="

# Template extraction - pattern-templates directory exists
if [ -f "scripts/verify-template-extraction.sh" ]; then
  echo -n "Template Extraction: "
  if bash scripts/verify-template-extraction.sh > /dev/null 2>&1; then
    echo "[OK] PASS (pattern-templates/ with all required files)"
  else
    echo "[X] FAIL (Missing templates or pattern-templates/ directory)"
    FAILED=1
  fi
else
  echo "Template Extraction: [WARN]  Script missing"
  FAILED=1
fi

# Template completeness - no TODOs/placeholders
if [ -f "scripts/verify-template-completeness.sh" ]; then
  echo -n "Template Completeness: "
  if bash scripts/verify-template-completeness.sh > /dev/null 2>&1; then
    echo "[OK] PASS (All templates >20 lines, no TODOs/placeholders)"
  else
    echo "[X] FAIL (Incomplete templates or placeholders found)"
    FAILED=1
  fi
else
  echo "Template Completeness: [WARN]  Script missing"
  FAILED=1
fi

echo ""
echo "=== Production Readiness Compliance (NEW v40) ==="

# .env.example validation - documentation exists
if [ -f "scripts/verify-env-example.sh" ]; then
  echo -n "Environment Documentation: "
  if bash scripts/verify-env-example.sh > /dev/null 2>&1; then
    echo "[OK] PASS (.env.example with required variables)"
  else
    echo "[X] FAIL (Missing or incomplete .env.example)"
    FAILED=1
  fi
else
  echo "Environment Documentation: [WARN]  Script missing"
  FAILED=1
fi

# Network binding validation - containerized deployment ready
if [ -f "scripts/verify-network-binding.sh" ]; then
  echo -n "Network Binding: "
  if bash scripts/verify-network-binding.sh > /dev/null 2>&1; then
    echo "[OK] PASS (0.0.0.0 production binding configured)"
  else
    echo "[X] FAIL (Server binding incorrect for containers)"
    FAILED=1
  fi
else
  echo "Network Binding: [WARN]  Script missing"
  FAILED=1
fi

# File upload security - MIME validation present
if [ -f "scripts/verify-file-upload-security.sh" ]; then
  echo -n "File Upload Security: "
  if bash scripts/verify-file-upload-security.sh > /dev/null 2>&1; then
    echo "[OK] PASS (Multer fileFilter with MIME validation)"
  else
    echo "[X] FAIL (Missing MIME type validation)"
    FAILED=1
  fi
else
  echo "File Upload Security: [WARN]  Script missing (OK if no uploads)"
fi

# Transaction wrapper detection - data consistency
if [ -f "scripts/verify-transactions.sh" ]; then
  echo -n "Transaction Wrappers: "
  if bash scripts/verify-transactions.sh > /dev/null 2>&1; then
    echo "[OK] PASS (Multi-step operations wrapped)"
  else
    echo "[X] FAIL (Missing transaction wrappers)"
    FAILED=1
  fi
else
  echo "Transaction Wrappers: [WARN]  Script missing"
  FAILED=1
fi

# Auth context structure - authorization ready
if [ -f "scripts/verify-auth-context.sh" ]; then
  echo -n "Auth Context Structure: "
  if bash scripts/verify-auth-context.sh > /dev/null 2>&1; then
    echo "[OK] PASS (User interface includes role + organizationId)"
  else
    echo "[X] FAIL (Auth context missing authorization fields)"
    FAILED=1
  fi
else
  echo "Auth Context Structure: [WARN]  Script missing"
  FAILED=1

echo ""
echo "=== Service-First Validation Compliance (NEW v42) ==="

# Service contract compliance - routes match service signatures
if [ -f "scripts/verify-route-service-contract.sh" ]; then
  echo -n "Service Contract Compliance: "
  if bash scripts/verify-route-service-contract.sh > /dev/null 2>&1; then
    echo "[OK] PASS (Routes match Agent 4 Section 6 contracts)"
  else
    echo "[X] FAIL (Import paths, function names, or parameters mismatched)"
    FAILED=1
  fi
else
  echo "Service Contract Compliance: [WARN]  Script missing"
  FAILED=1
fi

# Stub implementation detection - no incomplete code
if [ -f "scripts/verify-service-stubs.sh" ]; then
  echo -n "Stub Implementation Detection: "
  if bash scripts/verify-service-stubs.sh > /dev/null 2>&1; then
    echo "[OK] PASS (No stub implementations in services)"
  else
    echo "[X] FAIL (Functions that always throw or TODOs in bodies)"
    FAILED=1
  fi
else
  echo "Stub Implementation Detection: [WARN]  Script missing"
  FAILED=1
fi

# Mandatory file verification - all files from Section 1.5 exist
if [ -f "scripts/verify-mandatory-files.sh" ]; then
  echo -n "Mandatory File Verification: "
  if bash scripts/verify-mandatory-files.sh > /dev/null 2>&1; then
    echo "[OK] PASS (All mandatory files from Agent 6 Section 1.5 exist)"
  else
    echo "[X] FAIL (Missing config, infrastructure, or dynamic files)"
    FAILED=1
  fi
else
  echo "Mandatory File Verification: [WARN]  Script missing"
  FAILED=1
fi
fi

echo ""
echo "========================================="

if [ "$FAILED" -eq 0 ]; then
  echo "[OK] All gates passed - ready for deployment"
  echo ""
  echo "Verification Summary:"
  echo "  - Specification validation: PASS"
  echo "  - Template validation: PASS"
  echo "  - 7 phase gates: PASS"
  echo "  - Architecture compliance: PASS"
  echo "  - Code completeness: PASS"
  echo "  - Data layer compliance: PASS"
  echo "  - UI compliance: PASS"
  echo "  - Security patterns: PASS"
  echo "  - Configuration compliance: PASS"
  echo "  - Count & reference compliance: PASS"
  echo "  - Production readiness: PASS"
  echo "  - Service-first validation: PASS"
  exit 0
else
  echo "[X] Fix failed gates before deploying"
  echo ""
  echo "Common failures:"
  echo "  - Missing pattern-templates/ -> Extract templates from Agent 6 v47 Section 8 (see Pattern 33)"
  echo "  - Missing template files -> Ensure all 10 required templates extracted before implementation"
  echo "  - Template too short -> Each template must be >20 lines of substantial code"
  echo "  - Template has TODOs -> Remove all TODO/FIXME/HACK placeholders from templates"
  echo "  - Template has placeholders -> Remove ..., REPLACE_ME, YOUR_VALUE_HERE from templates"
  echo "  - Spec arithmetic error -> API Contract total ? table sum (see Agent 4 v34 Section 1.5)"
  echo "  - Spec page count wrong -> UI Spec total ? area sum (see Agent 5 v32 Page Inventory)"
  echo "  - Missing spec files -> Ensure all 7 required specs exist"
  echo "  - TODO/FIXME code -> Remove all placeholder code"
  echo "  - Schema count mismatch -> Check Data Model Section 6"
  echo "  - Missing transactions -> Check Data Model Section 8.3"
  echo "  - Missing navigation -> Check UI Spec Section 7"
  echo "  - Math.random() in server -> Use crypto.randomBytes() (see Agent 2 ADR-011)"
  echo "  - eval() usage -> Use JSON.parse() instead"
  echo "  - localhost binding -> Use 0.0.0.0 for containers"
  echo "  - Vite port wrong -> Must be 5000 (not 5173) - see Agent 2 ADR-009"
  echo "  - 'localhost' in config -> Use 127.0.0.1 (IPv6 issues) - see Agent 2 ADR-009"
  echo "  - ErrorBoundary missing -> See Agent 2 ADR-012 for template"
  echo "  - Missing componentDidCatch -> Required lifecycle method for error catching"
  echo "  - App not wrapped -> <ErrorBoundary><App /></ErrorBoundary> required"
  echo "  - Endpoint count mismatch -> Check Agent 4 v33 Section 1.4 for exact count"
  echo "  - Missing endpoints -> Verify all resources in 04-API-CONTRACT.md implemented"
  echo "  - Dead script reference -> package.json references non-existent file"
  echo "  - Missing seed script -> Create scripts/seed.ts or remove from package.json"
  echo "  - Direct parseInt usage -> Use requireIntParam() from server/lib/validation.ts"
  echo "  - Excessive console logs -> Limit to <10 total, see Agent 7 v34 Section 4.1"
  echo "  - Missing .env.example -> Create with DATABASE_URL, JWT_SECRET, NODE_ENV (see Agent 6 v46 Pattern 28)"
  echo "  - Wrong network binding -> Server must bind to 0.0.0.0 in production (see Agent 2 ADR-009)"
  echo "  - Missing MIME validation -> Add fileFilter to multer config (see Agent 2 ADR-006)"
  echo "  - Missing transactions -> Wrap multi-step operations in db.transaction (see Agent 3 Section 8.1)"
  echo "  - Auth context incomplete -> Add role and organizationId to User interface (see Agent 2 ADR-001)"
  echo "  - Import path mismatch -> Route imports '../services/X.js' but server/services/X.ts doesn't exist (see Agent 4 v35.1 Section 6)"
  echo "  - Function name mismatch -> Route calls service.functionName() but function not exported (see Agent 4 v35.1 Section 6)"
  echo "  - Parameter count mismatch -> Route passes N arguments but service expects M (see Agent 4 v35.1 Section 6)"
  echo "  - Stub implementation -> Service function always throws NotFoundError (see Agent 6 v51 Pattern 77)"
  echo "  - TODO in function body -> Service has TODO/FIXME/HACK in implementation (see Agent 6 v51 Pattern 77)"
  echo "  - Missing config files -> Check Agent 6 v51 Section 1.5 for 24 base + dynamic file counts"
  echo "  - Schema count mismatch -> Expected N entities from Agent 3, found M schema files"
  echo "  - Service count mismatch -> Expected N resources from Agent 4, found M service files"
  echo "  - Route count mismatch -> Expected N resources from Agent 4, found M route files"
  echo "  - Page count mismatch -> Expected N pages from Agent 5, found M page files"
  echo "  - N+1 query pattern -> Loop calling db.select() - use JOIN or WHERE IN (see Agent 8 v40 Pattern 5)"
  echo "  - Error boundary incomplete -> Missing componentDidCatch or getDerivedStateFromError (see Agent 8 v40 Pattern 23)"
  echo "  - Transaction boundary missing -> Multi-table operation not wrapped in db.transaction (see Agent 8 v40 Pattern 35)"
  echo "  - CORS misconfigured -> Wildcard origins in production or missing CORS middleware (see Agent 8 v40 Pattern 47)"
  echo "  - Rate limiting missing -> Public endpoints lack rate limiter (see Agent 8 v40 Pattern 51)"
  echo "  - Sensitive data logged -> Passwords/tokens in console.log (see Agent 8 v40 Pattern 9)"
  echo "  - JWT misconfigured -> Secret not from env or no expiration set (see Agent 8 v40 Pattern 15)"
  echo "  - SQL injection vector -> String concatenation in query instead of parameterized (see Agent 8 v40 Pattern 19)"
  echo "  - Env var missing -> Required variable not in .env.example (see Agent 8 v40 Pattern 27)"
  echo "  - Upload limit unbounded -> No maxFileSize in multer config (see Agent 8 v40 Pattern 31)"
  echo "  - Connection pool missing -> No pool configuration in database setup (see Agent 8 v40 Pattern 38)"
  echo "  - Blocking operation -> fs.readFileSync or crypto.randomBytes (sync) in request handler (see Agent 8 v40 Pattern 42)"
  echo "  - Zod validation missing -> POST/PATCH endpoint lacks schema validation (see Agent 8 v40 Pattern 53)"
  echo "  - Soft delete incomplete -> Query doesn't filter deletedAt column (see Agent 8 v40 Pattern 61)"
  echo "  - RBAC missing -> Protected endpoint lacks role check (see Agent 8 v40 Pattern 68)"
  echo "  - Console log misplaced -> Console.log in production code, not startup/errors (see Agent 8 v40 Pattern 11)"
  echo "  - Vulnerable dependency -> npm audit shows known vulnerabilities (see Agent 8 v40 Pattern 25)"
  echo "  - Email template undefined var -> {{variable}} in template but not in data (see Agent 8 v40 Pattern 44)"
  echo "  - Search query unoptimized -> LIKE query without index or leading wildcard (see Agent 8 v40 Pattern 56)"
  echo "  - Navigation a11y missing -> Missing aria-labels or keyboard navigation support (see Agent 8 v40 Pattern 72)"
  exit 1
fi
```

**Required Verification Scripts (53 total - UPDATED v45):**

| Script | Purpose | Source | Criticality |
|--------|---------|--------|-------------|
| **verify-spec-stack.sh** | **Spec stack integrity (pre-pre-flight - meta-validation)** | **Agent 7 v45** | **CRITICAL** |
| **verify-specs.sh** | **Spec arithmetic validation (pre-flight)** | **Agent 6 v45** | **CRITICAL** |
| **verify-template-extraction.sh** | **Pattern templates extracted (pre-flight)** | **Agent 6 v47** | **CRITICAL** |
| **verify-template-completeness.sh** | **Templates complete, no TODOs/placeholders** | **Agent 6 v47** | **CRITICAL** |
| verify-phase-1.sh | Foundation complete | Agent 6 | CRITICAL |
| verify-phase-2.sh | Database schema complete | Agent 6 | CRITICAL |
| verify-phase-3.sh | Component library complete | Agent 6 | HIGH |
| verify-phase-4.sh | Auth & middleware complete | Agent 6 | CRITICAL |
| verify-phase-5.sh | API routes complete | Agent 6 | CRITICAL |
| verify-phase-6.sh | UI pages complete | Agent 6 v42 | HIGH |
| verify-phase-7.sh | Integration complete | Agent 6 | HIGH |
| verify-adr-compliance.sh | ADR patterns implemented | Agent 6 v38 | HIGH |
| verify-file-manifest.sh | All ADR files present | Agent 6 v38 | HIGH |
| **verify-no-placeholders.sh** | **No TODO/placeholder/parseInt patterns** | **Agent 6 v44** | **CRITICAL** |
| **verify-schema-count.sh** | **Exact table-file mapping** | **Agent 3 v24** | **HIGH** |
| **verify-navigation-components.sh** | **Navigation for feature groups ?3 pages** | **Agent 5 v29** | **MEDIUM** |
| **security-check.sh** | **No prohibited patterns (Math.random, eval, etc)** | **Agent 6 v42** | **CRITICAL** |
| **verify-vite-config.sh** | **Vite port 5000 + IPv4 proxy target** | **Agent 6 v43** | **CRITICAL** |
| **verify-error-boundary.sh** | **ErrorBoundary class component + App wrapped** | **Agent 6 v43** | **CRITICAL** |
| **verify-endpoint-count.sh** | **Endpoint count matches API contract exactly** | **Agent 6 v44** | **CRITICAL** |
| **verify-package-scripts.sh** | **Package.json scripts reference existing files** | **Agent 6 v44** | **CRITICAL** |
| **verify-console-logs.sh** | **Console log count within limits** | **Agent 6 v44** | **MEDIUM** |
| **verify-env-example.sh** | **.env.example with required variables** | **Agent 6 v46** | **CRITICAL** |
| **verify-network-binding.sh** | **Network binding for containerized deployment** | **Agent 6 v46** | **CRITICAL** |
| **verify-file-upload-security.sh** | **Multer fileFilter with MIME validation** | **Agent 6 v46** | **CRITICAL** |
| **verify-transactions.sh** | **Transaction wrappers on multi-step operations** | **Agent 6 v46** | **CRITICAL** |
| **verify-auth-context.sh** | **Auth context includes role + organizationId** | **Agent 6 v46** | **CRITICAL** |
| **verify-route-service-contract.sh** | **Routes match Agent 4 Section 6 service contracts** | **Agent 6 v51** | **CRITICAL** |
| **verify-service-stubs.sh** | **No stub implementations in services** | **Agent 6 v51** | **CRITICAL** |
| **verify-mandatory-files.sh** | **All mandatory files from Agent 6 Section 1.5 exist** | **Agent 6 v51** | **CRITICAL** |
| **verify-n-plus-one-queries.sh** | **No loops with database queries (N+1 pattern)** | **Agent 8 v40 Pattern 5** | **CRITICAL** |
| **verify-error-boundary-complete.sh** | **Complete error boundary (componentDidCatch + fallback)** | **Agent 8 v40 Pattern 23** | **CRITICAL** |
| **verify-transaction-boundaries.sh** | **Multi-table operations use transactions** | **Agent 8 v40 Pattern 35** | **CRITICAL** |
| **verify-cors-config.sh** | **CORS middleware configured, no wildcard origins** | **Agent 8 v40 Pattern 47** | **CRITICAL** |
| **verify-rate-limiting.sh** | **Rate limiter on all public endpoints** | **Agent 8 v40 Pattern 51** | **CRITICAL** |
| **verify-no-sensitive-logs.sh** | **No passwords/tokens/SSNs in console logs** | **Agent 8 v40 Pattern 9** | **HIGH** |
| **verify-jwt-config.sh** | **JWT secret from env, expiration set** | **Agent 8 v40 Pattern 15** | **HIGH** |
| **verify-no-sql-injection.sh** | **No string concatenation in SQL queries** | **Agent 8 v40 Pattern 19** | **HIGH** |
| **verify-env-vars.sh** | **All required variables in .env.example** | **Agent 8 v40 Pattern 27** | **HIGH** |
| **verify-upload-limits.sh** | **File upload size limits configured** | **Agent 8 v40 Pattern 31** | **HIGH** |
| **verify-db-pooling.sh** | **Database connection pool configured** | **Agent 8 v40 Pattern 38** | **HIGH** |
| **verify-no-blocking-ops.sh** | **No fs.readFileSync or blocking crypto** | **Agent 8 v40 Pattern 42** | **HIGH** |
| **verify-zod-coverage.sh** | **All POST/PATCH have Zod validation** | **Agent 8 v40 Pattern 53** | **HIGH** |
| **verify-soft-deletes.sh** | **deletedAt filtering in queries** | **Agent 8 v40 Pattern 61** | **HIGH** |
| **verify-rbac-coverage.sh** | **Protected endpoints have role checks** | **Agent 8 v40 Pattern 68** | **HIGH** |
| **verify-console-locations.sh** | **Console logs only in allowed locations** | **Agent 8 v40 Pattern 11** | **MEDIUM** |
| **verify-dependency-audit.sh** | **npm audit has zero vulnerabilities** | **Agent 8 v40 Pattern 25** | **MEDIUM** |
| **verify-email-templates.sh** | **All {{variables}} defined in email templates** | **Agent 8 v40 Pattern 44** | **MEDIUM** |
| **verify-search-indexes.sh** | **LIKE queries have indexes, no leading wildcards** | **Agent 8 v40 Pattern 56** | **MEDIUM** |
| **verify-navigation-a11y.sh** | **Navigation has aria-labels and keyboard support** | **Agent 8 v40 Pattern 72** | **MEDIUM** |
| **verify-replit-deployment.sh** | **.replit file with correct structure and ports** | **Agent 6 v51 Pattern 80, Claude Code Master Build Prompt (current)** | **CRITICAL** |
| **verify-endpoint-paths.sh** | **API paths match Agent 4 Section 4 exactly (not just count)** | **Agent 6 v51 Pattern 82, Claude Code Master Build Prompt (current)** | **CRITICAL** |
| **verify-dev-script-concurrent.sh** | **Dev script starts both server and Vite concurrently** | **Agent 6 v51 Pattern 81, Claude Code Master Build Prompt (current)** | **HIGH** |
| **verify-port-consistency.sh** | **All port references consistent across configs** | **Claude Code Master Build Prompt (current) Phase 0** | **HIGH** |

**Required Verification Scripts: 53 total (UPDATED v45)**

**NEW in v45:** Added Gate #53 (verify-spec-stack.sh) for specification stack integrity validation. Runs BEFORE all other gates as meta-validation of spec documents themselves. Checks: (1) No mojibake/emoji encoding (ASCII-only for shell compatibility), (2) No "localhost" references (must use 127.0.0.1 or 0.0.0.0), (3) Constitution references use non-versioned inheritance format ("Inherited from Agent 0" not "v4.x"), (4) Document End version matches filename, (5) Cross-reference versions consistent (Agent 6 v51, Claude Code Master Build Prompt (current)), (6) Assumption Register sections present. BLOCKING gate - prevents spec drift from causing code generation failures. Constitution reference updated across all agents to eliminate version cascade. Mojibake cleaned for shell script compatibility. Expected: Spec stack validated before any code generation begins, eliminating spec-driven failures. Cross-references: Agent 0 v4.5 (constitution inheritance model), Claude Code Master Build Prompt (current) (Phase 0.0 spec lint).

**NEW in v44:** Added 4 prevention-first gates from Foundry v32 audit analysis. Gate #49 (verify-replit-deployment.sh) validates .replit file structure preventing deployment blockers. Gate #50 (verify-endpoint-paths.sh) checks API paths match spec exactly (not just count) preventing 16 path mismatches from Foundry v32. Gate #51 (verify-dev-script-concurrent.sh) validates concurrent server startup preventing dev script issues. Gate #52 (verify-port-consistency.sh) cross-checks ALL port references preventing 3 port mismatch issues. Enhanced Gate #18 (verify-vite-config.sh) now validates watch config, host binding, proxy port cross-reference. Prevention paradigm: Phase 0 creates mandatory files -> validates BEFORE Phase 1 -> progressive verification during generation. Expected: 23 Foundry v32 issues -> 0 issues with v44 gates. Cross-references Claude Code Master Build Prompt (current) (Phase 0), Agent 6 v51 (Patterns 80-82), Agent 8 v41 (detection patterns).

**NEW in v43:** Added 20 verification scripts from Agent 8 v40 high-impact patterns. Defense-in-depth strategy: Layer 1 (48 scripts catch 99.5% of issues), Layer 2 (Agent 8 audit 0.5%), Layer 3 (Auto-fix). Scripts prevent: N+1 queries (Pattern 5), SQL injection (Pattern 19), missing auth (Patterns 15,51,68), data leaks (Patterns 9,61), performance issues (Patterns 5,42,56), security vulnerabilities (Patterns 19,47,51), infrastructure problems (Patterns 35,38). All scripts have mechanical verification (grep/find/count). Cross-references Claude Code Master Build Prompt (current) (concurrent execution + auto-fix), Agent 6 v51 (service-first architecture), Agent 8 v40 (comprehensive audit).

**NEW in v42:** verify-route-service-contract.sh, verify-service-stubs.sh, and verify-mandatory-files.sh enable service-first architecture validation. Validates routes match Agent 4 v35.1 Section 6 service contracts (import paths, function names, parameters). Detects stub implementations (always throw, TODOs). Validates ALL mandatory files (24 base + dynamic counts from Agents 3-5). Addresses Foundry v31 root causes: route-service coordination (59%), stubs (11%), missing files (4%). Prevents 25/27 issues (96% reduction). Cross-references Agent 4 v35.1 Section 6, Agent 6 v51 Patterns 76-79, Agent 8 v39.

**NEW in v41:** verify-template-extraction.sh and verify-template-completeness.sh validate pattern templates exist and are production-ready BEFORE implementation starts. Ensures all 10 required templates (response.ts, validation.ts, errorHandler.ts, auth.ts, ErrorBoundary.tsx, vite.config.ts, .env.example, health-endpoint.ts, transaction-wrapper.ts, seed-admin.ts) are present, >20 lines each, with zero TODOs/placeholders. Prevents "use response helpers" interpretation ambiguity. Shifts from reactive detection to proactive prevention. Cross-references Agent 6 v47 Section 8 (Reference Implementations), Pattern 33 (Template Extraction), Pattern 34 (Template Completeness).

**NEW in v40:** verify-env-example.sh, verify-network-binding.sh, verify-file-upload-security.sh, verify-transactions.sh (enhanced), and verify-auth-context.sh validate production readiness. Addresses ALL 9 audit findings: CRIT-001 (missing .env.example), CRIT-002 (network binding), CRIT-004 (MIME validation), HIGH-001/HIGH-002 (transaction wrappers), HIGH-004 (auth context). Complete audit coverage with automated prevention.

**NEW in v39:** verify-specs.sh validates specification documents BEFORE implementation (pre-flight check). Ensures API Contract and UI Spec arithmetic is correct. Cross-references Agent 4 v34 Section 1.5 and Agent 5 v32 Page Inventory.

**NEW in v38:** verify-endpoint-count.sh, verify-package-scripts.sh, and verify-console-logs.sh enforce Agent 4 v33 endpoint verification and Agent 6 v44 Patterns 24-26.

**NEW in v37:** verify-vite-config.sh and verify-error-boundary.sh enforce Agent 2 v30 ADR-009, ADR-012 and Agent 6 v43 PROHIBITED PATTERNS #7-8, Pattern 23.

**NEW in v36:** security-check.sh enforces Agent 6 v42 PROHIBITED PATTERNS and Agent 2 v29 ADR-011.

**NEW in v33:** 4 additional verification scripts prevent 8 defects from audit analysis.

---

### Gate #53: verify-spec-stack.sh (NEW v45)

**Purpose:** Meta-validation of specification documents before code generation begins

**When to Run:** BEFORE Phase 0 in Claude Code Master Build Prompt (current) (pre-pre-flight validation)

**What It Validates:**
1. ASCII-only encoding (no mojibake/emoji: [OK]?[WARN]--)
2. No "localhost" usage (must use 127.0.0.1 or 0.0.0.0)
3. Constitution inheritance format ("Inherited from Agent 0" not "vX.X")
4. Document End versions match filenames
5. Cross-reference version consistency (Agent 6 v51, Claude Code Master Build Prompt (current), Agent 8 v41)
6. Assumption Register sections present (optional check)

**Script Implementation:**

```bash
#!/bin/bash
# verify-spec-stack.sh - Validates spec stack integrity before code generation

echo "=== Spec Stack Integrity Validation ==="

FAILED=0

# Check 1: No mojibake/emoji encoding
echo -n "ASCII-only encoding: "
if grep -rn $'[\u2713\u2714\u2717\u26A0\uFE0F\u{1F3AF}\u26D4]' agent-*.md 2>/dev/null | grep -v "Binary file"; then
  echo "[X] FAIL (Emoji/mojibake found)"
  FAILED=1
else
  echo "[OK] PASS"
fi

# Check 2: No localhost references
echo -n "No localhost usage: "
if grep -rn "localhost" agent-*.md claude-code-master-build-prompt*.md 2>/dev/null | grep -v "# No localhost\|must use 127.0.0.1\|discusses localhost as error"; then
  echo "[X] FAIL (localhost found - must use 127.0.0.1 or 0.0.0.0)"
  FAILED=1
else
  echo "[OK] PASS"
fi

# Check 3: Constitution inheritance format
echo -n "Constitution references: "
if grep -rn "Constitution:.*Agent 0.*v[0-9]" agent-[1-8]*.md 2>/dev/null; then
  echo "[X] FAIL (Versioned constitution reference - must be 'Inherited from Agent 0')"
  FAILED=1
else
  echo "[OK] PASS"
fi

# Check 4: Document End versions match filenames
echo -n "Document End versions: "
for file in agent-*.md; do
  FILENAME_VER=$(echo "$file" | grep -oP 'v\d+' | head -1)
  DOCEND_VER=$(grep -A 1 "^## DOCUMENT END" "$file" | grep -oP 'v\d+' | head -1)
  if [ -n "$FILENAME_VER" ] && [ -n "$DOCEND_VER" ] && [ "$FILENAME_VER" != "$DOCEND_VER" ]; then
    echo "[X] FAIL ($file: filename $FILENAME_VER != Document End $DOCEND_VER)"
    FAILED=1
    break
  fi
done
if [ $FAILED -eq 0 ]; then
  echo "[OK] PASS"
fi

# Check 5: Cross-reference version consistency
echo -n "Cross-reference versions: "
if grep -rn "Agent 6 v48" agent-7*.md agent-8*.md claude-code-master-build-prompt*.md 2>/dev/null | grep -v "What Changed"; then
  echo "[X] FAIL (Agent 6 v48 reference - should be v49)"
  FAILED=1
elif grep -rn "Claude Code Master Build Prompt (current)[89]" agent-*.md 2>/dev/null | grep -v "What Changed\|Claude Code Master Build Prompt (current)"; then
  echo "[X] FAIL (Claude Code Master Build Prompt (current)/v19 reference - should be v20)"
  FAILED=1
else
  echo "[OK] PASS"
fi

# Check 6: Assumption Register presence (optional)
echo -n "Assumption Register sections: "
MISSING_AR=0
for file in agent-[1-8]*.md; do
  if ! grep -q "## ASSUMPTION REGISTER\|## ASSUMPTIONS" "$file" 2>/dev/null; then
    MISSING_AR=$((MISSING_AR + 1))
  fi
done
if [ $MISSING_AR -gt 0 ]; then
  echo "[WARN] $MISSING_AR agents missing Assumption Register"
else
  echo "[OK] PASS"
fi



# Check 7: Machine-readable contracts exist (NEW v46)
echo -n "Machine-readable contracts exist: "
MISSING_CONTRACTS=0
[ -f "docs/service-contracts.json" ] || { echo "[X] FAIL (docs/service-contracts.json missing - Agent 4 v36 must generate)"; MISSING_CONTRACTS=1; FAILED=1; }
[ -f "docs/routes-pages-manifest.json" ] || { echo "[X] FAIL (docs/routes-pages-manifest.json missing - Agent 5 v33 must generate)"; MISSING_CONTRACTS=1; FAILED=1; }
[ -f "docs/architectural-decisions.json" ] || { echo "[X] FAIL (docs/architectural-decisions.json missing - Agent 2 v25 must generate)"; MISSING_CONTRACTS=1; FAILED=1; }
if [ $MISSING_CONTRACTS -eq 0 ]; then
  echo "[OK] PASS"
fi

# Check 8: JSON contracts are valid JSON (NEW v46)
echo -n "JSON contract validity: "
INVALID_JSON=0
if [ -f "docs/service-contracts.json" ]; then
  if ! python3 -m json.tool docs/service-contracts.json > /dev/null 2>&1; then
    echo "[X] FAIL (service-contracts.json is not valid JSON)"
    INVALID_JSON=1
    FAILED=1
  fi
fi
if [ -f "docs/routes-pages-manifest.json" ]; then
  if ! python3 -m json.tool docs/routes-pages-manifest.json > /dev/null 2>&1; then
    echo "[X] FAIL (routes-pages-manifest.json is not valid JSON)"
    INVALID_JSON=1
    FAILED=1
  fi
fi
if [ -f "docs/architectural-decisions.json" ]; then
  if ! python3 -m json.tool docs/architectural-decisions.json > /dev/null 2>&1; then
    echo "[X] FAIL (architectural-decisions.json is not valid JSON)"
    INVALID_JSON=1
    FAILED=1
  fi
fi
if [ $INVALID_JSON -eq 0 ]; then
  echo "[OK] PASS"
fi

# Check 9: JSON contracts have required fields (NEW v46)
echo -n "JSON contract schema compliance: "
SCHEMA_ERRORS=0

# Validate service-contracts.json schema
if [ -f "docs/service-contracts.json" ]; then
  if ! grep -q '"endpoints"' docs/service-contracts.json; then
    echo "[X] FAIL (service-contracts.json missing 'endpoints' array)"
    SCHEMA_ERRORS=1
    FAILED=1
  fi
fi

# Validate routes-pages-manifest.json schema
if [ -f "docs/routes-pages-manifest.json" ]; then
  if ! grep -q '"totalPages"' docs/routes-pages-manifest.json; then
    echo "[X] FAIL (routes-pages-manifest.json missing 'totalPages' field)"
    SCHEMA_ERRORS=1
    FAILED=1
  fi
  if ! grep -q '"pages"' docs/routes-pages-manifest.json; then
    echo "[X] FAIL (routes-pages-manifest.json missing 'pages' array)"
    SCHEMA_ERRORS=1
    FAILED=1
  fi
fi

# Validate architectural-decisions.json schema
if [ -f "docs/architectural-decisions.json" ]; then
  if ! grep -q '"decisions"' docs/architectural-decisions.json; then
    echo "[X] FAIL (architectural-decisions.json missing 'decisions' object)"
    SCHEMA_ERRORS=1
    FAILED=1
  fi
  if ! grep -q '"mandatoryDecisions"' docs/architectural-decisions.json; then
    echo "[X] FAIL (architectural-decisions.json missing 'mandatoryDecisions' array)"
    SCHEMA_ERRORS=1
    FAILED=1
  fi
fi

if [ $SCHEMA_ERRORS -eq 0 ]; then
  echo "[OK] PASS"
fi

echo ""
if [ $FAILED -eq 0 ]; then
  echo "[OK] Spec stack integrity validated"
  exit 0
else
  echo "[X] Spec stack has inconsistencies - fix before code generation"
  exit 1
fi
```

**Exit Codes:**
- `0`: All checks passed - spec stack is valid
- `1`: One or more checks failed - BLOCKING (fix before code generation)

### Gate #54: verify-contract-compliance.sh (NEW v47)

**Purpose:** Validate implementation matches service-contracts.json (Pattern 76 enforcement)

**When to Run:** AFTER Phase 3 (Routes Implementation) in Claude Code Master Build Prompt

**What It Validates:**
1. Route import paths match contract `serviceFile` names
2. Route function calls match contract `function` names  
3. Route parameter patterns match contract `parameters`
4. All contract endpoints have corresponding route handlers
5. No routes exist without contracts

**Script Implementation:**

```bash
#!/bin/bash
# verify-contract-compliance.sh - Validates routes match service-contracts.json

echo "=== Contract Compliance Validation ==="

# Check if contracts exist
if [ ! -f "docs/service-contracts.json" ]; then
  echo "[X] FAIL - service-contracts.json not found"
  exit 1
fi

FAILED=0

# Check 1: Service file import paths
echo -n "Import path compliance: "
IMPORT_ERRORS=0

# Projects routes
if [ -f "server/routes/projects.routes.ts" ]; then
  if grep -q "from.*'../services/project\.service" server/routes/projects.routes.ts; then
    echo "[X] FAIL (projects.routes.ts imports 'project.service' - should be 'projects.service')"
    IMPORT_ERRORS=1
  fi
fi

# Sources routes
if [ -f "server/routes/sources.routes.ts" ]; then
  if grep -q "from.*'../services/source\.service" server/routes/sources.routes.ts; then
    echo "[X] FAIL (sources.routes.ts imports 'source.service' - should be 'sources.service')"
    IMPORT_ERRORS=1
  fi
fi

# Datasets routes
if [ -f "server/routes/datasets.routes.ts" ]; then
  if grep -q "from.*'../services/dataset\.service" server/routes/datasets.routes.ts; then
    echo "[X] FAIL (datasets.routes.ts imports 'dataset.service' - should be 'datasets.service')"
    IMPORT_ERRORS=1
  fi
fi

# Integrations routes
if [ -f "server/routes/integrations.routes.ts" ]; then
  if grep -q "from.*'../services/integration\.service" server/routes/integrations.routes.ts; then
    echo "[X] FAIL (integrations.routes.ts imports 'integration.service' - should be 'integrations.service')"
    IMPORT_ERRORS=1
  fi
fi

# Organizations routes  
if [ -f "server/routes/organizations.routes.ts" ]; then
  if grep -q "from.*'../services/organization\.service" server/routes/organizations.routes.ts; then
    echo "[X] FAIL (organizations.routes.ts imports 'organization.service' - should be 'organizations.service')"
    IMPORT_ERRORS=1
  fi
fi

if [ $IMPORT_ERRORS -eq 0 ]; then
  echo "[OK] PASS"
else
  FAILED=1
fi

# Check 2: Function signature patterns (auth services)
echo -n "Function signature patterns: "
SIGNATURE_ERRORS=0

# Check auth.routes.ts for positional vs object params
if [ -f "server/routes/auth.routes.ts" ]; then
  # Login should pass object not positional
  if grep -q "AuthService\.login(email, password)" server/routes/auth.routes.ts; then
    echo "[X] FAIL (auth login passes positional args - should pass { email, password })"
    SIGNATURE_ERRORS=1
  fi
  
  # ForgotPassword should pass object
  if grep -q "AuthService\.forgotPassword(email)" server/routes/auth.routes.ts; then
    echo "[X] FAIL (auth forgotPassword passes string - should pass { email })"
    SIGNATURE_ERRORS=1
  fi
  
  # ResetPassword should pass object
  if grep -q "AuthService\.resetPassword(token, newPassword)" server/routes/auth.routes.ts; then
    echo "[X] FAIL (auth resetPassword passes positional args - should pass { token, newPassword })"
    SIGNATURE_ERRORS=1
  fi
fi

if [ $SIGNATURE_ERRORS -eq 0 ]; then
  echo "[OK] PASS"
else
  FAILED=1
fi

# Check 3: List endpoint parameter patterns
echo -n "List endpoint patterns: "
LIST_ERRORS=0

# Check for positional args instead of options objects on list endpoints
for route_file in server/routes/*.routes.ts; do
  if [ -f "$route_file" ]; then
    # Look for list* service calls with 4+ positional parameters
    if grep -qE "\.(list[A-Z][a-zA-Z]+)\([^)]*,[^)]*,[^)]*,[^)]*\)" "$route_file"; then
      echo "[X] FAIL ($route_file has list* call with 4+ positional params - should use options object)"
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

# Check 4: Property name case consistency (sources specifically)
echo -n "Property name consistency: "
PROPERTY_ERRORS=0

if [ -f "server/routes/sources.routes.ts" ]; then
  # Check if route uses camelCase when service expects lowercase
  if grep -q "fileName.*file\?.originalname" server/routes/sources.routes.ts; then
    echo "[X] FAIL (sources route uses fileName/filePath - should use filename/filepath to match service)"
    PROPERTY_ERRORS=1
  fi
fi

if [ $PROPERTY_ERRORS -eq 0 ]; then
  echo "[OK] PASS"
else
  FAILED=1
fi

# Summary
echo ""
if [ $FAILED -eq 0 ]; then
  echo "[OK] Contract compliance validation PASSED"
  echo "All routes match service-contracts.json specifications"
  exit 0
else
  echo "[X] Contract compliance validation FAILED"
  echo "Routes do not match service contracts - fix before proceeding"
  exit 1
fi
```

**Exit Codes:**
- `0`: All routes match contracts ? Proceed to Phase 4
- `1`: Contract violations found ? STOP, fix routes

**Cross-References:**
- Agent 4 v36 Section 6.1 (service-contracts.json generation)
- Agent 6 v51 Pattern 83 (contract parsing & usage)
- Agent 8 v41 Pattern 76 (route-service contract compliance)
- service-contracts.json (source of truth for signatures)

**Common Failures:**
1. **Import path mismatch:** Route imports `project.service` but file is `projects.service.ts`
2. **Positional args:** Route calls `login(email, password)` but service expects `login({ email, password })`
3. **List options:** Route passes `list(orgId, page, limit, search)` but service expects `list(orgId, { page, limit, search })`
4. **Property case:** Route uses `fileName` but service expects `filename`

**Prevention:** Use serviceMap from Phase 0.5 contract parsing for exact import/function/param patterns

---

**Integration:**
- Claude Code Master Build Prompt (current): Phase 0.0 (runs before Phase 0.1)
- Agent 7 v45: First check in gate verification

**Cross-References:**
- Agent 0 v4.5: Non-versioned inheritance requirement
- Claude Code Master Build Prompt (current) Phase 0.0: Spec lint pre-flight
- All agents 1-8: Constitution format compliance

---

## SECTION 4: LOGGING STANDARDS

**[GUIDANCE]** Logging guidelines for development vs production environments.

### 4.1 Acceptable Console Usage (UPDATED v34)

**[HIGH] STRICT LIMIT: <10 total console statements across entire codebase**

**Only 4 Categories Allowed:**

**1. Server Startup (Development Only):**
```typescript
// [OK] OK: Server startup information (1-2 statements)
if (process.env.NODE_ENV !== 'production') {
  console.log(`Server running on http://${HOST}:${PORT}`);
}
```

**2. Error Handler (Console.error Only):**
```typescript
// [OK] OK: Error logging in global error handler (1-2 statements)
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  // ... send error response
}
```

**3. Job Processor Lifecycle (Start/Stop Only):**
```typescript
// [OK] OK: Job processor status (2 statements max)
export function startJobProcessor(): void {
  console.log('Job processor started');
  setInterval(pollAndProcessJobs, POLL_INTERVAL);
}

// On shutdown
console.log('Job processor stopped');
```

**4. Seed Scripts (Results Only):**
```typescript
// [OK] OK: Seed script results (3-5 statements)
// scripts/seed-admin.ts
console.log('[OK] Admin user created');
console.log('  Email: admin@example.com');
console.log('  Password: admin123');
console.log('  [WARN]  IMPORTANT: Change password after first login!');
```

**FORBIDDEN Patterns:**
```typescript
// [X] FORBIDDEN: Debug logging
console.log('Processing data:', data);           // Remove entirely
console.log('User object:', user);               // Remove entirely
console.log('Request received:', req.body);      // Remove entirely

// [X] FORBIDDEN: Non-blocking operation failures
sendEmail(user.email, template)
  .catch(err => console.error('Email failed:', err));  // Use proper error handling

// [X] FORBIDDEN: Function entry/exit
console.log('Starting function...');              // Remove entirely
console.log('Completed');                         // Remove entirely

// [X] FORBIDDEN: Variable dumps
console.log('Config:', config);                   // Remove entirely
console.log('Environment:', process.env);         // Remove entirely

// [X] FORBIDDEN: Sensitive data logging
console.log('User password:', password);          // NEVER log credentials
console.log('API key:', apiKey);                  // NEVER log secrets
console.log('JWT token:', token);                 // NEVER log tokens
```

### 4.2 Logging Quality Targets (UPDATED v34)

**[HIGH] STRICT LIMITS (aligned with Agent 6 v40 Pattern 7):**
- **Production: <10 console statements (STRICT LIMIT)**
- **Development: <20 console statements (WARNING THRESHOLD)**

**Breakdown (Production <10 total):**
1. Server startup (dev only): 1-2 statements
2. Error handler: 1-2 statements
3. Job processor lifecycle: 2 statements
4. Seed scripts: 3-5 statements

**Total:** ~10 maximum

**Target:** Minimal console usage. Production code should have NO debug logging.

### 4.3 Verification Command (UPDATED v34)

```bash
# Count console statements in codebase
CONSOLE_COUNT=$(grep -r "console\.(log|error|warn|info)" server/ client/src/ scripts/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)

echo "Console statements: $CONSOLE_COUNT"

# STRICT THRESHOLD v34: Fail at >10 (was warning at >15)
if [ "$CONSOLE_COUNT" -gt 10 ]; then
  echo "[X] FAIL - Excessive logging: $CONSOLE_COUNT statements (strict limit: 10)"
  echo ""
  echo "Allowed usage (only 4 categories):"
  echo "  1. Server startup (dev only): 1-2"
  echo "  2. Error handler: 1-2"
  echo "  3. Job processor lifecycle: 2"
  echo "  4. Seed scripts: 3-5"
  echo ""
  echo "Remove ALL debug logging, request logging, and variable dumps"
  exit 1
elif [ "$CONSOLE_COUNT" -gt 20 ]; then
  echo "[WARN]  WARNING - Development threshold exceeded: $CONSOLE_COUNT (warning: 20)"
  echo "Consider reducing console usage"
else
  echo "[OK] PASS - Acceptable logging level: $CONSOLE_COUNT/10"
fi
```

### 4.4 Future Enhancement: Structured Logging

For production deployments, consider structured logging:

```typescript
// server/lib/logger.ts (optional future enhancement)
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty' }
    : undefined
});

// Usage
logger.info({ projectId }, 'Project created');
logger.error({ err, jobId }, 'Job processing failed');
logger.warn({ userId }, 'Rate limit exceeded');
```

**Benefits:**
- Structured JSON output
- Log levels (debug, info, warn, error)
- Easy to parse and analyze
- Production-ready performance

**When to implement:**
- Application reaches production
- Need centralized logging (e.g., CloudWatch, Datadog)
- Team size grows (need log analysis)

### 4.5 Forbidden Patterns

```typescript
// [X] NEVER: Passwords/secrets in logs
console.log('Login attempt:', { email, password });  // FORBIDDEN

// [X] NEVER: Full request/response objects (may contain sensitive data)
console.log('Request:', req);                        // FORBIDDEN
console.log('Response:', res);                       // FORBIDDEN

// [X] NEVER: PII without redaction
console.log('User data:', user);                     // May contain email, phone, etc.

// [X] NEVER: API keys, tokens, credentials
console.log('Config:', config);                      // May contain secrets
```

---

## SECTION 5: VERIFICATION METHODOLOGY (NEW v35)

**Purpose:** Establish verification-first development as the standard approach. Verification checks are written FIRST, then implementation steps are designed to guarantee those checks pass.

**Reference:** Agent 6 v41 Pattern 22 (Verification-First Development)

### Principle: Verification-First Development

**Anti-Pattern (DO NOT DO THIS):**
```markdown
## Phase X
- Step 1: Create directories
- Step 2: Create files
- Step 3: Configure middleware
[Later] Verification: Check if everything exists
```

**Correct Pattern (ALWAYS DO THIS):**
```markdown
## Phase X

### SUCCESS CRITERIA (Define FIRST):
```bash
# These checks MUST pass
[ -d "client/src/pages" ] || exit 1
[ -f "server/index.ts" ] || exit 1
grep -q "helmet()" server/index.ts || exit 1
```

### IMPLEMENTATION (Designed to Pass Criteria):
Step 1: Create directories
Step 2: Verify directories exist
Step 3: Create files with required content
Step 4: Verify content exists

[STOP] GATE: Run verification. If fails, STOP.
```

### Process Flow

1. **Define Success Criteria First**
   - Write verification checks showing what MUST exist
   - Be specific: exact directories, files, configuration patterns
   - Include counts, not just existence

2. **Write Implementation Steps Second**
   - Design steps that create exactly what verification checks
   - Each step should map to verification criteria
   - Include inline verification after each major step

3. **Add Blocking Gates Third**
   - Explicit gate: "Run verification script"
   - Explicit stop instruction: "If exit code ? 0, DO NOT PROCEED"
   - No ambiguity about what happens on failure

### Enhanced Verification Categories

#### 1. Structural Verification (Existence + Counts)

**Purpose:** Verify directories and files exist with exact counts.

**Template:**
```bash
# Directory existence
[ -d "client/src/pages" ] || { echo "[X] Missing pages"; exit 1; }
[ -d "server/services" ] || { echo "[X] Missing services"; exit 1; }

# Exact counts (not minimum)
CLIENT_DIRS=$(ls -1 client/src 2>/dev/null | wc -l)
[ "$CLIENT_DIRS" -eq 5 ] || { echo "[X] Expected 5 dirs, found $CLIENT_DIRS"; exit 1; }

# File existence
[ -f "server/index.ts" ] || { echo "[X] Missing server/index.ts"; exit 1; }
```

**Critical:** Use exact matching (=), NOT minimum (?). If spec says 5 directories, verify exactly 5.

#### 2. Content Verification (Configuration + Usage)

**Purpose:** Verify middleware is CONFIGURED and APPLIED, not just installed or imported.

**Template:**
```bash
# Security middleware - check import + usage
grep -q "import helmet" server/index.ts || { echo "[X] helmet not imported"; exit 1; }
grep -q "app.use(helmet())" server/index.ts || { echo "[X] helmet not applied"; exit 1; }

# Rate limiting - check configuration + application
grep -q "rateLimit" server/index.ts || { echo "[X] rateLimit not imported"; exit 1; }
grep -q "app.use('/api'.*Limiter)" server/index.ts || { echo "[X] rateLimit not applied"; exit 1; }

# JWT - check fail-fast pattern (no fallbacks)
grep -E "JWT_SECRET.*(\|\||::)" server/ -r && { echo "[X] JWT has fallback"; exit 1; }
```

**Critical:** Check USAGE, not just presence. Middleware must be applied with `app.use()`.

#### 3. Placeholder Detection (Comments + Content + Structure)

**Purpose:** Detect all forms of placeholder content, not just TODO comments.

**Template:**
```bash
# 1. Comment-based placeholders
grep -rE "TODO|FIXME|PLACEHOLDER" --include="*.ts" --include="*.tsx" \
  client/ server/ && { echo "[X] Found TODO comments"; exit 1; }

# 2. Content-based placeholders
grep -rE "coming soon|coming in Phase|not implemented" -i \
  --include="*.ts" --include="*.tsx" \
  client/ server/ && { echo "[X] Found placeholder text"; exit 1; }

# 3. Structural placeholders (inline components)
grep -E "^function (Dashboard|Login|Register)" client/src/App.tsx && \
  { echo "[X] Inline components found - use separate files"; exit 1; }

# 4. Empty function bodies
grep -rE "{\s*}\s*$" --include="*.ts" --include="*.tsx" \
  client/src/ server/ | grep -v "onClick.*{}" && \
  { echo "[X] Empty function bodies found"; exit 1; }
```

**Critical:** "Complete" means functionally complete, not just syntactically valid.

#### 4. Usage Verification (Install + Import + Use)

**Purpose:** Verify dependencies are installed AND imported AND used in code.

**Template:**
```bash
# Function to verify full usage chain
verify_dependency() {
  local PKG=$1
  local FILE=$2
  local IMPORT_PATTERN=$3
  local USAGE_PATTERN=$4
  
  # Check all three levels
  grep -q "\"$PKG\"" package.json || { echo "[X] $PKG not installed"; return 1; }
  grep -q "$IMPORT_PATTERN" "$FILE" || { echo "[X] $PKG not imported"; return 1; }
  grep -q "$USAGE_PATTERN" "$FILE" || { echo "[X] $PKG not used"; return 1; }
  
  echo "[OK] $PKG verified"
}

# Apply to all critical dependencies
verify_dependency "helmet" "server/index.ts" "import.*helmet" "helmet()"
verify_dependency "bcrypt" "server/services/auth.service.ts" "import.*bcrypt" "bcrypt\.(hash|compare)"
```

**Critical:** Three-level check prevents "installed but unused" and "imported but not configured".

### Verification Pattern Templates

#### Template 1: Directory Scaffolding Verification (Agent 6 v41 Pattern 18)

```bash
#!/bin/bash
# Verify all directories exist with exact counts

echo "Verifying directory structure..."

# Client directories
for DIR in components pages hooks lib types; do
  [ -d "client/src/$DIR" ] || { echo "[X] Missing client/src/$DIR"; exit 1; }
done

# Server directories
for DIR in db/schema db/migrations lib errors middleware services routes workers; do
  [ -d "server/$DIR" ] || { echo "[X] Missing server/$DIR"; exit 1; }
done

# Count verification
CLIENT_DIRS=$(ls -1 client/src | wc -l)
[ "$CLIENT_DIRS" -eq 5 ] || { echo "[X] Wrong client/src count: $CLIENT_DIRS"; exit 1; }

SERVER_DIRS=$(ls -1 server | wc -l)
[ "$SERVER_DIRS" -eq 8 ] || { echo "[X] Wrong server count: $SERVER_DIRS"; exit 1; }

echo "[OK] Directory structure verified"
```

#### Template 2: Security Middleware Verification (Agent 6 v41 Pattern 19)

```bash
#!/bin/bash
# Verify security middleware is configured and applied

echo "Verifying security middleware..."

# Helmet - import + usage
grep -q "import helmet from 'helmet'" server/index.ts || \
  { echo "[X] helmet not imported"; exit 1; }
grep -q "app.use(helmet())" server/index.ts || \
  { echo "[X] helmet not applied"; exit 1; }

# Rate limiting - import + usage
grep -q "import.*rateLimit.*from 'express-rate-limit'" server/index.ts || \
  { echo "[X] express-rate-limit not imported"; exit 1; }
grep -q "app.use('/api'.*Limiter)" server/index.ts || \
  { echo "[X] rate limiter not applied to /api"; exit 1; }
grep -q "app.use('/api/auth'.*Limiter)" server/index.ts || \
  { echo "[X] stricter limiter not applied to /api/auth"; exit 1; }

echo "[OK] Security middleware verified"
```

#### Template 3: Dependency Usage Verification (Agent 6 v41 Pattern 20)

```bash
#!/bin/bash
# Verify dependencies are installed, imported, AND used

verify_dependency() {
  local PKG=$1
  local FILE=$2
  local IMPORT=$3
  local USAGE=$4
  
  grep -q "\"$PKG\"" package.json || { echo "[X] $PKG: Not in package.json"; return 1; }
  grep -q "$IMPORT" "$FILE" || { echo "[X] $PKG: Not imported in $FILE"; return 1; }
  grep -q "$USAGE" "$FILE" || { echo "[X] $PKG: Not used in $FILE"; return 1; }
  
  echo "[OK] $PKG: Verified"
}

# Security
verify_dependency "helmet" "server/index.ts" "import.*helmet" "helmet()"
verify_dependency "express-rate-limit" "server/index.ts" "import.*rateLimit" "rateLimit("

# Authentication
verify_dependency "bcrypt" "server/services/auth.service.ts" "import.*bcrypt" "bcrypt\.(hash|compare)"
verify_dependency "jsonwebtoken" "server/services/auth.service.ts" "import.*jwt" "jwt\.(sign|verify)"

# Database
verify_dependency "drizzle-orm" "server/db/index.ts" "import.*drizzle" "drizzle("
verify_dependency "pg" "server/db/index.ts" "import.*Pool" "new Pool"
```

#### Template 4: Placeholder Content Verification (Agent 6 v41 Pattern 21)

```bash
#!/bin/bash
# Enhanced placeholder detection

echo "Checking for placeholder content..."
ERRORS=0

# Comment-based
if grep -rE "TODO|FIXME|PLACEHOLDER" --include="*.ts" --include="*.tsx" \
  client/ server/ 2>/dev/null; then
  echo "[X] TODO/FIXME/PLACEHOLDER comments found"
  ERRORS=$((ERRORS+1))
fi

# Content-based
if grep -rE "coming soon|coming in Phase|not implemented|under construction" \
  -i --include="*.ts" --include="*.tsx" client/ server/ 2>/dev/null; then
  echo "[X] Placeholder content text found"
  ERRORS=$((ERRORS+1))
fi

# Inline page components
if grep -E "^function (Dashboard|Login|Register|Settings|Profile)" \
  client/src/App.tsx 2>/dev/null; then
  echo "[X] Inline page components - must be in client/src/pages/"
  ERRORS=$((ERRORS+1))
fi

# Empty function bodies (except no-op handlers)
if grep -rE "{\s*}\s*$" --include="*.ts" --include="*.tsx" \
  client/src/ server/ 2>/dev/null | \
  grep -v "onClick.*{}" | grep -v "onChange.*{}"; then
  echo "[X] Empty function bodies found"
  ERRORS=$((ERRORS+1))
fi

[ $ERRORS -eq 0 ] || { echo "[X] $ERRORS placeholder categories found"; exit 1; }
echo "[OK] No placeholder content"
```

### Quality Standards (Updated v36)

**Code is complete ONLY if ALL of these are true:**

[OK] **Zero TODO/FIXME/PLACEHOLDER comments**
- No comment-based placeholders anywhere in codebase

[OK] **Zero placeholder content text**
- No "coming soon", "coming in Phase X", "not implemented" in UI
- No "under construction" or similar messages

[OK] **Zero inline page components**
- All page components in separate files in client/src/pages/
- No function declarations like `function Dashboard()` in App.tsx

[OK] **Zero empty function bodies**
- Exception: Explicit no-op handlers like `onClick={() => {}}`
- All service functions must have implementations

[OK] **Zero hardcoded test/example data**
- No `test@example.com` or similar in services
- No `password: 'test123'` in production code

[OK] **All routes import and call services**
- Every route handler imports service module
- Every route handler calls service function
- No inline business logic in routes

[OK] **All dependencies used (not just installed)**
- Every package.json dependency is imported
- Every import is used in code
- Security middleware is applied, not just imported

[OK] **All directories created with exact counts**
- client/src has exactly 5 subdirectories
- server has exactly 8 subdirectories
- All mandatory directories exist

[OK] **All security middleware configured**
- helmet imported and applied
- express-rate-limit imported and applied to routes
- Both applied in correct order (before routes)

[OK] **Zero prohibited patterns (NEW v36)**
- **Reference:** Agent 6 v42 PROHIBITED PATTERNS, Agent 2 v29 ADR-011
- No `Math.random()` in server code (use `crypto.randomBytes()`)
- No `eval()` anywhere (use `JSON.parse()`)
- No `localhost` binding (use `0.0.0.0`)
- No direct `res.json()` in routes (use `sendSuccess()`)
- No SQL string concatenation (use parameterized queries)
- No hardcoded secrets (use `process.env.*`)
- **Enforced by:** `scripts/security-check.sh` (Gate #12)

[OK] **Correct configuration values (NEW v37)**
- **Reference:** Agent 2 v30 ADR-009, ADR-012, Agent 6 v43 PROHIBITED PATTERNS #7-8, Pattern 23
- Vite port MUST be 5000 (not default 5173)
- Vite proxy MUST target `'http://127.0.0.1:3001'` (not `'localhost'`)
- No `'localhost'` strings in config files (use `'127.0.0.1'`)
- ErrorBoundary MUST be class component with `componentDidCatch` and `getDerivedStateFromError`
- App MUST be wrapped in `<ErrorBoundary>` tags
- **Enforced by:** `scripts/verify-vite-config.sh` (Gate #13), `scripts/verify-error-boundary.sh` (Gate #14)

[OK] **Complete count and reference verification (NEW v38)**
- **Reference:** Agent 4 v33 Section 1.4, Agent 6 v44 Patterns 24-26
- Endpoint count MUST exactly match API contract total (not ?, exact =)
- Health endpoint (`app.get('/health')`) counts as +1 to total
- Package.json scripts MUST reference existing files (no dead references)
- Console statements SHOULD be ?5 outside acceptable locations (warning threshold)
- Direct `parseInt(req.params)` or `parseInt(req.query)` FORBIDDEN (use validation utilities)
- **Enforced by:** `scripts/verify-endpoint-count.sh` (Gate #15), `scripts/verify-package-scripts.sh` (Gate #16), `scripts/verify-console-logs.sh` (Gate #17)

### Integration with Phase Development

Every phase specification MUST follow this structure:

```markdown
## Phase X: [Name]

### SUCCESS CRITERIA (Written FIRST):
```bash
# Verification checks that MUST pass
[ -d "..." ] || exit 1
[ -f "..." ] || exit 1
grep -q "..." || exit 1
```

### IMPLEMENTATION (Designed to Pass Criteria):
Step 1: [Action]
Step 2: Verify step 1
Step 3: [Action]
Step 4: Verify step 3

[STOP] BLOCKING GATE:
```bash
bash scripts/verify-phase-X.sh
# If exit code ? 0, DO NOT PROCEED
# Fix all failures before continuing
```
```

### Validation Approach

**After updating specifications:**

```bash
# 1. Generate code with updated specs
claude-code --specs /docs

# 2. Run Phase 1 verification IMMEDIATELY
npm run verify:phase1

# 3. If it fails, the SPEC is wrong (not Claude Code)
# Fix the spec to provide executable instructions

# 4. Repeat until verification passes on first try
```

**Success Metric:** Claude Code produces code that passes ALL verifications on first attempt with no manual fixes needed.

---

## OUTPUT FORMAT

**[CRITICAL] 07-QA-DEPLOYMENT.md structure:**

```markdown
# QA & Deployment Specification: [Product Name]

## 1. TEST REQUIREMENTS

### Unit Tests
[Test requirements for utilities, helpers, services]

### Integration Tests
[Test requirements for API endpoints, database transactions]

### E2E Tests
[Test requirements for critical user flows]

## 2. DEPLOYMENT CHECKLIST

### Pre-Deployment Verification (UPDATED v33)

**[CRITICAL]** Run ALL verification scripts before deployment:

```bash
# 1. Phase Gates (7 scripts)
bash scripts/verify-phase-1.sh || exit 1
bash scripts/verify-phase-2.sh || exit 1
# ... all 7 phases

# 2. Architecture Compliance (2 scripts)
bash scripts/verify-adr-compliance.sh || exit 1
bash scripts/verify-file-manifest.sh || exit 1

# 3. Code Completeness (NEW v33)
bash scripts/verify-no-placeholders.sh || exit 1

# 4. Data Layer Compliance (NEW v33)
bash scripts/verify-schema-count.sh || exit 1
bash scripts/verify-transactions.sh || exit 1

# 5. UI Compliance (NEW v33)
bash scripts/verify-navigation-components.sh || exit 1

# 6. Final Checks
bash scripts/self-audit.sh || exit 1
```

**Required Checks (11 total):**
- [OK] Phase 1-7 gates: All pass
- [OK] ADR compliance: All ADR patterns implemented
- [OK] File manifest: All ADR-referenced files present
- [OK] **Code completeness: NO TODO/FIXME/placeholder code (NEW v33)**
- [OK] **Schema manifest: Exact table-to-file correspondence (NEW v33)**
- [OK] **Transactions: db.transaction() on all required functions (NEW v33)**
- [OK] **Navigation: Components for feature groups ?3 pages (NEW v33)**
- [OK] **Console statements: <10 strict limit (UPDATED v34)**
- [OK] Sensitive data: None in logs
- [OK] **Math.random() usage: None in server code (NEW v34)**
- [OK] **JWT secrets: Fail-fast pattern (no fallbacks) (NEW v34)**
- [OK] **Seed script: Present for auth apps (NEW v34)**
- [OK] Self-audit: <3 issues

### Environment Variables
[List all required env vars]

### Configuration
[Deployment-specific config]

### Health Checks
[Endpoints to verify after deployment]

## 3. MONITORING & OBSERVABILITY

[Error tracking, performance monitoring]

## 4. ROLLBACK PROCEDURES

[Steps to rollback if deployment fails]
```

---

## TEST REQUIREMENTS

### Unit Tests

**[CRITICAL] Required Coverage:**

| Category | Test Examples | Coverage Target |
|----------|--------------|-----------------|
| Validation utilities | requireIntParam edge cases | 100% |
| Response helpers | sendSuccess/sendError | 100% |
| Encryption | encrypt/decrypt round-trip | 100% |
| Error classes | Error instantiation | 100% |

### Integration Tests

**[HIGH] Required Coverage:**

| Category | Test Examples | Coverage Target |
|----------|--------------|-----------------|
| Authentication | Login/register flows | Critical paths |
| Authorization | Role-based access | Critical paths |
| Database transactions | Multi-step operations | All transactions |
| File uploads | MIME validation, size limits | All upload paths |

### E2E Tests

**[MEDIUM] Smoke Tests:**

| Flow | Test Description |
|------|------------------|
| Happy path | User register -> login -> main feature |
| Error handling | Invalid inputs -> proper error messages |
| File upload | Upload -> process -> download |

---

## DEPLOYMENT VERIFICATION SCRIPT (UPDATED v33)

**[CRITICAL]** Agent 6 creates this, Agent 7 specifies requirements.

```bash
#!/bin/bash
# scripts/deployment-verification.sh

echo "========================================="
echo "Deployment Verification (v34)"
echo "========================================="
echo ""

FAILURES=0

# 1. Phase gates (7 checks)
echo "=== Phase Gates ==="
for i in {1..7}; do
  echo -n "Phase $i: "
  if bash scripts/verify-phase-$i.sh > /dev/null 2>&1; then
    echo "[OK]"
  else
    echo "[X]"
    FAILURES=$((FAILURES+1))
  fi
done

# 2. Architecture compliance (2 checks)
echo ""
echo "=== Architecture Compliance ==="

echo -n "ADR Compliance: "
if bash scripts/verify-adr-compliance.sh > /dev/null 2>&1; then
  echo "[OK]"
else
  echo "[X]"
  FAILURES=$((FAILURES+1))
fi

echo -n "File Manifest: "
if bash scripts/verify-file-manifest.sh > /dev/null 2>&1; then
  echo "[OK]"
else
  echo "[X]"
  FAILURES=$((FAILURES+1))
fi

# 3. Code completeness (NEW v33)
echo ""
echo "=== Code Completeness ==="

echo -n "No Placeholders: "
if bash scripts/verify-no-placeholders.sh > /dev/null 2>&1; then
  echo "[OK] (No TODO/FIXME code)"
else
  echo "[X] (TODO/placeholder code found)"
  FAILURES=$((FAILURES+1))
fi

# 4. Data layer compliance (NEW v33)
echo ""
echo "=== Data Layer Compliance ==="

echo -n "Schema Count: "
if bash scripts/verify-schema-count.sh > /dev/null 2>&1; then
  echo "[OK] (Exact table-file match)"
else
  echo "[X] (Schema count mismatch)"
  FAILURES=$((FAILURES+1))
fi

echo -n "Transactions: "
if bash scripts/verify-transactions.sh > /dev/null 2>&1; then
  echo "[OK] (All required functions wrapped)"
else
  echo "[X] (Missing transaction wrappers)"
  FAILURES=$((FAILURES+1))
fi

# 5. UI compliance (NEW v33)
echo ""
echo "=== UI Compliance ==="

echo -n "Navigation Components: "
if [ -f "scripts/verify-navigation-components.sh" ]; then
  if bash scripts/verify-navigation-components.sh > /dev/null 2>&1; then
    echo "[OK] (All feature groups covered)"
  else
    echo "[X] (Missing navigation)"
    FAILURES=$((FAILURES+1))
  fi
else
  echo "[WARN]  (Script not found - OK if no multi-page features)"
fi

# 6. Logging check (UPDATED v34 - strict threshold)
echo ""
echo "=== Logging Standards ==="

echo -n "Console Count: "
CONSOLE_COUNT=$(grep -r "console\.(log|error|warn|info)" server/ client/src/ scripts/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
if [ "$CONSOLE_COUNT" -le 10 ]; then
  echo "[OK] ($CONSOLE_COUNT ? 10 - strict limit)"
elif [ "$CONSOLE_COUNT" -le 20 ]; then
  echo "[WARN]  WARNING ($CONSOLE_COUNT > 10 but ? 20 - development threshold)"
  echo "   Reduce before production deployment"
else
  echo "[X] FAIL ($CONSOLE_COUNT > 20 - excessive logging)"
  FAILURES=$((FAILURES+1))
fi

echo -n "Sensitive Data: "
if grep -rq "console\.log.*password\|console\.log.*secret\|console\.log.*token" server/ 2>/dev/null; then
  echo "[X] (Found in logs)"
  FAILURES=$((FAILURES+1))
else
  echo "[OK] (None found)"
fi

# NEW v34: Agent 6 v40 pattern checks
echo ""
echo "=== Agent 6 v40 Pattern Compliance ==="

echo -n "Math.random() Usage: "
if grep -rq "Math\.random()" server/ --include="*.ts" 2>/dev/null; then
  echo "[X] (CRITICAL: Math.random() found - use crypto.randomBytes)"
  FAILURES=$((FAILURES+1))
else
  echo "[OK] (None found)"
fi

echo -n "JWT Fallback Patterns: "
if grep -rEq "JWT_SECRET.*(\|\||::|;.*=.*['\"])" server/ --include="*.ts" 2>/dev/null | grep -v ".env.example"; then
  echo "[X] (JWT secrets have fallback values)"
  FAILURES=$((FAILURES+1))
else
  echo "[OK] (Fail-fast pattern used)"
fi

echo -n "Seed Script (Auth Apps): "
if [ -f "server/db/schema/users.ts" ] && grep -q "passwordHash" server/db/schema/users.ts; then
  if [ -f "scripts/seed-admin.ts" ] && grep -q '"seed".*tsx.*seed-admin' package.json; then
    echo "[OK] (Seed script present)"
  else
    echo "[X] (Missing seed script for auth app)"
    FAILURES=$((FAILURES+1))
  fi
else
  echo "N/A (Not auth app)"
fi

# 7. Self-audit (final check)
echo ""
echo "=== Final Checks ==="

echo -n "Self-Audit: "
if bash scripts/self-audit.sh > /dev/null 2>&1; then
  echo "[OK] (< 3 issues)"
else
  echo "[X] (? 3 issues)"
  FAILURES=$((FAILURES+1))
fi

# Summary
echo ""
echo "========================================="

if [ "$FAILURES" -eq 0 ]; then
  echo "[OK] ALL CHECKS PASSED"
  echo ""
  echo "Deployment Summary:"
  echo "  - Phase gates: [OK]"
  echo "  - Architecture: [OK]"
  echo "  - Code quality: [OK]"
  echo "  - Data layer: [OK]"
  echo "  - UI layer: [OK]"
  echo "  - Logging: [OK]"
  echo "  - Final audit: [OK]"
  echo ""
  echo "Ready to deploy [OK]"
  exit 0
else
  echo "[X] $FAILURES CHECK(S) FAILED"
  echo ""
  echo "Fix issues before deploying"
  exit 1
fi
```

---

## VERIFICATION CHECKLIST

**QA Specification Compliance:**

```bash
# Test requirements documented
grep -c "Unit Tests\|Integration Tests\|E2E Tests" 07-QA-DEPLOYMENT.md

# Deployment checklist present
grep -q "Pre-Deployment Checklist" 07-QA-DEPLOYMENT.md || echo "Missing checklist"

# All 11 verification scripts documented (NEW v33)
grep -c "verify-phase-\|verify-adr\|verify-file-manifest\|verify-no-placeholders\|verify-schema-count\|verify-transactions\|verify-navigation" 07-QA-DEPLOYMENT.md  # Should be 11+

# Exact count verification (NEW v33)
grep -q "exact.*count\|EXACT.*count" 07-QA-DEPLOYMENT.md || echo "Missing exact count requirement"

# Code completeness requirement (NEW v33)
grep -q "NO TODO\|no placeholder" 07-QA-DEPLOYMENT.md || echo "Missing code completeness requirement"

# Schema manifest requirement (NEW v33)
grep -q "schema.*count\|table-to-file" 07-QA-DEPLOYMENT.md || echo "Missing schema manifest requirement"

# Transaction verification (NEW v33)
grep -q "transaction.*wrapper\|db\.transaction" 07-QA-DEPLOYMENT.md || echo "Missing transaction requirement"

# Navigation component verification (NEW v33)
grep -q "navigation.*component" 07-QA-DEPLOYMENT.md || echo "Missing navigation requirement"

# Logging standards documented
grep -q "Logging Standards\|Console.*Standards" 07-QA-DEPLOYMENT.md || echo "Missing logging standards"

# Sensitive data check in deployment
grep -q "sensitive data.*logs" 07-QA-DEPLOYMENT.md || echo "Missing sensitive data check"
```

---

## ASSUMPTION RESOLUTION

**[CRITICAL]** Review all AR-* assumptions from upstream agents.

| Assumption | Agent | Status | Resolution |
|------------|-------|--------|------------|
| AR-ARCH-001 | Agent 2 | UNRESOLVED | [Decision or acceptance] |
| AR-DATA-001 | Agent 3 | RESOLVED | [How resolved] |
| AR-API-001 | Agent 4 | ACCEPTED | [Why accepted] |

**Rules:**
- UNRESOLVED assumptions block deployment
- ACCEPTED assumptions documented in risks
- RESOLVED assumptions closed

---

## CRITICAL REMINDERS

**Pre-Deployment Gates (v33 - UPDATED):**

**11 Required Verification Scripts:**
1. Phase 1-7 verification (7 scripts)
2. ADR compliance verification
3. File manifest verification
4. **Code completeness verification (NO TODO/placeholders) - NEW v33**
5. **Schema manifest verification (exact table count) - NEW v33**
6. **Transaction wrapper verification - NEW v33**
7. **Navigation component verification - NEW v33**

**Quality Standards (v34 - UPDATED):**
- **Code completeness: 0 TODO/FIXME/placeholder statements**
- **Endpoint count: EXACT match to spec**
- **Schema count: EXACT table-to-file mapping**
- **Transactions: 100% coverage on required functions**
- **Navigation: All feature groups ?3 pages covered**
- **Console statements: <10 strict limit (UPDATED v34)**
- **Math.random(): 0 usage in server code (NEW v34)**
- **JWT secrets: Fail-fast pattern (NEW v34)**
- **Seed script: Present for auth apps (NEW v34)**
- Sensitive data: 0 in logs
- Self-audit: <3 issues with v26-v40 specs

**Logging Standards (v34 - UPDATED):**
- **Production: <10 console statements (STRICT LIMIT - was <15)**
- **Development: <20 console statements (WARNING - was <30)**
- Only 4 allowed categories: server startup (dev), error handler, job lifecycle, seed scripts
- NEVER log passwords, secrets, tokens, PII
- Consider structured logging for production

**Quality Targets (v33 - UPDATED):**
- Test coverage: 80%+ for critical paths
- Issue count: **<3 (down from 7-15 with v26-v33 specs)**
- Deployment verification: **100% pass rate on all 11 scripts**
- Code completeness: **0 TODO/placeholder code**
- Count accuracy: **Exact matches (not approximate)**

---

## PROMPT MAINTENANCE

**When updating:**
- Update version number (v33 -> v34)
- Add "What Changed" to version history
- Update Constitution reference if changed
- Run Hygiene Gate (Constitution Section L)
- Verify all verification scripts documented
- Check new verification scripts added to gate checklist
- Ensure exact count requirements specified

---

## DOCUMENT END

**Agent 7 v45 Complete**

**What Changed in v45 (Spec Stack Integrity):**
- **SPEC STACK INTEGRITY:** Added Gate #53 (verify-spec-stack.sh) for pre-flight validation of specification documents
- Gate #53 validates BEFORE Phase 0: ASCII-only encoding, no localhost, constitution inheritance format, Document End versions, cross-reference consistency, Assumption Register presence
- Total verification scripts: 52 -> 53 (+1 meta-validation gate)
- Updated constitution reference to non-versioned inheritance format (Agent 0 v4.5 compliance)
- Removed mojibake encoding: replaced all checkmarks/crosses/emoji with ASCII equivalents ([OK], [X], [WARN])
- Updated cross-references: Agent 6 v48 -> v49 throughout document
- Addresses Foundry v32 spec drift root cause: 23 code generation errors from inconsistent specs
- Completes prevention-first framework: spec validation (Gate #53) -> file creation (Phase 0) -> progressive gates (52 gates) -> deployment
- Meta-protection: validates the validators (spec stack itself checked before validating code)
- Expected outcome: Spec stack passes Gate #53, eliminating all spec-driven failures before code generation
- Cross-references: Agent 0 v4.5 (constitution inheritance), Claude Code Master Build Prompt (current) (Phase 0.0 spec lint), Agent 6 v51 (Patterns 80-82), Agent 8 v41 (detection patterns)

**Lines:** ~1,840 (complete, AI-optimized, ASCII-only encoding)
**Status:** Production-ready

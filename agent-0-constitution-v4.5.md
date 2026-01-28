# Agent 0: Agent Constitution v4.5 (Application-Agnostic)

## FRAMEWORK VERSION

Framework: Agent Specification Framework v2.1
Constitution: Agent 0 - Agent Constitution v4.5
Status: Active
Optimization: Claude Sonnet

---

## FRAMEWORK VERSIONING SEMANTICS

**All framework components follow semantic versioning:**

| Version Type | Increment When | Impact | Example |
|--------------|----------------|--------|---------|
| MAJOR | Breaking agent behavior, fundamental rule changes, authority boundary shifts | Requires review of all downstream agents, may invalidate existing outputs | v2.1 -> v3.0 |
| MINOR | Additive rules, new guardrails, enhanced detection patterns, new optional features | Backwards compatible, existing outputs remain valid | v4.0 -> v4.1 |
| PATCH | Clarifications, examples, formatting, documentation improvements, typo fixes | No functional change, pure clarity enhancement | v4.1.0 -> v4.1.1 |

**Upgrade Decision Tree:**
```
Does change affect agent outputs or decisions?
|-- YES -> Is old output still valid?
|   |-- NO -> MAJOR (breaking change)
|   `-- YES -> Does it add new requirements?
|       |-- YES -> MINOR (additive)
|       `-- NO -> PATCH (clarification)
`-- NO -> PATCH (documentation only)
```

**Version Communication Rule:**
Every agent MUST include a "What Changed Since vX.Y" section when incrementing version, listing:
- New mandatory rules
- Deprecated patterns
- Behavior changes
- Impact on Claude Code execution

This prevents Claude Code from operating on outdated mental models.

---

## VERSION HISTORY

| Version | Date | Changes | What Changed Since Previous Version |
|---------|------|---------|-------------------------------------|
| 4.5 | 2026-01 | **MINOR:** Added Agent Output Protocol (Section U) and Constitution Reference Rule (Section V). Mandates single-file output per agent (addresses audit finding where Agent 6 created 6 separate files instead of 1). Establishes inheritance model for constitution references (agents inherit from Agent 0 generically, not version-specific). Based on production deployment findings and maintenance burden analysis; Hygiene Gate: PASS | **Additive:** All agents MUST produce exactly ONE output file containing all required content, templates, and scripts inline. Verification scripts, readme files, and supplementary documents MUST be embedded in the single output document, not created as separate files. Constitution references standardized to "Inherited from Agent 0" (eliminates cascading version updates when constitution changes). Output files should remain under 5000 lines for LLM processing efficiency. Self-contained documents enable complete specification delivery in single artifact. |
| 4.4 | 2026-01 | **MINOR:** Framework alignment update. Constitution references updated across agent framework (Agents 2-8) to v4.4 for consistency. Technical pattern enforcement enhanced; Hygiene Gate: PASS | **Additive:** Constitution version alignment across all framework agents. No functional changes to rules or requirements. |
| 4.3 | 2026-01 | **MINOR:** Added Network Binding Addresses requirement to Section C with comprehensive IPv4/IPv6 compatibility rules. Prevents ECONNREFUSED errors in Replit development environment. Based on production deployment audit findings; Hygiene Gate: PASS | **Additive:** All server binding addresses MUST follow explicit IPv4/IPv6 rules. Frontend (Vite) binds to 0.0.0.0:5000 for external access. Backend (Express) binds to 127.0.0.1:3001 in development (IPv4 explicit for proxy compatibility) and 0.0.0.0:5000 in production. Forbidden pattern: binding to "localhost" (causes IPv6/IPv4 mismatch). Agent responsibilities defined (Agent 2: ADR, Agent 6: enforcement, Agent 8: detection). Verification command provided. Prevents connection refused errors between Vite proxy and Express backend. |
| 4.2 | 2026-01 | **MINOR:** Added Cryptographic Randomness requirement to Section C with comprehensive implementation guidance. Prevents use of Math.random() for security-sensitive values (unique IDs, filenames, tokens, session IDs, CSRF tokens). Enhanced Section E cross-reference; Hygiene Gate: PASS | **Additive:** All random value generation for security purposes MUST use crypto.randomBytes(). Explicit forbidden patterns (Math.random()) and required patterns documented with security rationale. Table of use cases with byte sizes. Agent responsibilities defined (Agent 2: ADR, Agent 6: enforcement, Agent 8: detection). Verification command provided. Prevents session hijacking, token forgery, file enumeration, and CSRF bypass attacks. |
| 4.1 | 2026-01 | **MINOR:** Added Implementation Completeness Standards (P), Code Template Requirements (Q), Middleware Integration Mandates (Q1), External API Templates (Q2), File Parsing Requirements (Q3), Streaming Export Patterns (Q4), Integration Flow Requirements (R), Dependency Injection Standards (R1), Verification Protocol (S). Based on Claude Code feedback on specification gaps causing incomplete implementations; Hygiene Gate: PASS | **Additive:** All specifications must now include executable code (no pseudocode), implementation completeness markers (STUB/PARTIAL/COMPLETE), explicit middleware configurations, complete external API client code, file parsing with actual libraries, streaming export implementations, integration flow diagrams, dependency injection patterns, and curl-based verification commands. |
| 4.0 | 2026-01 | **MAJOR:** Added Rule Priority Tiers (A1), Assumption Register Lifecycle Contract (B1), Framework Versioning Semantics (above), Rule Classification Guidance (C1), "What Changed" mandate for all agents. Enhanced cognitive load management for LLM execution under token pressure; Hygiene Gate: PASS | **Breaking:** All agents must now classify rules as CRITICAL/HIGH/GUIDANCE. Assumption Registers must include lifecycle metadata. Version history must include "What Changed" explanations. |
| 3.3 | 2026-01 | Application-agnostic update: Removed all project-specific references to maintain framework universality; Hygiene Gate: PASS | Removed project names, made framework universally applicable |
| 3.2 | 2026-01 | Sonnet optimization: Added explicit decision trees, concrete examples, reduced ambiguity in enforcement rules; Hygiene Gate: PASS | Enhanced LLM executability through structured decision trees |
| 3.1 | 2026-01 | Production audit fix: Added JWT Configuration to Section C (token expiry mismatch prevention); Hygiene Gate: PASS | New JWT config defaults prevent token expiry mismatches |
| 3 | 2025-01 | Added Framework Version header, Constitution Update Rule, Prompt Hygiene Gate, Update Protocol, Maintenance Contract, Framework Contract; Hygiene Gate: PASS | Formalized prompt quality and version control processes |
| 2 | 2025-01 | Added TBD enforcement rule, encoding guardrail section | Improved assumption tracking and encoding cleanliness |
| 1 | 2025-01 | Initial Constitution consolidating global rules from all agents | First centralized rule source |

---

## PURPOSE

This Constitution defines **non-negotiable global rules** for the entire agent chain. 

**Key Principles:**
1. All agents inherit these rules automatically
2. Agents must NOT duplicate these rules except via the "Inherited Constitution" statement
3. This document is the single source of truth for cross-cutting concerns
4. When in doubt, refer back to this Constitution


**v4.3 Update:** Added CRITICAL network binding addresses requirement preventing use of "localhost" for server binding. Express backend must bind to 127.0.0.1 (IPv4 explicit) in development to ensure compatibility with Vite proxy, and 0.0.0.0 in production for Replit reverse proxy access. Prevents ECONNREFUSED errors caused by IPv6/IPv4 protocol mismatches.
**v4.2 Update:** Added CRITICAL cryptographic randomness requirement preventing use of Math.random() for security-sensitive values. All random IDs, tokens, filenames, and session identifiers MUST use crypto.randomBytes() to prevent session hijacking, token forgery, and CSRF attacks.

**v4.1 Update:** Added comprehensive implementation completeness standards based on Claude Code feedback. Key principle: **"If it's not shown as working code, it won't be implemented."** All specifications must now include executable code templates, not pseudocode descriptions.

**v4.0 Update:** Introduced Rule Priority Tiers, Assumption Lifecycle Management, and Framework Versioning Semantics to optimize LLM cognitive load and enable intelligent prioritization under token pressure.

**v3.3 Update:** Removed all project-specific references to ensure framework applies universally to any React/Express/PostgreSQL SaaS application.

---

## A) CROSS-AGENT AUTHORITY ORDER

### When Conflicts Arise

Use this precedence table to resolve conflicts between agents:

| Priority | Agent | Authority Domain | Example Conflicts They Resolve |
|----------|-------|------------------|--------------------------------|
| 1 | Agent 4 (API Contract) | All API conventions, endpoint shapes, response envelopes, error formats, pagination rules | "Should error be 400 or 422?" -> Agent 4 decides |
| 2 | Agent 2 (System Architecture) | Infrastructure decisions, deployment patterns, database configuration, platform requirements | "Which database driver?" -> Agent 2 decides |
| 3 | Agent 3 (Data Modeling) | Schema definitions, entity relationships, constraints, query patterns, ORM conventions | "Should we use soft delete?" -> Agent 3 decides |
| 4 | Agent 5 (UI/UX Specification) | Screens, user flows, UI patterns, role visibility, interaction states, component systems | "What screens exist?" -> Agent 5 decides |
| 5 | Agent 6 (Implementation Orchestrator) | Scaffolding, task ordering, file paths, implementation workflow, code templates | "What order to build features?" -> Agent 6 decides |
| 6 | Agent 7 (QA & Deployment) | Test requirements, deployment verification procedures, environment checklists | "How to verify deployment?" -> Agent 7 decides |
| 7 | Agent 8 (Code Review) | Audit findings only; must not introduce new spec requirements | "Does code match spec?" -> Agent 8 audits |

### Enforcement Rule

**When Agent X and Agent Y conflict:**
1. Find both agents in the priority table above
2. The agent with lower priority number wins
3. Document the conflict resolution in the winning agent's Assumption Register

---

## A1) RULE PRIORITY TIERS

**Purpose:** Enable Claude Code to reason intelligently under token pressure and cognitive constraints by explicitly signaling relative importance of rules.

### Priority Tier Definitions

All rules in this Constitution and downstream agents MUST be classified using one of these tiers:

| Tier | Keyword | Meaning | Violation Consequence | Usage Guideline |
|------|---------|---------|----------------------|-----------------|
| **P1** | **[CRITICAL]** | Absolute requirement. Violation blocks deployment. | DEPLOYMENT BLOCKER | Security, data integrity, platform compatibility, global invariants |
| **P2** | **[HIGH]** | Strong requirement. Violation triggers audit failure. | AUDIT FAILURE | Best practices, performance patterns, maintainability standards |
| **P3** | **[GUIDANCE]** | Recommended practice. Violation acceptable in MVP/time constraints. | ACCEPTABLE IN MVP | Optimization, polish, advanced patterns, future-proofing |

### Tier Application Rules

```
Does violation break production deployment?
"oe"? YES -> [CRITICAL]
"""? NO -> Does violation cause technical debt or risk?
    "oe"? SIGNIFICANT -> [HIGH]
    """? MINOR -> [GUIDANCE]
```

### Prioritization Under Constraint

**If Claude Code must choose due to token limits or complexity:**

1. **ALWAYS satisfy all [CRITICAL] rules first**
2. **Then satisfy [HIGH] rules if possible**
3. **Defer [GUIDANCE] rules to future iterations if needed**

---

## B) ANTI-HALLUCINATION AND SCOPE CONTROL

### Core Principle

**IF a feature, entity, endpoint, screen, role, or capability is NOT specified upstream -> DO NOT invent it**

### Decision Tree for Unspecified Items

```
Is the item specified upstream?
"oe"? YES -> Proceed with implementation
"""? NO -> Follow this process:
    1. Create Assumption Register item with lifecycle metadata (see Section B1)
    2. Make reasonable assumption if needed to proceed
    3. Document assumption explicitly
    4. NEVER invent silently
```

### Autonomous Completion Mandate

**What you MUST do:**
- Complete the entire output in one pass
- Document ALL assumptions in Assumption Register with lifecycle metadata
- Make decisions and document rationale
- Proceed without waiting for user input

**What you MUST NOT do:**
- Ask the user questions mid-output
- Stop and wait for confirmation
- Leave sections incomplete with "TBD" without logging in Assumption Register
- Invent features that aren't implied by upstream specs

---

## B1) ASSUMPTION REGISTER LIFECYCLE CONTRACT

**Purpose:** Prevent assumptions from persisting invisibly across agents and releases by enforcing explicit lifecycle management.

### Mandatory Lifecycle Fields

Every Assumption Register entry MUST include these fields:

| Field | Required | Format | Purpose |
|-------|----------|--------|---------|
| **AR-ID** | YES | `AR-XXX` | Unique identifier for cross-agent tracking |
| **Owner Agent** | YES | `Agent N` | Which agent created this assumption |
| **Type** | YES | `ASSUMPTION \| DEPENDENCY \| CONSTRAINT \| CHANGE_REQUEST` | Classification |
| **Downstream Impact** | YES | `[Agent N, Agent M, ...]` or `NONE` | Which agents consume this assumption |
| **Resolution Deadline** | YES | `BEFORE_AGENT_N \| BEFORE_DEPLOYMENT \| PHASE_2 \| N/A` | When must this be resolved |
| **Allowed to Ship** | YES | `YES \| NO` | Can system deploy with this unresolved? |
| **Status** | YES | `UNRESOLVED \| RESOLVED \| DEFERRED \| DEPRECATED` | Current state |
| **Source Gap** | YES | Text | What information is missing |
| **Assumption Made** | CONDITIONAL | Text | What assumption was made (if Type=ASSUMPTION) |
| **Impact if Wrong** | YES | Text | Consequences if assumption proves incorrect |
| **Resolution Note** | CONDITIONAL | Text | How it was resolved (if Status=RESOLVED) |

### Assumption Register Schema Template

```markdown
## ASSUMPTION REGISTER

### AR-XXX: [Title]
- **Owner Agent:** Agent N
- **Type:** ASSUMPTION | DEPENDENCY | CONSTRAINT | CHANGE_REQUEST
- **Downstream Impact:** [Agent X, Agent Y] or NONE
- **Resolution Deadline:** BEFORE_AGENT_N | BEFORE_DEPLOYMENT | PHASE_2 | N/A
- **Allowed to Ship:** YES | NO
- **Status:** UNRESOLVED | RESOLVED | DEFERRED | DEPRECATED
- **Source Gap:** [What information is missing]
- **Assumption Made:** [What assumption was made to proceed]
- **Impact if Wrong:** [Consequences if assumption is incorrect]
- **Resolution Note:** [How it was resolved - only if RESOLVED]
```

### Resolution Rules

**Agent 7 (QA & Deployment) MUST:**

```
Before allowing deployment:
  1. Scan ALL Assumption Registers across agents
  2. Find entries where:
     - Status = UNRESOLVED
     - Allowed to Ship = NO
  3. IF any found -> BLOCK DEPLOYMENT
  4. List blocking assumptions in deployment report
```

---

## C) CANONICAL CONVENTIONS (GLOBAL INVARIANTS)

**These conventions are NON-NEGOTIABLE. All agents must follow them.**

### API Conventions

| Convention | Priority | Rule | Non-Compliance Example | Compliant Example |
|------------|----------|------|------------------------|-------------------|
| API Prefix | **[CRITICAL]** | `/api` for all endpoints (not `/api/v1` unless PRD requires) | `/v1/users` OE | `/api/users` oe... |
| Health Endpoint | **[HIGH]** | `GET /api/health` returns exactly: `{ "status": "ok", "timestamp": "<ISO8601>" }` | `{ "healthy": true }` OE | `{ "status": "ok", "timestamp": "2026-01-19T10:00:00Z" }` oe... |
| Error Envelope | **[CRITICAL]** | `{ "error": { "code": "<ERROR_CODE>", "message": "<human readable>" } }` | `{ "error": "Not found" }` OE | `{ "error": { "code": "NOT_FOUND", "message": "User not found" } }` oe... |
| Success Envelope | **[CRITICAL]** | `{ "data": <payload>, "meta": { "timestamp": "<ISO8601>" } }` | `{ "user": {...} }` OE | `{ "data": {...}, "meta": { "timestamp": "..." } }` oe... |
| Paginated Envelope | **[CRITICAL]** | `{ "data": [...], "pagination": { page, limit, total, totalPages, hasMore }, "meta": { "timestamp": "<ISO8601>" } }` | `{ "users": [...], "count": 50 }` OE | `{ "data": [...], "pagination": {...}, "meta": {...} }` oe... |

### Authentication Conventions

| Convention | Priority | Rule | Implementation Location |
|------------|----------|------|------------------------|
| Token Storage | **[CRITICAL]** | JWT stored in `localStorage` | `client/src/lib/auth.ts` |
| Token Key | **[HIGH]** | `auth_token` (unless specified otherwise) | `localStorage.getItem('auth_token')` |
| Logout Behavior | **[CRITICAL]** | Delete token from localStorage | `localStorage.removeItem('auth_token')` |
| 401 Handling | **[CRITICAL]** | Clear token + redirect to `/login` | `if (status === 401) { /* clear + redirect */ }` |
| Refresh Tokens | **[GUIDANCE]** | Not implemented unless PRD explicitly requires | No refresh logic by default |

### JWT Configuration (MANDATORY)

| Setting | Priority | Default Value | Override Condition | Enforcement |
|---------|----------|---------------|-------------------|-------------|
| Token Expiry | **[CRITICAL]** | 24h | Only if PRD explicitly specifies different value | `expiresIn: '24h'` in tokens.ts |
| Algorithm | **[CRITICAL]** | HS256 | Only for single-server deployments | `algorithm: 'HS256'` |
| Secret Key Env | **[CRITICAL]** | JWT_SECRET | REQUIRED environment variable | Process fails if missing |
| Refresh Tokens | **[GUIDANCE]** | Not implemented | Only if PRD explicitly requires | No refresh endpoints by default |

### Port Configuration

| Environment | Priority | Frontend | Backend | Reasoning |
|-------------|----------|----------|---------|-----------|
| Production | **[CRITICAL]** | 5000 | 5000 | Single Express server serves both; Replit exposes port 5000 |
| Development | **[CRITICAL]** | 5000 (Vite) | 3001 (Express) | Vite proxies `/api/*` to Express for dev experience |

**[CRITICAL] Rules:**
- Server MUST bind to `0.0.0.0`, NOT `localhost` (required for Replit external access)
- Vite MUST have `allowedHosts: true` (required for Replit iframe proxy)
- Production uses single port 5000 for everything

### Cryptographic Randomness (SECURITY CRITICAL)

**[CRITICAL] All random value generation for security-sensitive purposes MUST use cryptographically secure methods.**

| Use Case | Priority | Required Pattern | Forbidden Pattern | Rationale |
|----------|----------|------------------|-------------------|-----------|
| Unique IDs | **[CRITICAL]** | `crypto.randomBytes(16).toString('hex')` | `Math.random().toString(36)` | Predictability risk |
| File Names | **[CRITICAL]** | `crypto.randomBytes(8).toString('hex')` | `Math.round(Math.random() * 1E9)` | Path traversal risk |
| Tokens | **[CRITICAL]** | `crypto.randomBytes(32).toString('hex')` | `Math.random()` based | Session hijacking risk |
| Session IDs | **[CRITICAL]** | `crypto.randomBytes(16).toString('hex')` | Any Math.random() | Authentication bypass risk |
| CSRF Tokens | **[CRITICAL]** | `crypto.randomBytes(24).toString('hex')` | Any Math.random() | CSRF attack risk |

**Mandatory Implementation Pattern:**

```javascript
// oe... CORRECT - Cryptographically secure
import crypto from 'crypto';

// For unique identifiers (32 hex characters)
const uniqueId = crypto.randomBytes(16).toString('hex');

// For file upload names (16 hex characters + original extension)
const secureFilename = `${crypto.randomBytes(8).toString('hex')}-${originalName}`;

// For authentication tokens (64 hex characters)
const authToken = crypto.randomBytes(32).toString('hex');
```

**Forbidden Patterns:**

```javascript
// OE WRONG - Predictable, insecure
const id = Math.random().toString(36).substring(7);
const suffix = Math.round(Math.random() * 1E9);
const token = Math.random().toString(36) + Math.random().toString(36);
```

**Security Rationale:**

Math.random() uses a predictable pseudo-random number generator (PRNG). An attacker who observes enough outputs can predict future values, enabling:
- Session hijacking (predictable session IDs)
- Token forgery (predictable auth tokens)
- File enumeration (predictable filenames)
- CSRF bypass (predictable CSRF tokens)

crypto.randomBytes() uses the operating system's cryptographically secure random number generator (CSRNG), which is unpredictable even if the attacker observes all prior outputs.

**Agent Responsibilities:**

- **Agent 2 (Architecture):** Document as Security ADR
- **Agent 6 (Implementation):** Enforce in code generation patterns
- **Agent 8 (Code Review):** Detect Math.random() in server code as CRITICAL violation

**Verification Command:**

```bash
# MUST return no matches in server-side code
grep -r 'Math\.random' server/ && echo "OE CRITICAL: Insecure randomness detected"
```


### Network Binding Addresses (PLATFORM CRITICAL)

**[CRITICAL] Server binding addresses MUST follow Replit IPv4/IPv6 compatibility rules.**

| Server Type | Binding Address | Port | Rationale |
|-------------|----------------|------|-----------|
| Frontend (Vite) | `'0.0.0.0'` | 5000 | External access, Replit proxy compatibility |
| Backend (Express) Dev | `'127.0.0.1'` | 3001 | Internal only, IPv4 ensures Vite proxy connectivity |
| Backend (Express) Prod | `'0.0.0.0'` | 5000 | External access for Replit reverse proxy |

**Problem Context:**

On Replit's NixOS environment, `'localhost'` resolves to IPv6 (`::1`) only. When Express binds to `'localhost'`, it listens on IPv6. However, Vite's HTTP proxy defaults to connecting via IPv4 (`127.0.0.1`), creating a protocol mismatch that causes `ECONNREFUSED` errors.

**Forbidden Pattern:**
```typescript
// OE WRONG - Creates IPv6/IPv4 mismatch in development
app.listen(3001, 'localhost');  // Resolves to ::1 (IPv6 only)
```

**Required Pattern:**
```typescript
// oe... CORRECT - Explicit IPv4 for proxy compatibility
const isDev = process.env.NODE_ENV === 'development';
const host = isDev ? '127.0.0.1' : '0.0.0.0';
const port = parseInt(process.env.PORT || '5000');

app.listen(port, host, () => {
  console.log(`[${process.env.NODE_ENV}] Server running on ${host}:${port}`);
});
```

**Security Note:**

Development backend binds to `127.0.0.1` (localhost only), preventing external access. Production binds to `0.0.0.0` for Replit's reverse proxy while still protected by Replit's network layer.

**Agent Responsibilities:**

- **Agent 2 (Architecture):** Document binding addresses as ADR with environment-specific table
- **Agent 6 (Implementation):** Generate correct binding logic in server/index.ts with environment detection
- **Agent 8 (Code Review):** Detect `'localhost'` binding in Express servers as CRITICAL violation

**Verification Command:**

```bash
# Development backend MUST bind to 127.0.0.1 (not 'localhost')
grep -A 5 "app.listen" server/index.ts | grep -E "127\.0\.0\.1|0\.0\.0\.0" || echo "OE CRITICAL: Server must use explicit IP binding"
```

---

## C1) RULE CLASSIFICATION GUIDANCE

**Purpose:** Prevent rule drift between Constitution and downstream agents (especially Agent 6) by explicitly classifying rule origins.

### Rule Origin Categories

Every rule in downstream agents MUST be classified as one of:

| Category | Definition | Lives In | Example |
|----------|------------|----------|---------|
| **Constitution-Derived** | Direct inheritance or logical extension of Constitution rule | Agent references Constitution section | "API prefix is /api" -> derives from Constitution Section C |
| **Audit-Derived** | Pattern emerged from production failure analysis | Agent's Prevention Patterns section | "Prevent insecure random in tokens" -> from security audit |
| **Implementation-Local** | Agent-specific workflow or pattern not globally applicable | Agent's Process/Workflow sections | "Generate UI specs before API specs" -> Agent 5 workflow |

### Classification Decision Tree

```
Is this rule stated explicitly in Constitution?
"oe"? YES -> Classification: CONSTITUTION-DERIVED
",         -> Reference Constitution section, do NOT restate
"""? NO -> Did this rule come from production audit/failure?
    "oe"? YES -> Classification: AUDIT-DERIVED
    ",         -> Document in Prevention Patterns with audit reference
    """? NO -> Is this rule applicable to other agents?
        "oe"? YES -> FLAG FOR CONSTITUTION UPDATE (Section K)
        """? NO -> Classification: IMPLEMENTATION-LOCAL
                -> Keep in agent-specific sections
```

---

## D) REPLIT PLATFORM NON-NEGOTIABLES

**[CRITICAL] All implementations target Replit. These constraints are absolute and cannot be violated.**

### Deployment Model

| Constraint | Priority | Requirement | Reason |
|------------|----------|-------------|--------|
| Architecture | **[CRITICAL]** | Single container (monolithic) | Replit doesn't support microservices |
| Orchestration | **[CRITICAL]** | None (no Docker, no Kubernetes) | Replit manages container lifecycle |
| Serving | **[CRITICAL]** | Express serves API + static files in production | Simplifies deployment |

### Configuration

| Constraint | Priority | Requirement | Failure Mode if Violated |
|------------|----------|-------------|--------------------------|
| Secrets | **[CRITICAL]** | Use Replit Secrets only (not .env in production) | Credentials exposed in git |
| Network Binding | **[CRITICAL]** | Bind to `0.0.0.0`, NOT `localhost` | External access fails |
| Port | **[CRITICAL]** | Port 5000 in production | Replit can't expose other ports |
| Static Files | **[HIGH]** | Express serves from `dist/` after Vite build | 404 errors on page refresh |

### Database

| Constraint | Priority | Requirement | Reason |
|------------|----------|-------------|--------|
| Provider | **[CRITICAL]** | Replit PostgreSQL only | No external DB without paid plan |
| Driver | **[CRITICAL]** | Use `pg`, not `pg-pool` or others | Replit manages connection pooling |
| Connection | **[CRITICAL]** | Parse `DATABASE_URL` from Replit Secrets | Standard Replit pattern |
| SSL | **[HIGH]** | No SSL required (internal networking) | Replit DB is same-network |

---

## E) FOUNDRY AUDIT PATTERNS (CROSS-AGENT)

**[HIGH] These patterns prevent recurring production failures identified in Foundry audits.**

### Pattern Category: Security

| Pattern | Priority | Rule | Detection Method |
|---------|----------|------|------------------|
| Insecure Random | **[CRITICAL]** | See Section C: Cryptographic Randomness (comprehensive requirements) | Grep for `Math.random()` in server code |
| Server Binding | **[CRITICAL]** | See Section C: Network Binding Addresses (comprehensive requirements) | Grep for binding to "localhost" in server code |
| Password Hashing | **[CRITICAL]** | Use bcrypt with salt rounds >= 10 | Check for bcrypt.hash calls |
| SQL Injection | **[CRITICAL]** | Always use parameterized queries | Check for string concatenation in queries |

### Pattern Category: Performance

| Pattern | Priority | Rule | Detection Method |
|---------|----------|------|------------------|
| N+1 Queries | **[HIGH]** | Prevent loops that trigger individual queries | Check for queries inside map/forEach |
| Missing Indexes | **[HIGH]** | Index all foreign keys and frequently queried columns | Review schema for missing indexes |
| Unnecessary Joins | **[GUIDANCE]** | Fetch only required data | Check for SELECT * in complex joins |

### Pattern Category: Frontend-Backend Binding

| Pattern | Priority | Rule | Detection Method |
|---------|----------|------|------------------|
| API Prefix Mismatch | **[CRITICAL]** | Frontend MUST call `/api/*`, backend MUST serve `/api/*` | Cross-check queryClient calls vs Express routes |
| Request Shape Mismatch | **[HIGH]** | Frontend payload MUST match backend validation schema | Compare UI form submissions vs API contracts |
| Response Shape Assumption | **[HIGH]** | Frontend MUST destructure only documented response fields | Check for undocumented field access |

---

## F) TECH STACK CONSTRAINTS (BINDING ON ALL AGENTS)

**[CRITICAL] No deviations allowed without explicit PRD override.**

### Frontend Stack

| Component | Priority | Requirement | Alternatives Forbidden |
|-----------|----------|-------------|------------------------|
| Framework | **[CRITICAL]** | React 18+ with TypeScript | No Vue, Angular, Svelte |
| Build Tool | **[CRITICAL]** | Vite | No Webpack, CRA, Parcel |
| Router | **[HIGH]** | Wouter (lightweight) | No React Router unless PRD justifies |
| Data Fetching | **[CRITICAL]** | TanStack Query v5 | No Redux, MobX, Zustand for API data |
| Styling | **[CRITICAL]** | Tailwind CSS v3 | No CSS-in-JS, Styled Components, Emotion |
| Forms | **[HIGH]** | React Hook Form | No Formik, uncontrolled forms |
| State | **[HIGH]** | React useState/useContext | No Redux unless PRD justifies |

### Backend Stack

| Component | Priority | Requirement | Alternatives Forbidden |
|-----------|----------|-------------|------------------------|
| Runtime | **[CRITICAL]** | Node.js 18+ | No Deno, Bun |
| Framework | **[CRITICAL]** | Express.js | No Fastify, Koa, Hapi |
| Database | **[CRITICAL]** | PostgreSQL | No MySQL, MongoDB, SQLite |
| Database Driver | **[CRITICAL]** | `pg` (node-postgres) | No `pg-pool`, Sequelize, TypeORM, Prisma |
| Auth | **[HIGH]** | JWT with bcrypt | No Passport unless PRD justifies |
| Validation | **[HIGH]** | Zod | No Joi, Yup, class-validator |

### Development Stack

| Component | Priority | Requirement | Alternatives Forbidden |
|-----------|----------|-------------|------------------------|
| Language | **[CRITICAL]** | TypeScript strict mode | No JavaScript-only projects |
| Package Manager | **[HIGH]** | npm (Replit default) | No yarn, pnpm unless justified |
| Linting | **[GUIDANCE]** | ESLint recommended config | Optional |
| Formatting | **[GUIDANCE]** | Prettier | Optional |

---

## G) COMMON ANTI-PATTERNS (FORBIDDEN)

**These patterns are forbidden across all agents. Violations trigger audit failures.**

### Code Anti-Patterns

| Anti-Pattern | Priority | Why Forbidden | Correct Pattern |
|--------------|----------|---------------|-----------------|
| Inline SQL strings | **[CRITICAL]** | SQL injection risk | Parameterized queries |
| `Math.random()` for IDs | **[CRITICAL]** | Collision risk, not cryptographically secure | `crypto.randomUUID()` |
| Unvalidated user input | **[CRITICAL]** | Security vulnerability | Zod schema validation |
| Promises without error handling | **[HIGH]** | Unhandled rejections crash server | Try-catch or .catch() |
| `console.log` in production | **[HIGH]** | Performance impact, sensitive data leak | Use proper logger |
| Hardcoded secrets | **[CRITICAL]** | Security vulnerability | Environment variables |

### Architecture Anti-Patterns

| Anti-Pattern | Priority | Why Forbidden | Correct Pattern |
|--------------|----------|---------------|-----------------|
| Direct database access from frontend | **[CRITICAL]** | Security bypass | API layer required |
| Authentication in component | **[HIGH]** | Inconsistent protection | Middleware/guards |
| Business logic in UI components | **[HIGH]** | Not reusable, hard to test | Service layer |
| Global mutable state | **[HIGH]** | Race conditions, hard to debug | Immutable patterns |

---

## H) MULTI-AGENT BINDING RULES

**[HIGH] These rules ensure consistency across agent boundaries.**

### Agent 2 -> Agent 3 Binding

| Binding Point | Priority | Rule | Enforcement |
|---------------|----------|------|-------------|
| Database Choice | **[CRITICAL]** | Agent 2 declares database (PostgreSQL), Agent 3 uses PostgreSQL-specific features | Agent 3 must reference Agent 2's architecture decision |
| Connection Pattern | **[CRITICAL]** | Agent 2 defines connection config, Agent 3 uses same pattern | Both must use `DATABASE_URL` from secrets |

### Agent 3 -> Agent 4 Binding

| Binding Point | Priority | Rule | Enforcement |
|---------------|----------|------|-------------|
| Entity Names | **[CRITICAL]** | Agent 4 endpoints must use entity names from Agent 3 schema | `/api/users` if entity is `users` |
| Field Names | **[HIGH]** | Agent 4 response fields must match Agent 3 column names (camelCase) | `userId` not `user_id` in JSON |
| Relationships | **[HIGH]** | Agent 4 nested data must match Agent 3 relationship definitions | If user hasMany tasks, include in expansion |

### Agent 4 -> Agent 5 Binding

| Binding Point | Priority | Rule | Enforcement |
|---------------|----------|------|-------------|
| Available Endpoints | **[CRITICAL]** | Agent 5 can only reference endpoints defined in Agent 4 | No invented endpoints |
| Request Formats | **[CRITICAL]** | Agent 5 forms must match Agent 4 request body schemas | Field names, types, required fields |
| Response Formats | **[CRITICAL]** | Agent 5 UI must handle Agent 4 response envelopes | Expect `{ data, meta }` structure |

### Agent 4 + Agent 5 -> Agent 6 Binding

| Binding Point | Priority | Rule | Enforcement |
|---------------|----------|------|-------------|
| Feature Completeness | **[CRITICAL]** | Agent 6 must implement ALL endpoints from Agent 4 and ALL screens from Agent 5 | No partial implementations |
| Implementation Order | **[HIGH]** | Agent 6 must build backend before frontend for each feature | API exists before UI calls it |

### Agent 6 -> Agent 7 Binding

| Binding Point | Priority | Rule | Enforcement |
|---------------|----------|------|-------------|
| Test Coverage | **[HIGH]** | Agent 7 must verify all Agent 6 critical paths | Every [CRITICAL] rule gets verification step |
| Deployment Artifacts | **[CRITICAL]** | Agent 7 checks Agent 6's build output locations | `dist/` exists, contains `index.html` |

---

## I) ASSUMPTION REGISTER FORMAT (MANDATORY)

**Every agent MUST include an Assumption Register section. No exceptions.**

### When Register is Empty

```markdown
## ASSUMPTION REGISTER

No assumptions required. All specifications derived directly from upstream documents.
```

### When Register Has Entries

Use complete lifecycle schema from Section B1.

---

## J) CHARACTER ENCODING GUARDRAILS

**[HIGH] Prevent mojibake and non-ASCII corruption in all agent outputs.**

### Forbidden Characters

OE **NEVER USE:**
- Smart quotes: ", ", ', '
- Em dashes: ?"
- En dashes: ?"
- Ellipsis: ?|
- Bullet: ?c
- Any non-ASCII arrow: ->, +, ->, +"

oe... **USE INSTEAD:**
- Regular quotes: ", '
- Hyphens: -
- Three periods: ...
- Hyphen: -
- ASCII arrows: ->, <-, ^, v

---

## K) CONSTITUTION UPDATE RULE

### When to Update Constitution

**[HIGH] MUST update when:**
1. A new rule applies across multiple agents
2. A global invariant must change (API envelope, auth behavior, platform constraint)
3. An authority boundary between agents changes
4. A new mandatory validation or hygiene rule is introduced
5. A rule currently duplicated across agents is being centralized

**MUST NOT update when:**
- Project-specific requirements
- Example implementations
- Agent-internal workflows
- Implementation details owned by single agent

### Update Decision Tree

```
Proposed Constitution change?
"oe"? Does it meet criteria above? 
",  "oe"? YES -> Log as CHANGE_REQUEST AR with lifecycle metadata
",  ",         -> Human reviews
",  ",         -> If approved, update Constitution (increment version)
",  """? NO -> Keep in agent-specific spec
"""? Unsure? -> Log as CHANGE_REQUEST, let human decide
```

---

## L) PROMPT HYGIENE GATE (SOURCE OF TRUTH)

**This section defines mandatory checks for prompt validity. All agents reference this section rather than maintaining duplicate checklists.**

### Required Checks

| Check | Priority | Validation Method | Pass Criteria |
|-------|----------|------------------|---------------|
| Framework Version Header | **[CRITICAL]** | Grep for "Framework: Agent Specification Framework v2.1" | Must be present |
| Constitution Reference | **[CRITICAL]** | Grep for "Constitution: Inherited from Agent 0" | Must use inheritance format (non-versioned) |
| Encoding Cleanliness | **[HIGH]** | Scan for mojibake patterns | Zero non-ASCII artifacts |
| Assumption Register | **[CRITICAL]** | Check for "ASSUMPTION REGISTER" section with lifecycle fields | Section exists with complete schema OR "No assumptions" statement |
| Prompt Hygiene Gate | **[CRITICAL]** | Check for "Prompt Hygiene Gate" section | Section exists and references Constitution L |
| No Global Rule Restatement | **[HIGH]** | Check for envelope definitions outside Constitution | No restatements found |
| Rule Priority Tiers | **[CRITICAL]** | Check that rules use [CRITICAL], [HIGH], or [GUIDANCE] tags | Priority tiers present on applicable rules |
| "What Changed" Section | **[CRITICAL]** | Check version history for change explanations | Present for version increments |
| Implementation Completeness | **[CRITICAL]** | Check for STUB/PARTIAL/COMPLETE markers in code | All code blocks classified |

---

## M) UPDATE PROTOCOL (MANDATORY WHEN EDITING PROMPTS)

**This protocol applies when editing any agent prompt.**

### Update Requirements

```
WHEN editing agent prompt:
  1. Apply requested changes
  2. Increment version number (per versioning semantics)
  3. Add "What Changed Since vX.Y" explanation to version history
  4. Run ALL Prompt Hygiene Gate checks (Section L)
  5. Record "Hygiene Gate: PASS" in version history
  6. Include brief note confirming checks passed
```

### Version History Entry Format

**MANDATORY format:**

```markdown
| [version] | [date] | [changes summary]; Hygiene Gate: PASS | [What changed explanation] |
```

---

## N) PROMPT MAINTENANCE CONTRACT

**Every agent (1-8) MUST include this contract block immediately before its Prompt Hygiene Gate section.**

### Required Block

```markdown
## PROMPT MAINTENANCE CONTRACT

If this prompt is edited, you MUST:
1. Update the version history with changes, "What Changed Since vX.Y" explanation, and `Hygiene Gate: PASS`
2. Re-run all Prompt Hygiene Gate checks (per Constitution Section L)
3. Confirm encoding is clean (no mojibake or non-ASCII artifacts)
4. Verify no global rules are restated (reference Constitution instead)
5. Verify all rules have priority tiers ([CRITICAL], [HIGH], [GUIDANCE]) where applicable
6. Verify Assumption Register entries include complete lifecycle metadata (per Constitution Section B1)
7. Verify all code blocks include implementation completeness markers (per Constitution Section P)

If any check fails, the prompt update is invalid and must not be delivered.
```

---

## O) FRAMEWORK CONTRACT

**Any output produced under Agent Specification Framework is VALID only if:**

1. oe... All applicable Prompt Hygiene Gate checks pass (Section L)
2. oe... Correct Framework and Constitution versions referenced
3. oe... No global rules redefined outside Constitution
4. oe... All assumptions/dependencies/uncertainties documented in Assumption Register with complete lifecycle metadata
5. oe... Rules classified with priority tiers where applicable
6. oe... "What Changed" explanation provided for version increments
7. oe... All code blocks include implementation completeness markers (STUB/PARTIAL/COMPLETE)
8. oe... All specifications include executable code, not pseudocode

**If any condition NOT met:**
- OE Output is **non-compliant**
- OE Output must NOT be used as authoritative input
- OE Output must be revised until compliant

---

## P) IMPLEMENTATION COMPLETENESS STANDARDS (NEW IN v4.1)

**[CRITICAL] Purpose:** Prevent AI from generating endpoint stubs that appear complete but return fake data or lack business logic.

### Implementation Levels

Every function, endpoint, or feature MUST be explicitly classified:

| Level | Marker | Definition | Acceptable When | Example |
|-------|--------|------------|-----------------|---------|
| **STUB** | `// TODO: STUB - implement real logic` | Returns hardcoded/fake data with no business logic | Initial scaffolding only | `return { status: 'ok' }; // STUB` |
| **PARTIAL** | `// TODO: PARTIAL - add [specific logic]` | Has real database calls but missing critical business logic | Active development | `// PARTIAL - add PII detection` |
| **COMPLETE** | No TODO markers | Full implementation with validation, error handling, business logic | Production-ready code | Complete function with all logic |

### Classification Rules

**[CRITICAL] STUB Level:**
- Acceptable ONLY during initial scaffolding
- MUST include explicit `// TODO: STUB` comment
- MUST NOT be shipped to production
- Agent 7 MUST block deployment if any STUB remains

**[HIGH] PARTIAL Level:**
- Acceptable during iterative development
- MUST include specific TODO describing missing logic
- MUST document what needs completion
- Should be completed before MVP deployment

**[CRITICAL] COMPLETE Level:**
- Required for all production endpoints
- MUST include:
  - Input validation (Zod schemas)
  - Error handling (try-catch blocks)
  - Business logic implementation
  - Database queries (if applicable)
  - Proper response envelopes

### Verification Decision Tree

```
Reviewing implementation?
"oe"? Contains hardcoded return values?
",  "oe"? YES -> Mark as STUB, block deployment
",  """? NO -> Continue
"oe"? Has database calls but missing validation?
",  "oe"? YES -> Mark as PARTIAL, document gap
",  """? NO -> Continue
"oe"? Has TODO markers?
",  "oe"? YES -> Not COMPLETE, determine STUB vs PARTIAL
",  """? NO -> Check for validation + error handling
      "oe"? Both present -> COMPLETE oe...
      """? Missing either -> Mark as PARTIAL
```

### Examples of Each Level

**OE UNACCEPTABLE STUB (looks complete but is fake):**
```typescript
async function detectPii(sourceId: number) {
  // BAD - Returns fake data, looks complete
  return {
    fields: [
      { field: 'email', type: 'email', count: 15 },
      { field: 'phone', type: 'phone', count: 8 }
    ]
  };
}
```

**s , ACCEPTABLE STUB (clearly marked):**
```typescript
async function detectPii(sourceId: number) {
  // TODO: STUB - implement PII detection logic
  // This is a placeholder for scaffolding purposes
  return { fields: [] };
}
```

**s , PARTIAL (real queries, missing logic):**
```typescript
async function detectPii(sourceId: number) {
  const source = await db.query.sources.findFirst({
    where: eq(sources.id, sourceId)
  });
  
  // TODO: PARTIAL - add actual PII scanning patterns
  // Need to implement regex patterns for email, phone, SSN, credit cards
  // Need to scan through parsed data records
  
  return { fields: [] };
}
```

**oe... COMPLETE (production-ready):**
```typescript
async function detectPii(sourceId: number): Promise<PiiDetectionResult> {
  const source = await db.query.sources.findFirst({
    where: eq(sources.id, sourceId)
  });
  
  if (!source) {
    throw new NotFoundError('Source not found');
  }
  
  const records = await parseSourceData(source.filePath);
  const piiPatterns = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    ssn: /\d{3}-\d{2}-\d{4}/g,
    creditCard: /\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}/g
  };
  
  const detectedPii: PiiField[] = [];
  
  for (const record of records) {
    for (const [field, value] of Object.entries(record)) {
      if (typeof value === 'string') {
        for (const [type, pattern] of Object.entries(piiPatterns)) {
          const matches = value.match(pattern);
          if (matches && matches.length > 0) {
            const existing = detectedPii.find(p => p.field === field && p.type === type);
            if (existing) {
              existing.count += matches.length;
            } else {
              detectedPii.push({ field, type, count: matches.length });
            }
          }
        }
      }
    }
  }
  
  return { fields: detectedPii };
}
```

### Agent-Specific Enforcement

**Agent 6 (Implementation Orchestrator) MUST:**
- Mark all initial code generation as STUB
- Include specific TODOs for what needs completion
- Never generate fake data without STUB marker

**Agent 7 (QA & Deployment) MUST:**
- Scan all code for TODO markers
- Block deployment if any STUB found
- Flag PARTIAL implementations for review
- Verify COMPLETE implementations have validation + error handling

**Agent 8 (Code Review) MUST:**
- Identify unmarked stubs (fake data without TODO)
- Flag incomplete error handling
- Verify business logic matches specifications

---

## Q) CODE TEMPLATE REQUIREMENTS (NEW IN v4.1)

**[CRITICAL] Purpose:** Ensure specifications contain executable, copy-paste ready code, not pseudocode descriptions.

### Core Principle

**"If it's not shown as working code, it won't be implemented."**

### Executable Code Rule

**[CRITICAL] All code in specifications MUST be:**
- **Syntactically valid** - Can be copied directly into an IDE without modification
- **Import-complete** - Includes all necessary import statements
- **Type-safe** - Uses proper TypeScript types
- **Runnable** - Not pseudocode or conceptual descriptions

### Format Requirements

**OE FORBIDDEN (pseudocode):**
```markdown
The endpoint should:
1. Validate the file type
2. Parse the contents
3. Detect the schema
4. Save to database
```

**oe... REQUIRED (executable code):**
```typescript
// COMPLETE IMPLEMENTATION - copy exactly
import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { parseIntParam } from '../lib/validation';
import { BadRequestError } from '../lib/errors';
import { fileParser } from '../services/file-parser';
import { schemaDetector } from '../services/schema-detector';
import { sourcesService } from '../services/sources.service';

const router = Router();

router.post('/:projectId/sources', 
  authenticate, 
  upload.single('file'),
  async (req, res, next) => {
    try {
      const projectId = parseIntParam(req.params.projectId, 'projectId');
      
      if (!req.file) {
        throw new BadRequestError('File is required');
      }
      
      const parsed = await fileParser.parse(req.file.path, req.file.mimetype);
      const schema = schemaDetector.detect(parsed.rows);
      
      const source = await sourcesService.create({
        projectId,
        name: req.file.originalname,
        type: 'file',
        filePath: req.file.path,
        fileSize: req.file.size,
        detectedSchema: schema,
        status: 'pending_config'
      });
      
      res.status(201).json({
        data: source,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  }
);
```

### Error Handling Requirements

**[CRITICAL] Every code template MUST include ALL error cases:**

```typescript
// MANDATORY ERROR HANDLING PATTERNS

// Resource not found
const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
if (!user) {
  throw new NotFoundError('User not found');
}

// Invalid input
if (!req.body.email || !req.body.password) {
  throw new BadRequestError('Email and password are required');
}

// Authorization check
if (user.id !== req.user.id && req.user.role !== 'admin') {
  throw new ForbiddenError('Not authorized to access this resource');
}

// External API failure
try {
  const response = await externalApi.fetch();
} catch (error) {
  throw new ServiceUnavailableError('External service unavailable');
}

// Rate limiting
if (await isRateLimited(user.id, 'api-call')) {
  throw new RateLimitError('Too many requests');
}
```

### Import Statement Requirements

**[CRITICAL] Every code block MUST begin with complete imports:**

```typescript
// MANDATORY - Show all imports at top of code block

// Standard library
import path from 'path';
import fs from 'fs/promises';

// Third-party
import { Router } from 'express';
import multer from 'multer';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Project imports
import { authenticate } from '../middleware/auth';
import { db } from '../lib/database';
import { users, sources } from '../db/schema';
import { eq } from 'drizzle-orm';
import { NotFoundError, BadRequestError } from '../lib/errors';
```

---

## Q1) MIDDLEWARE INTEGRATION MANDATES (NEW IN v4.1)

**[CRITICAL] Purpose:** Prevent middleware from being specified but never actually configured or attached to routes.

### Middleware Specification Rule

**For every endpoint that requires middleware, specifications MUST provide:**
1. **Complete middleware configuration code**
2. **Route attachment showing middleware chain**
3. **Error handling for middleware failures**

### File Upload Middleware Template (MANDATORY)

**When PRD mentions file uploads, Agent 4 MUST include this exact pattern:**

```typescript
// FILE UPLOAD MIDDLEWARE CONFIGURATION (MANDATORY)

import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
await fs.mkdir(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { 
    fileSize: 100 * 1024 * 1024 // 100MB - adjust per requirements
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['.csv', '.xlsx', '.xls', '.json']; // Adjust per requirements
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowed.join(', ')}`));
    }
  }
});

// Route definition - MUST show middleware attachment
router.post('/:projectId/sources', 
  authenticate,           // Auth first
  upload.single('file'),  // Then file upload - 'file' matches form field name
  async (req, res, next) => {
    // Handler has access to req.file
  }
);
```

### Authentication Middleware Template (MANDATORY)

```typescript
// AUTHENTICATION MIDDLEWARE (MANDATORY)

import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../lib/errors';
import { db } from '../lib/database';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId)
    });
    
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    
    req.user = user; // Attach to request
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(error);
    }
  }
}
```

### Validation Middleware Template (MANDATORY)

```typescript
// REQUEST VALIDATION MIDDLEWARE (MANDATORY)

import { z } from 'zod';
import { BadRequestError } from '../lib/errors';

export function validateRequest(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated; // Replace with validated data
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      next(error);
    }
  };
}

// Usage in routes
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1)
});

router.post('/users',
  validateRequest(createUserSchema),
  async (req, res) => {
    // req.body is now typed and validated
  }
);
```

---

## Q2) EXTERNAL API INTEGRATION TEMPLATES (NEW IN v4.1)

**[CRITICAL] Purpose:** Prevent external API integrations from being specified at schema level only, with no actual HTTP client implementation.

### External API Specification Rule

**When PRD mentions external API integration, specifications MUST provide:**
1. **HTTP client configuration with authentication**
2. **Data fetching methods for each endpoint needed**
3. **Pagination handling if applicable**
4. **Error handling for API failures**
5. **Rate limiting respect**
6. **Data transformation to canonical schema**

### Complete External API Template

**Example: Teamwork Desk API Integration**

```typescript
// EXTERNAL API CLIENT (MANDATORY COMPLETE IMPLEMENTATION)

import axios, { AxiosInstance } from 'axios';
import { decrypt } from '../lib/encryption';
import { ServiceUnavailableError } from '../lib/errors';

// 1. Client Factory
export function createTeamworkClient(encryptedApiKey: string, domain: string): AxiosInstance {
  const apiKey = decrypt(encryptedApiKey);
  
  return axios.create({
    baseURL: `https://${domain}.teamwork.com/desk/v1`,
    auth: {
      username: apiKey,
      password: 'X' // Teamwork uses API key as username, any value as password
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 30000 // 30 second timeout
  });
}

// 2. Data Fetching Methods
export interface TeamworkTicket {
  id: number;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  customerId: number;
}

export interface TeamworkMessage {
  id: number;
  body: string;
  createdAt: string;
  isNote: boolean;
  customerId?: number;
}

export async function fetchTickets(
  client: AxiosInstance,
  params: {
    page?: number;
    pageSize?: number;
    updatedAfter?: Date;
  }
): Promise<TeamworkTicket[]> {
  try {
    const response = await client.get('/tickets.json', {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 100,
        updatedAfter: params.updatedAfter?.toISOString()
      }
    });
    
    return response.data.tickets;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new ServiceUnavailableError('Invalid Teamwork API credentials');
      }
      if (error.response?.status === 429) {
        throw new ServiceUnavailableError('Teamwork API rate limit exceeded');
      }
    }
    throw new ServiceUnavailableError('Failed to fetch tickets from Teamwork');
  }
}

export async function fetchConversations(
  client: AxiosInstance,
  ticketId: number
): Promise<TeamworkMessage[]> {
  try {
    const response = await client.get(`/tickets/${ticketId}/conversations.json`);
    return response.data.conversations;
  } catch (error) {
    throw new ServiceUnavailableError(`Failed to fetch conversations for ticket ${ticketId}`);
  }
}

// 3. Sync Implementation with Pagination
export async function syncTeamworkSource(
  sourceId: number
): Promise<{ recordCount: number; records: any[] }> {
  const source = await db.query.sources.findFirst({
    where: eq(sources.id, sourceId)
  });
  
  if (!source) {
    throw new NotFoundError('Source not found');
  }
  
  if (!source.teamworkApiKey || !source.teamworkDomain) {
    throw new BadRequestError('Source not configured with Teamwork credentials');
  }
  
  const client = createTeamworkClient(source.teamworkApiKey, source.teamworkDomain);
  
  // Paginated fetch
  let allTickets: TeamworkTicket[] = [];
  let page = 1;
  const pageSize = 100;
  
  while (true) {
    const tickets = await fetchTickets(client, { page, pageSize });
    if (tickets.length === 0) break;
    
    allTickets = allTickets.concat(tickets);
    page++;
    
    // Respect rate limits - delay between pages
    if (tickets.length === pageSize) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }
  }
  
  // Fetch conversations for each ticket
  const records = [];
  for (const ticket of allTickets) {
    const conversations = await fetchConversations(client, ticket.id);
    
    // Transform to canonical schema
    const canonicalRecord = {
      id: `teamwork-${ticket.id}`,
      messages: [
        {
          role: 'customer',
          content: ticket.message,
          timestamp: ticket.createdAt
        },
        ...conversations.map(msg => ({
          role: msg.isNote ? 'internal' : (msg.customerId ? 'customer' : 'agent'),
          content: msg.body,
          timestamp: msg.createdAt
        }))
      ],
      metadata: {
        source: 'teamwork',
        ticketId: ticket.id,
        status: ticket.status,
        subject: ticket.subject
      }
    };
    
    records.push(canonicalRecord);
    
    // Rate limiting between tickets
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return { recordCount: records.length, records };
}
```

### API Testing Function (MANDATORY)

```typescript
// API CONNECTION TEST (MANDATORY)
export async function testTeamworkConnection(
  encryptedApiKey: string,
  domain: string
): Promise<boolean> {
  try {
    const client = createTeamworkClient(encryptedApiKey, domain);
    await client.get('/tickets.json', { params: { pageSize: 1 } });
    return true;
  } catch (error) {
    return false;
  }
}
```

---

## Q3) FILE PARSING REQUIREMENTS (NEW IN v4.1)

**[CRITICAL] Purpose:** Ensure file parsing is implemented with actual libraries, not left as conceptual "support CSV/Excel".

### File Format Support Rule

**When PRD mentions file format support, specifications MUST provide:**
1. **Required npm package dependencies**
2. **Complete parsing implementation for each format**
3. **Schema detection from parsed data**
4. **Error handling for malformed files**

### Required Dependencies (MANDATORY)

```json
{
  "dependencies": {
    "papaparse": "^5.4.1",    // CSV parsing
    "xlsx": "^0.18.5"          // Excel parsing (.xlsx, .xls)
  },
  "devDependencies": {
    "@types/papaparse": "^5.3.7"
  }
}
```

### Complete File Parser Implementation

```typescript
// FILE PARSER SERVICE (MANDATORY COMPLETE IMPLEMENTATION)

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import fs from 'fs/promises';
import path from 'path';
import { BadRequestError } from '../lib/errors';

export interface ParsedFile {
  columns: string[];
  rows: any[];
  rowCount: number;
  fileType: string;
}

export interface DetectedSchema {
  columns: ColumnInfo[];
  rowCount: number;
  sampleRows: any[];
}

export interface ColumnInfo {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object';
  nullable: boolean;
  sampleValues: any[];
}

// Main parsing function
export async function parseFile(filePath: string): Promise<ParsedFile> {
  const ext = path.extname(filePath).toLowerCase();
  
  switch (ext) {
    case '.csv':
      return parseCSV(filePath);
    case '.xlsx':
    case '.xls':
      return parseExcel(filePath);
    case '.json':
      return parseJSON(filePath);
    default:
      throw new BadRequestError(`Unsupported file type: ${ext}`);
  }
}

// CSV Parser
async function parseCSV(filePath: string): Promise<ParsedFile> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    const result = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Auto-convert numbers
      transformHeader: (header) => header.trim() // Clean headers
    });
    
    if (result.errors.length > 0) {
      throw new BadRequestError(`CSV parsing errors: ${result.errors.map(e => e.message).join(', ')}`);
    }
    
    return {
      columns: result.meta.fields || [],
      rows: result.data,
      rowCount: result.data.length,
      fileType: 'csv'
    };
  } catch (error) {
    if (error instanceof BadRequestError) throw error;
    throw new BadRequestError('Failed to parse CSV file');
  }
}

// Excel Parser
async function parseExcel(filePath: string): Promise<ParsedFile> {
  try {
    const buffer = await fs.readFile(filePath);
    
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json(sheet);
    
    if (data.length === 0) {
      throw new BadRequestError('Excel file is empty');
    }
    
    const columns = Object.keys(data[0]);
    
    return {
      columns,
      rows: data,
      rowCount: data.length,
      fileType: 'excel'
    };
  } catch (error) {
    if (error instanceof BadRequestError) throw error;
    throw new BadRequestError('Failed to parse Excel file');
  }
}

// JSON Parser
async function parseJSON(filePath: string): Promise<ParsedFile> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    const rows = Array.isArray(data) ? data : [data];
    
    if (rows.length === 0) {
      throw new BadRequestError('JSON file is empty');
    }
    
    const columns = Object.keys(rows[0]);
    
    return {
      columns,
      rows,
      rowCount: rows.length,
      fileType: 'json'
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new BadRequestError('Invalid JSON format');
    }
    throw new BadRequestError('Failed to parse JSON file');
  }
}

// Schema Detection
export function detectSchema(rows: any[], sampleSize = 100): DetectedSchema {
  if (rows.length === 0) {
    return { columns: [], rowCount: 0, sampleRows: [] };
  }
  
  const sample = rows.slice(0, sampleSize);
  const columns: ColumnInfo[] = [];
  
  for (const key of Object.keys(rows[0])) {
    const values = sample.map(r => r[key]).filter(v => v != null);
    
    columns.push({
      name: key,
      type: inferType(values),
      nullable: values.length < sample.length,
      sampleValues: values.slice(0, 3)
    });
  }
  
  return {
    columns,
    rowCount: rows.length,
    sampleRows: rows.slice(0, 5)
  };
}

// Type Inference
function inferType(values: any[]): 'string' | 'number' | 'boolean' | 'date' | 'object' {
  if (values.length === 0) return 'string';
  
  const types = values.map(v => {
    if (typeof v === 'number') return 'number';
    if (typeof v === 'boolean') return 'boolean';
    if (v instanceof Date) return 'date';
    if (typeof v === 'object') return 'object';
    
    // Check if string is a date
    if (typeof v === 'string' && !isNaN(Date.parse(v))) {
      return 'date';
    }
    
    return 'string';
  });
  
  // Return most common type
  const typeCounts = types.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a)[0][0] as any;
}
```

---

## Q4) STREAMING EXPORT PATTERNS (NEW IN v4.1)

**[CRITICAL] Purpose:** Prevent "download" or "export" endpoints from returning mock JSON instead of actual file streams.

### Streaming Export Rule

**When PRD mentions data export or download, specifications MUST provide:**
1. **Streaming response headers**
2. **Batch processing for large datasets**
3. **Memory-efficient iteration**
4. **Proper file formatting (JSONL, CSV, etc.)**

### JSONL Streaming Template (MANDATORY)

```typescript
// JSONL EXPORT ENDPOINT (MANDATORY COMPLETE IMPLEMENTATION)

router.get('/datasets/:datasetId/download',
  authenticate,
  async (req, res, next) => {
    try {
      const datasetId = parseIntParam(req.params.datasetId, 'datasetId');
      
      const dataset = await db.query.datasets.findFirst({
        where: eq(datasets.id, datasetId)
      });
      
      if (!dataset) {
        throw new NotFoundError('Dataset not found');
      }
      
      // Set streaming headers
      res.setHeader('Content-Type', 'application/x-ndjson');
      res.setHeader('Content-Disposition', `attachment; filename="${dataset.name}.jsonl"`);
      res.setHeader('Transfer-Encoding', 'chunked');
      
      // Stream records in batches
      const BATCH_SIZE = 1000;
      let offset = 0;
      let recordCount = 0;
      
      while (true) {
        const batch = await db.select()
          .from(datasetRecords)
          .where(eq(datasetRecords.datasetId, datasetId))
          .limit(BATCH_SIZE)
          .offset(offset);
        
        if (batch.length === 0) break;
        
        for (const record of batch) {
          res.write(JSON.stringify(record.data) + '\n');
          recordCount++;
        }
        
        offset += BATCH_SIZE;
      }
      
      res.end();
      
      // Log export
      console.log(`Exported ${recordCount} records from dataset ${datasetId}`);
    } catch (error) {
      next(error);
    }
  }
);
```

### CSV Streaming Template (MANDATORY)

```typescript
// CSV EXPORT ENDPOINT (MANDATORY)

import { stringify } from 'csv-stringify';

router.get('/datasets/:datasetId/download/csv',
  authenticate,
  async (req, res, next) => {
    try {
      const datasetId = parseIntParam(req.params.datasetId, 'datasetId');
      
      const dataset = await db.query.datasets.findFirst({
        where: eq(datasets.id, datasetId)
      });
      
      if (!dataset) {
        throw new NotFoundError('Dataset not found');
      }
      
      // Set CSV headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${dataset.name}.csv"`);
      
      // Create CSV stringifier
      const stringifier = stringify({
        header: true,
        columns: dataset.schema.columns.map(c => c.name)
      });
      
      stringifier.pipe(res);
      
      // Stream records
      const BATCH_SIZE = 1000;
      let offset = 0;
      
      while (true) {
        const batch = await db.select()
          .from(datasetRecords)
          .where(eq(datasetRecords.datasetId, datasetId))
          .limit(BATCH_SIZE)
          .offset(offset);
        
        if (batch.length === 0) break;
        
        for (const record of batch) {
          stringifier.write(record.data);
        }
        
        offset += BATCH_SIZE;
      }
      
      stringifier.end();
    } catch (error) {
      next(error);
    }
  }
);
```

### Generator Function for Memory Efficiency (MANDATORY)

```typescript
// MEMORY-EFFICIENT RECORD STREAMING

export async function* streamDatasetRecords(
  datasetId: number
): AsyncGenerator<any, void, unknown> {
  const BATCH_SIZE = 1000;
  let offset = 0;
  
  while (true) {
    const batch = await db.select()
      .from(datasetRecords)
      .where(eq(datasetRecords.datasetId, datasetId))
      .limit(BATCH_SIZE)
      .offset(offset);
    
    if (batch.length === 0) break;
    
    for (const record of batch) {
      yield record.data;
    }
    
    offset += BATCH_SIZE;
  }
}

// Usage in route
for await (const record of streamDatasetRecords(datasetId)) {
  res.write(JSON.stringify(record) + '\n');
}
```

---

## R) INTEGRATION FLOW REQUIREMENTS (NEW IN v4.1)

**[HIGH] Purpose:** Prevent features from being specified in isolation without showing how they connect end-to-end.

### Integration Flow Rule

**Every major feature flow MUST include:**
1. **Step-by-step execution sequence**
2. **Data transformations between steps**
3. **Error handling at each step**
4. **Status transitions**

### Flow Diagram Format (MANDATORY)

```markdown
## INTEGRATION FLOW: [Feature Name]

### Flow Steps

1. **[Action]** -> Endpoint/Function
   - Input: [What data comes in]
   - Process: [What happens]
   - Output: [What data goes out]
   - Error Cases: [What can go wrong]
   - Next Step: [What happens next]

2. **[Action]** -> Endpoint/Function
   ...

### Complete Example Flow
[Executable code showing entire flow]

### Verification
[How to test this flow end-to-end]
```

### Example: File Upload to Processing Flow

```markdown
## INTEGRATION FLOW: File Upload to Dataset Export

### Flow Sequence

POST /api/projects/:id/sources (with file)
  +"
Multer saves file to disk at `uploads/[uniqueName]`
  +"
fileParser.parse(filePath, mimeType)
  - Reads file content
  - Returns { columns, rows, rowCount }
  +"
schemaDetector.detect(rows)
  - Infers column types
  - Returns { columns: [{ name, type, nullable }], rowCount }
  +"
sourcesService.create({ filePath, detectedSchema, status: 'pending_config' })
  - Saves Source record to database
  - Returns source with id
  +"
RESPONSE: 201 Created with source object

[User configures schema mapping via UI]

PUT /api/sources/:id/schema-mapping
  - Saves user's field mappings
  - Updates source.status = 'configured'
  +"
POST /api/projects/:id/runs (start processing)
  +"
processingService.createRun({ sourceId, projectId })
  - Creates Run record with status: 'running'
  +"
processingService.executeRun(runId)
  +"
Pipeline stages execute:
  a. loadRecords(source.filePath) -> Parse file again
  b. applySchemaMapping(records, source.schemaMapping) -> Transform fields
  c. detectPii(records) -> Scan for sensitive data
  d. applyDeidentification(records, source.piiStrategy) -> Mask/redact PII
  e. transformToOutputFormat(records, project.outputFormat) -> Convert to canonical schema
  +"
datasetService.create({ runId, records, stats })
  - Saves Dataset record
  - Inserts records into datasetRecords table in batches
  - Updates run.status = 'completed', run.datasetId = dataset.id
  +"
RESPONSE: Run object with datasetId

GET /api/datasets/:id/download
  +"
Stream records from datasetRecords table
  - Batch query (1000 records at a time)
  - Write each as JSON line
  - No full dataset loaded into memory
  +"
RESPONSE: JSONL file streamed to client

### Error Handling at Each Step

| Step | Error | Response |
|------|-------|----------|
| File upload | No file provided | 400 Bad Request |
| File parsing | Invalid file format | 400 Bad Request: "Failed to parse CSV" |
| Schema detection | Empty file | 400 Bad Request: "File is empty" |
| Schema mapping | Invalid mapping | 400 Bad Request: "Field X not in schema" |
| Processing | PII detection fails | 500 Internal Error, run.status = 'failed' |
| Export | Dataset not found | 404 Not Found |

### Complete Integration Code

```typescript
// COMPLETE FILE UPLOAD TO EXPORT FLOW

// Step 1: Upload
router.post('/:projectId/sources',
  authenticate,
  upload.single('file'),
  async (req, res, next) => {
    try {
      const projectId = parseIntParam(req.params.projectId, 'projectId');
      if (!req.file) throw new BadRequestError('File required');
      
      const parsed = await fileParser.parse(req.file.path);
      const schema = schemaDetector.detect(parsed.rows);
      
      const source = await sourcesService.create({
        projectId,
        filePath: req.file.path,
        detectedSchema: schema,
        status: 'pending_config'
      });
      
      res.status(201).json({ data: source });
    } catch (error) {
      next(error);
    }
  }
);

// Step 2: Configure
router.put('/sources/:id/schema-mapping',
  authenticate,
  async (req, res, next) => {
    try {
      const sourceId = parseIntParam(req.params.id, 'id');
      const source = await sourcesService.updateSchemaMapping(sourceId, req.body.mapping);
      res.json({ data: source });
    } catch (error) {
      next(error);
    }
  }
);

// Step 3: Process
router.post('/:projectId/runs',
  authenticate,
  async (req, res, next) => {
    try {
      const projectId = parseIntParam(req.params.projectId, 'projectId');
      const run = await processingService.createAndExecuteRun({ projectId });
      res.status(201).json({ data: run });
    } catch (error) {
      next(error);
    }
  }
);

// Step 4: Export
router.get('/datasets/:datasetId/download',
  authenticate,
  async (req, res, next) => {
    try {
      const datasetId = parseIntParam(req.params.datasetId, 'datasetId');
      const dataset = await datasetService.get(datasetId);
      if (!dataset) throw new NotFoundError('Dataset not found');
      
      res.setHeader('Content-Type', 'application/x-ndjson');
      res.setHeader('Content-Disposition', `attachment; filename="${dataset.name}.jsonl"`);
      
      for await (const record of datasetService.streamRecords(datasetId)) {
        res.write(JSON.stringify(record) + '\n');
      }
      
      res.end();
    } catch (error) {
      next(error);
    }
  }
);
```

### Verification Commands

```bash
# Test complete flow
# 1. Upload file
curl -X POST http://localhost:5000/api/projects/1/sources \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.csv"
# Expected: 201 with source.id=X, status='pending_config'

# 2. Configure mapping
curl -X PUT http://localhost:5000/api/sources/X/schema-mapping \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mapping": {"email": "user_email", "message": "message_text"}}'
# Expected: 200 with source.status='configured'

# 3. Start processing
curl -X POST http://localhost:5000/api/projects/1/runs \
  -H "Authorization: Bearer $TOKEN"
# Expected: 201 with run.id=Y, status='running'
# Wait for completion: run.status='completed', run.datasetId=Z

# 4. Download dataset
curl http://localhost:5000/api/datasets/Z/download \
  -H "Authorization: Bearer $TOKEN" \
  -o output.jsonl
# Expected: JSONL file
# Verify: wc -l output.jsonl should match dataset.recordCount
```

---

## R1) DEPENDENCY INJECTION STANDARDS (NEW IN v4.1)

**[HIGH] Purpose:** Prevent services from being created but not properly wired together or initialized in correct order.

### Dependency Graph Rule

**Every service specification MUST include:**
1. **Explicit dependency list**
2. **Initialization order requirements**
3. **Constructor/factory patterns**

### Service Dependency Template (MANDATORY)

```markdown
## SERVICE: [ServiceName]

### Dependencies
- [DependencyA]: [Purpose]
- [DependencyB]: [Purpose]

### Initialization Order
Must be initialized AFTER: [DependencyX, DependencyY]
Must be initialized BEFORE: [DependencyZ]

### Constructor Signature
```typescript
constructor(
  private db: DatabaseConnection,
  private dependencyA: DependencyA,
  private dependencyB: DependencyB
) {}
```

### Example: Service Dependency Graph

```typescript
// SERVICE INITIALIZATION ORDER (MANDATORY)

// 1. Infrastructure (no dependencies)
const db = createDatabaseConnection(process.env.DATABASE_URL!);

// 2. Utilities (depend on infrastructure)
const fileParser = new FileParser();
const schemaDetector = new SchemaDetector();
const encryptionService = new EncryptionService(process.env.ENCRYPTION_KEY!);

// 3. External clients (depend on infrastructure + utilities)
const teamworkClientFactory = new TeamworkClientFactory(encryptionService);

// 4. Domain services (depend on infrastructure + utilities + clients)
const sourcesService = new SourcesService(
  db,
  fileParser,
  schemaDetector,
  teamworkClientFactory
);

const piiDetector = new PiiDetector();
const piiMasker = new PiiMasker();

// 5. Processing services (depend on domain services)
const processingService = new ProcessingService(
  db,
  sourcesService,
  piiDetector,
  piiMasker
);

const datasetsService = new DatasetsService(
  db,
  processingService
);

// 6. Export services
export const services = {
  db,
  sources: sourcesService,
  processing: processingService,
  datasets: datasetsService
};
```

### Constructor Injection Pattern (MANDATORY)

```typescript
// DEPENDENCY INJECTION PATTERN

export class SourcesService {
  constructor(
    private db: DatabaseConnection,
    private fileParser: FileParser,
    private schemaDetector: SchemaDetector,
    private teamworkClient: TeamworkClientFactory
  ) {}
  
  async create(data: CreateSourceInput): Promise<Source> {
    // Can use this.fileParser, this.schemaDetector, etc.
    const parsed = await this.fileParser.parse(data.filePath);
    const schema = this.schemaDetector.detect(parsed.rows);
    
    return this.db.insert(sources).values({
      ...data,
      detectedSchema: schema
    }).returning();
  }
  
  async syncTeamwork(sourceId: number): Promise<SyncResult> {
    const source = await this.get(sourceId);
    const client = this.teamworkClient.create(source.teamworkApiKey, source.teamworkDomain);
    // ... sync logic
  }
}
```

### Circular Dependency Prevention

**[HIGH] If two services need each other:**

```typescript
// BAD - Circular dependency
class ServiceA {
  constructor(private serviceB: ServiceB) {}
}
class ServiceB {
  constructor(private serviceA: ServiceA) {}
}

// GOOD - Extract shared logic to utility
class SharedLogic {
  // Common logic used by both services
}

class ServiceA {
  constructor(private shared: SharedLogic) {}
}

class ServiceB {
  constructor(private shared: SharedLogic) {}
}
```

---

## S) VERIFICATION PROTOCOL (NEW IN v4.1)

**[HIGH] Purpose:** Ensure every feature can be tested with concrete commands, preventing "looks complete but doesn't work" scenarios.

### Verification Requirements

**Every major feature specification MUST include:**
1. **curl commands to test each endpoint**
2. **Expected responses (success and error cases)**
3. **File system verification commands**
4. **Database query verification**

### Verification Template (MANDATORY)

```markdown
## VERIFICATION COMMANDS

### Test [Feature Name]

```bash
# Step 1: [Action]
curl [command]
# Expected: [exact response]
# Verify: [how to confirm it worked]

# Step 2: [Action]
curl [command]
# Expected: [exact response]
```

### Database Verification
```sql
-- Verify [what should exist]
SELECT * FROM [table] WHERE [condition];
-- Expected: [row count or specific values]
```

### File System Verification
```bash
# Verify [what file should exist]
ls -la [path]
# Expected: [file name and size]
```
```

### Complete Verification Example

```markdown
## VERIFICATION COMMANDS: File Upload Feature

### Test File Upload
```bash
# Create test CSV file
echo "email,message
user@example.com,Hello
test@example.com,World" > test.csv

# Upload file
curl -X POST http://localhost:5000/api/projects/1/sources \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.csv" \
  -F "name=Test Source"

# Expected Response:
# {
#   "data": {
#     "id": 1,
#     "projectId": 1,
#     "name": "Test Source",
#     "type": "file",
#     "filePath": "/uploads/[timestamp]-[random].csv",
#     "fileSize": 52,
#     "detectedSchema": {
#       "columns": [
#         {"name": "email", "type": "string", "nullable": false},
#         {"name": "message", "type": "string", "nullable": false}
#       ],
#       "rowCount": 2
#     },
#     "status": "pending_config",
#     "createdAt": "2026-01-22T..."
#   },
#   "meta": {"timestamp": "2026-01-22T..."}
# }
```

### Verification Steps

```bash
# 1. Verify file was saved to disk
ls -la uploads/
# Expected: File with matching timestamp exists, size ~52 bytes

# 2. Verify database record created
psql $DATABASE_URL -c "SELECT id, name, status, file_size FROM sources WHERE project_id = 1;"
# Expected:
#  id | name        | status          | file_size
# ----+-------------+-----------------+-----------
#   1 | Test Source | pending_config  |        52

# 3. Verify schema detection worked
psql $DATABASE_URL -c "SELECT detected_schema FROM sources WHERE id = 1;" | jq
# Expected: JSON with columns array containing email and message fields

# 4. Test error case: no file provided
curl -X POST http://localhost:5000/api/projects/1/sources \
  -H "Authorization: Bearer $TOKEN"
# Expected: 400 Bad Request
# {"error": {"code": "BAD_REQUEST", "message": "File is required"}}

# 5. Test error case: invalid file type
echo "not,a,valid,csv" > test.txt
curl -X POST http://localhost:5000/api/projects/1/sources \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.txt"
# Expected: 400 Bad Request
# {"error": {"code": "BAD_REQUEST", "message": "Invalid file type. Allowed: .csv, .xlsx, .xls, .json"}}
```

### Test Schema Detection Endpoint

```bash
curl http://localhost:5000/api/sources/1/schema \
  -H "Authorization: Bearer $TOKEN"

# Expected:
# {
#   "data": {
#     "columns": [
#       {"name": "email", "type": "string", "nullable": false, "sampleValues": ["user@example.com", "test@example.com"]},
#       {"name": "message", "type": "string", "nullable": false, "sampleValues": ["Hello", "World"]}
#     ],
#     "rowCount": 2
#   },
#   "meta": {"timestamp": "..."}
# }
```

### Test Processing Run

```bash
# Configure schema mapping first
curl -X PUT http://localhost:5000/api/sources/1/schema-mapping \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mapping": {"email": "user_email", "message": "message_text"}}'

# Expected: 200 OK with source.status='configured'

# Start processing run
curl -X POST http://localhost:5000/api/projects/1/runs \
  -H "Authorization: Bearer $TOKEN"

# Expected: 201 Created
# {
#   "data": {
#     "id": 1,
#     "projectId": 1,
#     "status": "running",
#     "startedAt": "...",
#     "datasetId": null
#   }
# }

# Poll for completion (in real implementation, would use websocket or polling)
curl http://localhost:5000/api/runs/1 \
  -H "Authorization: Bearer $TOKEN"

# Expected after completion:
# {
#   "data": {
#     "id": 1,
#     "status": "completed",
#     "datasetId": 1,
#     "completedAt": "...",
#     "stats": {"recordsProcessed": 2, "piiDetected": 2}
#   }
# }

# Verify dataset created
psql $DATABASE_URL -c "SELECT id, name, record_count FROM datasets WHERE id = 1;"
# Expected:
#  id | name        | record_count
# ----+-------------+--------------
#   1 | Test Source |            2
```

### Test Export

```bash
curl http://localhost:5000/api/datasets/1/download \
  -H "Authorization: Bearer $TOKEN" \
  -o output.jsonl

# Verify file downloaded
ls -la output.jsonl
# Expected: File exists, size > 0

# Verify JSONL format
cat output.jsonl
# Expected: Each line is valid JSON
# {"user_email":"user@example.com","message_text":"Hello"}
# {"user_email":"test@example.com","message_text":"World"}

# Verify line count matches record count
wc -l output.jsonl
# Expected: 2 lines (matching dataset.recordCount)

# Verify each line is valid JSON
cat output.jsonl | while read line; do echo "$line" | jq; done
# Expected: No errors, each line parses as JSON
```
```

---

## U) AGENT OUTPUT PROTOCOL (NEW IN v4.5)

**Priority Tier:** CRITICAL  
**Enforcement:** Agent 6, Agent 8

**Rule:** Each agent MUST produce exactly ONE output file containing all required content.

**Context:**
Audit findings show Agent 6 created 6 separate files (execution summary, readme, implementation plan, 3 verification scripts) instead of embedding everything in a single document. This violates the self-contained specification principle and creates maintenance burden.

**Why This Matters:**
- Claude Code expects ONE comprehensive document per agent
- Multiple files fragment the specification
- Separate script files can get lost or out of sync
- Self-contained documents enable complete artifact delivery
- Single-file approach optimizes for LLM context windows

**CRITICAL REQUIREMENTS:**

### 1. Single File Output

**RULE:** Each agent produces exactly ONE markdown file.

**File Naming Convention:**
```
[NN]-[AGENT-NAME].md

Examples:
01-PRD.md
02-ARCHITECTURE.md
03-DATA-MODEL.md
04-API-CONTRACT.md
05-UI-SPECIFICATION.md
06-IMPLEMENTATION-PLAN.md
07-QA-DEPLOYMENT.md
```

### 2. Embedded Content

**RULE:** All supplementary content MUST be embedded inline using markdown code blocks.

**What to Embed:**
- [OK] Verification scripts (bash/shell)
- [OK] Configuration templates (JSON, YAML)
- [OK] Code examples (TypeScript, JavaScript)
- [OK] README instructions
- [OK] Execution summaries
- [OK] Setup guides

**Example Structure:**
```markdown
## Implementation Plan

### Phase 1: Setup

**Tasks:**
- Create project structure
- Initialize dependencies

**Verification Script:**
```bash
#!/bin/bash
# Verify Phase 1 completion
echo "Checking directories..."
[ -d "client/src" ] || exit 1
echo "[OK] Phase 1 complete"
```

### Phase 2: Database
...
```

### 3. File Size Limits

**RULE:** Output files should remain under 5000 lines for optimal LLM processing.

**Size Targets:**
- Agent 1 (PRD): 500-1000 lines
- Agent 2 (Architecture): 1500-2500 lines
- Agent 3 (Data Model): 1000-2000 lines
- Agent 4 (API Contract): 1500-2500 lines
- Agent 5 (UI Spec): 2000-3000 lines
- Agent 6 (Implementation): 3000-4000 lines
- Agent 7 (QA): 1000-1500 lines

**If exceeding 5000 lines:**
- Consolidate repetitive patterns
- Use tables instead of lists
- Reference patterns by ID instead of repeating
- Consider if content belongs in different agent

### 4. Content Organization

**Required Sections (in order):**
```markdown
# [Agent Name]: [Document Type]

## Document Metadata
- Version, Date, Author, Status

## Table of Contents
- Major section links

## [Core Content Sections]
- Varies by agent type

## Verification Commands
- Embedded scripts for validation

## Appendix (if needed)
- Supplementary reference material

## Document End
- Version summary
```

### 5. Forbidden Patterns

**[X] WRONG - Multiple Output Files:**
```
Agent 6 produces:
- execution-summary.md
- readme.md
- 06-implementation-plan.md
- verify-specs.sh
- verify-no-placeholders.sh
- security-check.sh
```

**[OK] CORRECT - Single Output File:**
```
Agent 6 produces:
- 06-IMPLEMENTATION-PLAN.md
  `-- Contains:
     * Execution summary section
     * README section
     * Implementation phases
     * Embedded verify-specs.sh script
     * Embedded verify-no-placeholders.sh script
     * Embedded security-check.sh script
```

### 6. Template Embedding

**RULE:** Templates and scripts MUST be copy-paste ready code blocks.

**Good Template:**
```markdown
**Create verify-phase-1.sh:**
```bash
#!/bin/bash
# scripts/verify-phase-1.sh
# Verify Phase 1 completion

echo "=== Phase 1 Verification ==="
[ -d "client/src/components" ] || { echo "Missing components/"; exit 1; }
[ -f "package.json" ] || { echo "Missing package.json"; exit 1; }
echo "[OK] Phase 1 complete"
```
```

**Bad Template:**
```markdown
Create a verification script that checks:
- Components directory exists
- Package.json file exists
- Dependencies installed
```

### 7. Self-Containment Principle

**RULE:** Output document must be fully self-contained - no external dependencies except upstream agent outputs.

**Self-Contained Means:**
- [OK] All scripts included inline
- [OK] All templates complete
- [OK] All examples executable
- [OK] All instructions actionable
- [X] No "see separate file" references
- [X] No "script provided separately" notes
- [X] No "template available elsewhere" statements

### 8. Agent 6 Special Case

**Agent 6 (Implementation Orchestrator) creates the MOST verification scripts.**

**Requirement:** All verification scripts MUST be embedded in 06-IMPLEMENTATION-PLAN.md as code blocks.

**Example Structure:**
```markdown
## Pattern 27: Specification Validation

**Verification Script:**
```bash
#!/bin/bash
# scripts/verify-specs.sh
[... complete script here ...]
```

## Phase 1: Foundation

**Step 1: Create verify-phase-1.sh:**
```bash
#!/bin/bash
# scripts/verify-phase-1.sh
[... complete script here ...]
```
```

### 9. Verification

**Check single-file output:**
```bash
# Count output files per agent (should be 1)
ls -1 0*-*.md | wc -l   # Should equal number of agents

# Verify no separate script files created
ls -1 *.sh 2>/dev/null | wc -l   # Should be 0 (all scripts embedded)
```

**Agent Responsibilities:**
- **Agent 6:** Embed ALL verification scripts in 06-IMPLEMENTATION-PLAN.md
- **Agent 8:** Check for multiple output files (audit violation)

---

## V) CONSTITUTION REFERENCE RULE (NEW IN v4.5)

**Priority Tier:** HIGH  
**Enforcement:** All Agents

**Rule:** Agents reference the Constitution using inheritance model, not version-specific references.

**Context:**
Previously, agents included version-specific constitution references like "Constitution: Agent 0 v4.4". Every constitution update required cascading updates to all 8 agent specifications. This creates unnecessary maintenance burden.

**Why This Matters:**
- Constitution updates are frequent (v4.0 -> v4.5 in weeks)
- Cascading updates to 8 agents for version bumps is wasteful
- Constitution is foundational - agents inherit its rules generically
- Framework version (v2.1) already indicates compatibility

**CRITICAL REQUIREMENT:**

### Constitution Reference Format

**RULE:** All agents MUST use inheritance model for constitution references.

**Correct Format:**
```markdown
## FRAMEWORK VERSION

Framework: Agent Specification Framework v2.1
Constitution: Inherited from Agent 0
Status: Active
Optimization: Claude Code Execution
```

**Forbidden Format:**
```markdown
## FRAMEWORK VERSION

Framework: Agent Specification Framework v2.1
Constitution: Agent 0 - Agent Constitution v4.4   [X] Version-specific reference
Status: Active
```

**Rationale:**
- Agents **inherit** constitutional rules (not depend on specific versions)
- Constitution in same directory is authoritative
- Framework version indicates overall compatibility
- Eliminates cascading maintenance when constitution updates

**Migration Rule:**
When updating agents, change:
- FROM: `Constitution: Agent 0 - Agent Constitution v4.X`
- TO: `Constitution: Inherited from Agent 0`

**Agent Responsibilities:**
- **All Agents (1-8):** Use inheritance model
- **Agent 0:** No self-reference needed (it IS the constitution)

---

## DOCUMENT END

**Constitution v4.5 Complete**

All agents in the chain must inherit and comply with this Constitution.

For questions about Constitution interpretation or proposed amendments, create CHANGE_REQUEST entries in Assumption Registers with complete lifecycle metadata.

**What Changed in v4.5:**
- Added Agent Output Protocol (Section U) mandating single-file output per agent
- Each agent produces exactly ONE markdown file with all content embedded inline
- Verification scripts, templates, and supplementary docs MUST be embedded (not separate files)
- File size target: under 5000 lines for optimal LLM processing
- Addresses audit finding: Agent 6 created 6 files instead of 1 self-contained document
- Added Constitution Reference Rule (Section V) establishing inheritance model
- Agents reference "Inherited from Agent 0" instead of version-specific citations
- Eliminates cascading maintenance when constitution updates
- Constitution in same directory is authoritative for all agents


---

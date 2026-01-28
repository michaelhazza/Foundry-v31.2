# System Architecture: Foundry

## Document Metadata
- **Version:** 1.0
- **Date:** 2026-01-28
- **Author:** Agent 2 (System Architecture)
- **Status:** Complete
- **Upstream:** 01-PRD.md (Agent 1)
- **Downstream:** Agent 3 (Data Modeling), Agent 4 (API Contract), Agent 5 (UI/UX), Agent 6 (Implementation)
- **Constitution:** Inherited from Agent 0

---

## PHASE 1: ARCHITECTURAL DRIVERS

### Deployment Context
- **Platform:** Replit (Single Container Monolith)
- **Scale Target:** 50 concurrent users, 100 organizations, 1,000 projects
- **Performance Requirements:** <5 min time to first output, <2 sec page loads
- **Compliance:** PII detection and de-identification required

### Hard Constraints
1. **Replit Platform Constraints:**
   - Port 5000 for production (Replit exposed port)
   - Network binding: 127.0.0.1 (dev), 0.0.0.0 (prod) - NEVER "localhost"
   - Ephemeral filesystem - no persistent file storage
   - Environment via Replit Secrets
   - Cold start behavior after inactivity
   - Single container deployment model

2. **Project Requirements (from PRD):**
   - Multi-tenant data isolation (organization-level)
   - Async batch processing for large datasets
   - File upload support (CSV, Excel, images) up to 100MB
   - External API integration (Teamwork Desk - optional)
   - JWT authentication with 7-day expiration
   - Processing timeout: 10 minutes max
   - Dataset scale: up to 100,000 records

### Technology Elimination

**Eliminated Technologies:**
- ❌ **Microservices:** Violates Replit single-container constraint
- ❌ **S3/External Storage:** Adds unnecessary complexity for MVP; local processing sufficient
- ❌ **Redis:** Deferred to Phase 2; not required for 50 concurrent users
- ❌ **GraphQL:** REST API sufficient; GraphQL adds complexity
- ❌ **WebSockets:** Not required for MVP; polling acceptable
- ❌ **Docker Compose:** Replit uses single container
- ❌ **Prisma:** Drizzle ORM simpler and TypeScript-native

---

## PHASE 2: TECHNOLOGY STACK

### Backend Stack

| Component | Technology | Rationale | Alternatives Considered |
|-----------|-----------|-----------|------------------------|
| **Runtime** | Node.js 20.x | Replit standard, TypeScript support, mature ecosystem | Deno (less mature), Bun (too new) |
| **Framework** | Express.js 4.x | Industry standard, middleware ecosystem, Replit compatible | Fastify (less middleware), Koa (more complex) |
| **Database** | PostgreSQL (Replit Neon) | ACID compliance for multi-tenant, JSON support, Replit managed | MySQL (weaker JSON), MongoDB (no transactions) |
| **ORM** | Drizzle ORM 0.30+ | Type-safe, lightweight, zero runtime overhead | Prisma (heavier), TypeORM (more complex) |
| **DB Driver** | `pg` (node-postgres) | Replit requirement, standard PostgreSQL driver | `@neondatabase/serverless` (not needed) |
| **Auth** | JWT via jsonwebtoken | Stateless, scales horizontally, simple implementation | Sessions (requires Redis), OAuth (overkill for MVP) |
| **Validation** | Zod 3.x | Runtime type safety, TypeScript integration | Joi (less TypeScript), Yup (older) |
| **File Upload** | multer 1.4+ | Stream processing, memory efficient | formidable (less maintained), busboy (lower level) |
| **File Parsing** | papa parse (CSV), xlsx (Excel) | Industry standard parsers | csv-parser (less features), exceljs (heavier) |
| **Scheduling** | node-cron 3.x | Simple cron jobs for cleanup tasks | Bull (requires Redis), Agenda (MongoDB) |
| **Logging** | winston 3.x | Structured JSON logs, multiple transports | pino (less features), bunyan (older) |

### Frontend Stack

| Component | Technology | Rationale | Alternatives Considered |
|-----------|-----------|-----------|------------------------|
| **Framework** | React 18.x | Component model, ecosystem, Replit standard | Vue (smaller ecosystem), Svelte (less mature) |
| **Build Tool** | Vite 5.x | Fast HMR, TypeScript support, Replit optimized | webpack (slower), Parcel (less configured) |
| **State Management** | TanStack Query v5 | Server state caching, automatic refetching | Redux (overkill), Zustand (client state only) |
| **UI Library** | shadcn/ui + Radix UI | Accessible, customizable, Tailwind-based | Material UI (heavy), Chakra (different paradigm) |
| **Styling** | Tailwind CSS 3.x | Utility-first, fast prototyping, maintainable | CSS Modules (verbose), Styled Components (runtime cost) |
| **Forms** | React Hook Form + Zod | Performance, validation integration | Formik (heavier), Final Form (older) |
| **Routing** | React Router 6.x | Standard routing, nested routes | TanStack Router (too new), Reach Router (deprecated) |

### Security & Infrastructure

| Component | Technology | Rationale | Alternatives Considered |
|-----------|-----------|-----------|------------------------|
| **Password Hashing** | bcrypt 5.x | Industry standard, configurable work factor | argon2 (less supported), scrypt (older) |
| **CORS** | cors middleware | Simple configuration | helmet (security headers) |
| **Rate Limiting** | express-rate-limit | Simple implementation, sufficient for MVP | Redis rate limiter (overkill) |
| **Security Headers** | helmet | Security best practices | Manual headers (error-prone) |
| **Input Sanitization** | Zod validation | Type-safe validation | express-validator (less TypeScript) |

---

## PHASE 3: SYSTEM ARCHITECTURE

### Architectural Pattern
**Layered Monolithic Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  (React + Vite - Port 5000 in dev proxies to :3001)        │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Express)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Routes    │  │  Middleware │  │  Controllers│        │
│  │ (endpoints) │→ │  (auth,val) │→ │  (handlers) │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │    Services      │  │   Processors     │               │
│  │ (CRUD, business) │  │  (async jobs)    │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Data Access Layer                        │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  Drizzle ORM     │  │   Repositories   │               │
│  │  (schema, query) │  │  (data access)   │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│             PostgreSQL (Replit Neon Database)                │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### 1. API Layer
- **Routes:** Endpoint definitions, parameter extraction
- **Middleware:** Authentication, validation, error handling, rate limiting
- **Controllers:** Request/response handling, delegate to services

#### 2. Business Logic Layer
- **Services:** CRUD operations, business rules, orchestration
- **Processors:** Async batch processing, file parsing, PII detection
- **Validators:** Input validation schemas (Zod)

#### 3. Data Access Layer
- **ORM:** Drizzle schema definitions, migrations
- **Repositories:** Database query encapsulation
- **Models:** TypeScript type definitions

#### 4. Infrastructure Layer
- **Database Connection:** Pooled connections via pg driver
- **File Handler:** Multer for uploads, stream processing
- **Logger:** Winston structured logging
- **Scheduler:** node-cron for cleanup jobs

---

## PHASE 4: EXTERNAL INTEGRATIONS

### Integration: Teamwork Desk API

| Property | Value |
|----------|-------|
| **Type** | REST API (OAuth 2.0 Bearer token) |
| **Purpose** | Import support tickets for AI training data |
| **Required** | NO - Optional integration for Phase 2 |
| **Authentication** | OAuth 2.0 with API key fallback |
| **Rate Limits** | 120 requests/minute (per Teamwork Desk docs) |
| **Endpoints Used** | `/tickets.json`, `/tickets/{id}.json`, `/conversations/{id}.json` |
| **Data Volume** | ~10,000 tickets typical |
| **Failure Mode** | Graceful degradation - manual CSV upload alternative |
| **Cost** | Free tier: 2 users, paid: $10/user/month |
| **Implementation** | Axios client with retry logic, exponential backoff |

**Integration Flow:**
1. User provides Teamwork API credentials in UI
2. System validates credentials with test API call
3. System stores encrypted credentials in database
4. Background job fetches tickets in batches (100/request)
5. Transform tickets to standard Source format
6. Create Source records in database
7. User configures schema mapping (same as file upload)

### File Upload Integration

| Property | Value |
|----------|-------|
| **Types Supported** | CSV, Excel (.xlsx, .xls), Images (.png, .jpg) |
| **Max File Size** | 100MB per file |
| **Max Files** | 10 files per batch upload |
| **Storage** | Ephemeral temp directory (`/tmp/uploads`) |
| **Processing** | Stream-based parsing (no full load into memory) |
| **Validation** | MIME type, magic number, size checks |
| **Security** | Virus scanning deferred to Phase 2 |
| **Cleanup** | Automatic deletion after processing (30-day retention for Source reference) |

---

## PHASE 5: SECURITY ARCHITECTURE

### Authentication Flow

#### Registration
1. **POST /api/auth/register**
   - Input: `{ email, password, name, organizationName }`
   - Validation: Email format, password strength (min 8 chars, 1 uppercase, 1 number)
   - Process:
     - Check email uniqueness
     - Hash password with bcrypt (work factor: 10)
     - Create Organization record
     - Create User record with role: 'owner'
     - Generate JWT token (7-day expiry)
   - Output: `{ token, user, organization }`

#### Login
2. **POST /api/auth/login**
   - Input: `{ email, password }`
   - Process:
     - Find user by email
     - Compare password with bcrypt
     - Generate JWT token
     - Update last_login_at
   - Output: `{ token, user, organization }`

#### Token Management
3. **JWT Structure:**
   ```typescript
   {
     userId: number,
     organizationId: number,
     role: 'owner' | 'admin' | 'member',
     iat: number,
     exp: number  // 7 days from iat
   }
   ```

4. **Token Verification:**
   - Middleware: `requireAuth`
   - Extracts token from `Authorization: Bearer <token>` header
   - Verifies signature and expiration
   - Attaches decoded payload to `req.user`
   - Returns 401 if invalid/expired

#### Password Reset
5. **POST /api/auth/forgot-password**
   - Input: `{ email }`
   - Process:
     - Find user by email
     - Generate reset token (crypto.randomBytes(32), hex encoded)
     - Store token hash in database with 1-hour expiry
     - Send email with reset link
   - Output: `{ message: "Reset email sent" }`

6. **POST /api/auth/reset-password**
   - Input: `{ token, newPassword }`
   - Process:
     - Find user by token hash
     - Verify token not expired
     - Hash new password
     - Update user password
     - Invalidate reset token
   - Output: `{ message: "Password reset successful" }`

#### Logout
7. **POST /api/auth/logout**
   - Input: None (token in header)
   - Process: No-op (JWT is stateless)
   - Output: `{ message: "Logged out" }`
   - Note: Client must delete token

### Authorization Model

#### Role-Based Access Control (RBAC)

| Role | Permissions | Use Cases |
|------|------------|-----------|
| **owner** | Full access: all CRUD operations, invite/remove users, org settings | Organization creator |
| **admin** | All CRUD operations, invite users (can't remove owner) | Team lead |
| **member** | Read all, create projects/sources, edit own, delete own | Regular user |

#### Multi-Tenant Isolation

**Enforcement Strategy: Query-Level Filtering**

All queries MUST include `organizationId` filter from `req.user.organizationId`:

```typescript
// CORRECT - Secure query
const projects = await db.query.projects.findMany({
  where: eq(projects.organizationId, req.user.organizationId)
});

// WRONG - Data leak vulnerability
const projects = await db.query.projects.findMany();
```

**Middleware: `requireOrganization`**
- Verifies user belongs to organization
- Attaches `organizationId` to request
- All data-accessing routes must use this middleware

### Sensitive Data Encryption

#### Encryption Specification (AUDIT FIX: HIGH-001)

Applications with OAuth integrations, third-party API keys, or sensitive data storage MUST encrypt sensitive data at rest.

**Encrypted Fields:**
1. **Teamwork API Credentials**
   - Field: `integrations.credentials` (TEXT column storing JSON)
   - Algorithm: AES-256-GCM
   - Key Source: `ENCRYPTION_KEY` environment variable (32 bytes, base64-encoded)
   - Implementation: Node.js `crypto` module

2. **Password Reset Tokens**
   - Field: `password_reset_tokens.token_hash`
   - Algorithm: SHA-256 hash (not encryption, one-way hash)
   - No key needed (one-way hash)

**Encryption Implementation:**

```typescript
// /server/utils/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable not set');
  }
  return Buffer.from(key, 'base64');
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  const key = crypto.pbkdf2Sync(getKey(), salt, 100000, 32, 'sha256');
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  
  const result = Buffer.concat([salt, iv, tag, encrypted]);
  return result.toString('hex');
}

export function decrypt(encryptedHex: string): string {
  const buffer = Buffer.from(encryptedHex, 'hex');
  
  const salt = buffer.subarray(0, SALT_LENGTH);
  const iv = buffer.subarray(SALT_LENGTH, TAG_POSITION);
  const tag = buffer.subarray(TAG_POSITION, ENCRYPTED_POSITION);
  const encrypted = buffer.subarray(ENCRYPTED_POSITION);
  
  const key = crypto.pbkdf2Sync(getKey(), salt, 100000, 32, 'sha256');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}
```

**Key Management:**
- **Development:** Hardcoded key in `.env` (committed to repo for team access)
- **Production:** Key stored in Replit Secrets (never committed)
- **Rotation:** Manual key rotation requires database migration (encrypt with new key)

**Verification:**
```bash
# Verify encryption.ts exists
ls -l server/utils/encryption.ts

# Verify no plaintext API keys in database
grep -r "api_key" server/services/*.ts | grep -v "encrypt("
```

---

## PHASE 6: RESPONSE ENVELOPE SPECIFICATION (AUDIT FIX: MED-001)

### Envelope Structure

All API responses MUST use standardized envelopes defined by response helpers.

#### Success Response
```typescript
{
  "data": <T>,           // Generic type - single object or array
  "meta": {
    "timestamp": "2026-01-28T10:30:00Z"
  }
}
```

#### Paginated Response
```typescript
{
  "data": <T[]>,         // Array of items
  "meta": {
    "timestamp": "2026-01-28T10:30:00Z"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasMore": true
  }
}
```

#### Error Response
```typescript
{
  "error": {
    "code": "VAL-001",                    // Canonical error code
    "message": "Validation failed",       // Human-readable message
    "details": [                          // Optional detailed errors
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

#### No Content Response
- HTTP 204 No Content
- Empty body

### Response Helpers

**File: `/server/utils/response.ts`**

```typescript
import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ErrorDetail {
  field?: string;
  message: string;
}

export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): Response {
  return res.status(statusCode).json({
    data,
    meta: {
      timestamp: new Date().toISOString()
    }
  });
}

export function sendCreated<T>(res: Response, data: T): Response {
  return sendSuccess(res, data, 201);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta
): Response {
  return res.status(200).json({
    data,
    meta: {
      timestamp: new Date().toISOString()
    },
    pagination
  });
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  details?: ErrorDetail[],
  statusCode: number = 400
): Response {
  return res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details && { details })
    }
  });
}
```

### Error Code Catalog

| Code | HTTP Status | Meaning | Example |
|------|------------|---------|---------|
| **AUTH-001** | 401 | Invalid credentials | Wrong email/password |
| **AUTH-002** | 401 | Token expired | JWT expired after 7 days |
| **AUTH-003** | 401 | Token invalid | Malformed JWT |
| **AUTH-004** | 403 | Insufficient permissions | Member trying owner action |
| **VAL-001** | 400 | Validation failed | Zod schema validation error |
| **VAL-002** | 400 | Required field missing | Missing email in request |
| **VAL-003** | 400 | Invalid format | Invalid UUID format |
| **DB-001** | 500 | Database query failed | PostgreSQL error |
| **DB-002** | 409 | Duplicate entry | Email already exists |
| **DB-003** | 404 | Resource not found | Project ID not found |
| **API-001** | 502 | External API failed | Teamwork API timeout |
| **API-002** | 429 | Rate limit exceeded | External API rate limit |
| **SYS-001** | 500 | Internal server error | Unhandled exception |
| **FILE-001** | 400 | File too large | >100MB upload |
| **FILE-002** | 400 | Invalid file type | .exe file uploaded |
| **FILE-003** | 500 | File parsing failed | Corrupted CSV |

### Usage in Routes

**MANDATORY PATTERN:**
```typescript
// CORRECT - Use helpers
import { sendSuccess, sendError } from '../utils/response';

router.get('/projects', requireAuth, async (req, res) => {
  try {
    const projects = await projectService.findAll(req.user.organizationId);
    return sendSuccess(res, projects);
  } catch (error) {
    return sendError(res, 'DB-001', 'Failed to fetch projects', undefined, 500);
  }
});

// WRONG - Direct res.json()
router.get('/projects', requireAuth, async (req, res) => {
  const projects = await projectService.findAll(req.user.organizationId);
  res.json(projects);  // ❌ VIOLATES STANDARD
});
```

---

## PHASE 7: ARCHITECTURE DECISION RECORDS (ADRs)

### ADR-001: Technology Stack Selection

**Status:** Accepted

**Context:**
Need to select a technology stack that balances:
- Replit deployment constraints (single container, port 5000)
- Team TypeScript expertise
- MVP timeline (4-6 weeks)
- Scaling path to 500 concurrent users

**Decision:**
Adopt **PERN Stack** (PostgreSQL, Express, React, Node.js) with TypeScript throughout:
- **Backend:** Node.js 20 + Express.js 4 + TypeScript 5
- **Database:** PostgreSQL (Replit Neon) + Drizzle ORM
- **Frontend:** React 18 + Vite 5 + Tailwind CSS + shadcn/ui
- **State:** TanStack Query v5 for server state

**Alternatives Considered:**
1. **MERN Stack (MongoDB):** Rejected due to lack of ACID transactions for multi-tenant data
2. **Nest.js + Fastify:** Rejected due to higher learning curve and overkill for MVP
3. **Next.js Full-Stack:** Rejected due to Replit deployment complexity

**Consequences:**
- **Positive:** TypeScript end-to-end reduces bugs, fast development, Replit-native
- **Negative:** No built-in real-time (WebSockets) - polling required if needed later
- **Risks:** Node.js single-threaded may bottleneck large file processing (mitigated by streams)

**Verification:**
```bash
# Verify stack matches
grep '"typescript"' package.json
grep '"express"' package.json
grep '"react"' client/package.json
```

---

### ADR-002: Authentication Mechanism

**Status:** Accepted

**Context:**
Need stateless authentication that scales horizontally without session storage.

**Decision:**
Use **JWT (JSON Web Tokens)** with 7-day expiration:
- Tokens signed with HS256 algorithm
- Secret key in environment variable `JWT_SECRET`
- No refresh tokens in MVP (user must re-login after 7 days)
- Tokens stored in client localStorage

**Alternatives Considered:**
1. **Session-based auth with Redis:** Rejected due to Redis not in MVP scope
2. **OAuth 2.0 only:** Rejected as overkill; basic auth needed
3. **Refresh tokens:** Deferred to Phase 2 (adds complexity)

**Implementation:**
```typescript
// Token structure
interface JWTPayload {
  userId: number;
  organizationId: number;
  role: 'owner' | 'admin' | 'member';
  iat: number;
  exp: number;
}

// Token generation
const token = jwt.sign(
  { userId, organizationId, role },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
);

// Token verification middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

**Consequences:**
- **Positive:** Stateless, scalable, simple implementation
- **Negative:** Cannot revoke tokens before expiry (must wait 7 days)
- **Risks:** If JWT_SECRET leaks, all tokens compromised (mitigation: rotate secret)

**Verification:**
```bash
# Verify JWT implementation
grep "jsonwebtoken" server/package.json
grep "requireAuth" server/middleware/auth.ts
```

---

### ADR-003: Multi-Tenant Isolation Strategy

**Status:** Accepted

**Context:**
Multiple organizations must share database without data leakage.

**Decision:**
Use **query-level filtering** with `organizationId` foreign key:
- All tables (except `organizations` and `users`) have `organization_id` column
- All queries MUST filter by `req.user.organizationId`
- Middleware `requireOrganization` enforces this
- No separate databases per tenant (too complex for MVP)

**Alternatives Considered:**
1. **Separate databases per tenant:** Rejected due to Replit single database limit
2. **Row-Level Security (RLS) in PostgreSQL:** Rejected due to ORM complexity
3. **Schema-based isolation:** Rejected due to migration complexity

**Implementation:**
```typescript
// Middleware to enforce tenant context
function requireOrganization(req, res, next) {
  if (!req.user?.organizationId) {
    return res.status(401).json({ error: 'Organization context required' });
  }
  next();
}

// Query helper
async function findProjectsForOrg(organizationId: number) {
  return db.query.projects.findMany({
    where: eq(projects.organizationId, organizationId)
  });
}

// WRONG - Data leak
async function findAllProjects() {
  return db.query.projects.findMany();  // ❌ No organizationId filter
}
```

**Consequences:**
- **Positive:** Simple to implement, standard pattern, minimal overhead
- **Negative:** Risk of developer forgetting filter (requires code review)
- **Risks:** SQL injection if organizationId not properly sanitized (mitigated by ORM)

**Verification:**
```bash
# Verify all services use organizationId
grep -r "organizationId" server/services/*.ts | wc -l
grep -r "findMany()" server/services/*.ts | grep -v "organizationId"
```

---

### ADR-004: ORM Selection

**Status:** Accepted

**Context:**
Need type-safe database access layer with migrations support.

**Decision:**
Use **Drizzle ORM** for database access:
- TypeScript-native with zero runtime overhead
- SQL-like syntax (easier for developers knowing SQL)
- Built-in migration system
- Excellent Replit/Neon compatibility

**Alternatives Considered:**
1. **Prisma:** Rejected due to heavier runtime, code generation step
2. **TypeORM:** Rejected due to decorator complexity, heavier codebase
3. **Raw SQL with pg:** Rejected due to lack of type safety

**Implementation:**
```typescript
// Schema definition
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Query example
const results = await db.select().from(projects)
  .where(eq(projects.organizationId, orgId));
```

**Consequences:**
- **Positive:** Type safety, lightweight, SQL familiarity
- **Negative:** Smaller community vs Prisma, fewer third-party tools
- **Risks:** Breaking changes in Drizzle (still pre-1.0) - mitigated by pinning versions

**Verification:**
```bash
# Verify Drizzle is used
grep "drizzle-orm" server/package.json
ls server/db/schema.ts
```

---

### ADR-005: Soft Delete Implementation

**Status:** Accepted

**Context:**
Users expect "undo" capability when deleting projects/datasets.

**Decision:**
Implement **global soft delete** pattern:
- All deletable entities have `deleted_at` TIMESTAMP column
- DELETE operations set `deleted_at = NOW()`
- All queries filter `WHERE deleted_at IS NULL` by default
- Permanent deletion scheduled via cron job (30 days after soft delete)

**Alternatives Considered:**
1. **Hard delete only:** Rejected due to poor UX (no undo)
2. **Per-entity soft delete:** Rejected due to inconsistency
3. **Audit log instead of soft delete:** Rejected due to complexity

**Implementation:**
```typescript
// Schema pattern
export const projects = pgTable('projects', {
  // ... other fields
  deletedAt: timestamp('deleted_at'),  // NULL = not deleted
});

// Soft delete function
async function softDelete(id: number, orgId: number) {
  return db.update(projects)
    .set({ deletedAt: new Date() })
    .where(and(
      eq(projects.id, id),
      eq(projects.organizationId, orgId)
    ));
}

// Query helper
async function findActive(orgId: number) {
  return db.select().from(projects)
    .where(and(
      eq(projects.organizationId, orgId),
      isNull(projects.deletedAt)  // Exclude soft-deleted
    ));
}

// Restore function
async function restore(id: number, orgId: number) {
  return db.update(projects)
    .set({ deletedAt: null })
    .where(and(
      eq(projects.id, id),
      eq(projects.organizationId, orgId)
    ));
}

// Cleanup cron job
cron.schedule('0 2 * * *', async () => {  // Daily at 2 AM
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await db.delete(projects)
    .where(lt(projects.deletedAt, thirtyDaysAgo));
});
```

**Consequences:**
- **Positive:** Better UX, accidental deletion recovery, audit trail
- **Negative:** More complex queries, larger database (30-day retention)
- **Risks:** Forgotten cleanup job fills database - mitigated by monitoring

**Verification:**
```bash
# Verify soft delete columns
grep "deletedAt" server/db/schema.ts | wc -l
grep "deleted_at IS NULL" server/services/*.ts | wc -l
```

---

### ADR-006: File Upload Strategy

**Status:** Accepted

**Context:**
Users upload CSV/Excel files up to 100MB. Replit has ephemeral filesystem.

**Decision:**
Use **local filesystem with stream processing**:
- Multer middleware writes files to `/tmp/uploads` during request
- Parser reads files as streams (never full load into memory)
- After processing, file path stored in `sources.file_path`
- Files deleted after 30 days via cron job
- Ephemeral FS acceptable - files reparsable from `file_path` if needed

**Alternatives Considered:**
1. **S3/Cloudflare R2:** Rejected due to complexity and cost for MVP
2. **Base64 in database:** Rejected due to 100MB limit exceeding practical blob size
3. **External upload service (Uploadcare):** Rejected due to cost

**Implementation:**
```typescript
// Multer configuration
const upload = multer({
  dest: '/tmp/uploads',
  limits: {
    fileSize: 100 * 1024 * 1024,  // 100MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['text/csv', 'application/vnd.ms-excel', 'image/png', 'image/jpeg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Route with upload
router.post('/sources', requireAuth, upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const parsed = await fileParser.parse(filePath, req.file.mimetype);
  
  const source = await sourceService.create({
    organizationId: req.user.organizationId,
    filePath,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    detectedSchema: parsed.schema
  });
  
  return sendCreated(res, source);
});

// Cleanup cron job
cron.schedule('0 3 * * *', async () => {  // Daily at 3 AM
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const oldSources = await db.select().from(sources)
    .where(lt(sources.createdAt, thirtyDaysAgo));
  
  for (const source of oldSources) {
    await fs.unlink(source.filePath).catch(() => {});  // Ignore if already deleted
  }
});
```

**Consequences:**
- **Positive:** Simple, no external dependencies, fast for MVP
- **Negative:** Files lost on Replit restart (acceptable for cache)
- **Risks:** Disk space if cleanup fails - mitigated by monitoring

**Verification:**
```bash
# Verify multer config
grep "multer" server/package.json
grep "upload.single" server/routes/*.ts
ls /tmp/uploads
```

---

### ADR-007: Error Handling Strategy

**Status:** Accepted

**Context:**
Need consistent error responses across API for client-side error handling.

**Decision:**
Use **structured error codes** with standard HTTP status mapping:
- Every error has canonical code (e.g., `AUTH-001`, `VAL-003`)
- Errors map to standard HTTP status codes
- Response helper `sendError(code, message, details?, status?)`
- Global error middleware catches unhandled errors

**Alternatives Considered:**
1. **Generic messages only:** Rejected due to poor client debuggability
2. **Exception-based errors:** Rejected due to inconsistent handling
3. **Error classes hierarchy:** Rejected due to complexity

**Implementation:**
```typescript
// Error code mapping
const ERROR_CODES = {
  'AUTH-001': 401,
  'AUTH-002': 401,
  'AUTH-003': 401,
  'AUTH-004': 403,
  'VAL-001': 400,
  'DB-001': 500,
  'DB-002': 409,
  'DB-003': 404,
  'FILE-001': 400,
  'SYS-001': 500,
} as const;

// Usage in service
if (!user) {
  throw new AppError('AUTH-001', 'Invalid credentials');
}

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    const status = ERROR_CODES[err.code] || 500;
    return sendError(res, err.code, err.message, err.details, status);
  }
  
  // Unhandled error
  logger.error('Unhandled error', { error: err });
  return sendError(res, 'SYS-001', 'Internal server error', undefined, 500);
});
```

**Consequences:**
- **Positive:** Consistent client error handling, better debugging
- **Negative:** Must maintain error code catalog
- **Risks:** Code collision if not careful - mitigated by prefix system

**Verification:**
```bash
# Verify error codes used
grep "sendError" server/routes/*.ts | wc -l
grep "AUTH-\|VAL-\|DB-" server/services/*.ts | wc -l
```

---

### ADR-008: Logging Strategy

**Status:** Accepted

**Context:**
Need structured logs for debugging production issues and audit trail.

**Decision:**
Use **winston with JSON structured logging**:
- All logs in JSON format for parsing
- Log levels: error, warn, info, debug
- Include context: userId, organizationId, requestId, timestamp
- Transport: console (stdout) in Replit
- Sensitive data (passwords, tokens) never logged

**Alternatives Considered:**
1. **console.log only:** Rejected due to lack of structure
2. **Pino logger:** Rejected due to less features than winston
3. **External service (Datadog):** Deferred to Phase 2

**Implementation:**
```typescript
// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Usage
logger.info('User login', {
  userId: user.id,
  organizationId: user.organizationId,
  email: user.email,
  timestamp: new Date().toISOString()
});

logger.error('File parsing failed', {
  sourceId: source.id,
  filePath: source.filePath,
  error: err.message,
  stack: err.stack
});

// Middleware for request logging
app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  
  logger.info('Request', {
    requestId,
    method: req.method,
    url: req.url,
    userId: req.user?.userId,
    organizationId: req.user?.organizationId
  });
  
  next();
});
```

**Consequences:**
- **Positive:** Structured, parseable, context-rich logs
- **Negative:** More verbose than simple console.log
- **Risks:** Sensitive data leak if not careful - mitigated by code review

**Verification:**
```bash
# Verify winston used
grep "winston" server/package.json
grep "logger.info\|logger.error" server/**/*.ts | wc -l
```

---

### ADR-009: Database Driver Selection

**Status:** Accepted

**Context:**
Replit documentation specifies `pg` driver for Neon PostgreSQL connections.

**Decision:**
Use **`pg` (node-postgres)** as database driver:
- Standard PostgreSQL driver for Node.js
- Replit-documented driver for Neon databases
- Compatible with Drizzle ORM
- Connection pooling built-in

**Alternatives Considered:**
1. **@neondatabase/serverless:** Rejected - only needed for serverless edge environments
2. **postgres.js:** Rejected - less mature, fewer features

**Implementation:**
```typescript
// Database connection
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,  // Connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool);
```

**Consequences:**
- **Positive:** Official Replit support, proven reliability
- **Negative:** None significant
- **Risks:** None - standard driver

**Verification:**
```bash
# Verify pg driver used
grep '"pg"' server/package.json
grep "node-postgres" server/db/connection.ts
grep -v "@neondatabase/serverless" server/package.json
```

---

### ADR-010: Network Binding Addresses

**Status:** Accepted

**Context:**
Replit requires specific network binding to prevent ECONNREFUSED errors.

**Decision:**
Use **explicit IPv4 binding addresses**:
- **Development (local):**
  - Frontend (Vite): `0.0.0.0:5000` (external access for preview)
  - Backend (Express): `127.0.0.1:3001` (IPv4 explicit for proxy)
- **Production (Replit):**
  - Frontend: Serves static build via Express
  - Backend (Express): `0.0.0.0:5000` (Replit reverse proxy)
- **FORBIDDEN:** Binding to `"localhost"` (causes IPv6/IPv4 mismatch)

**Alternatives Considered:**
1. **Bind to "localhost":** Rejected - causes IPv6/IPv4 conflicts
2. **IPv6 only:** Rejected - Replit uses IPv4
3. **0.0.0.0 in dev:** Rejected - Vite proxy needs 127.0.0.1

**Implementation:**
```typescript
// Development server (server/index.ts)
const HOST = process.env.NODE_ENV === 'production' 
  ? '0.0.0.0' 
  : '127.0.0.1';
const PORT = process.env.PORT || 3001;

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

// Vite config (vite.config.ts)
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',  // IPv4 explicit
        changeOrigin: true
      }
    }
  }
});
```

**Consequences:**
- **Positive:** Eliminates ECONNREFUSED errors
- **Negative:** Must remember binding rules
- **Risks:** Developer forgets and uses "localhost" - mitigated by code review

**Verification:**
```bash
# Verify correct binding
grep "listen.*127.0.0.1" server/index.ts
grep "host.*0.0.0.0" vite.config.ts
grep -i "localhost" server/index.ts && echo "FAIL: localhost found"
```

---

### ADR-011: Cryptographic Randomness

**Status:** Accepted

**Context:**
Security-sensitive random values must use cryptographically secure randomness.

**Decision:**
Use **crypto.randomBytes()** for all security-sensitive values:
- Unique IDs (file upload names)
- Session tokens
- Password reset tokens
- CSRF tokens
- API keys

**Forbidden:** `Math.random()` for any security-sensitive values

**Alternatives Considered:**
1. **Math.random():** Rejected - predictable, not cryptographically secure
2. **UUID v4:** Acceptable alternative for IDs (uses crypto.randomUUID())
3. **nanoid:** Acceptable alternative (uses crypto)

**Implementation:**
```typescript
import crypto from 'crypto';

// Generate random token
function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate unique filename
function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const random = crypto.randomBytes(16).toString('hex');
  return `${random}${ext}`;
}

// Generate API key
function generateApiKey(): string {
  return crypto.randomBytes(32).toString('base64');
}
```

**Consequences:**
- **Positive:** Cryptographically secure randomness prevents attacks
- **Negative:** None - same performance as Math.random()
- **Risks:** Developer forgets and uses Math.random() - mitigated by code review

**Verification:**
```bash
# Verify crypto.randomBytes used for security
grep "crypto.randomBytes" server/utils/*.ts server/services/*.ts
grep "Math.random()" server/**/*.ts && echo "FAIL: Math.random() found"
```

---

### ADR-012: File Upload Security

**Status:** Accepted

**Context:**
File uploads are attack vectors for DoS, malicious files, and server crashes.

**Decision:**
Implement **multi-layer file upload security**:

1. **Size Limits:**
   - CSV/Excel: 100MB max
   - Images: 10MB max
   - Documents: 25MB max

2. **MIME Type Validation:**
   - Whitelist: `text/csv`, `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `image/png`, `image/jpeg`
   - Reject all other types

3. **Stream Processing:**
   - Never load entire file into memory
   - Use stream-based parsers (papa parse, xlsx)
   - Process in chunks (10,000 rows at a time)

4. **Magic Number Validation (Recommended):**
   - Verify file signature matches MIME type
   - Prevents MIME type spoofing

**Alternatives Considered:**
1. **No size limits:** Rejected - DoS risk
2. **Allow all file types:** Rejected - malware risk
3. **Full file validation:** Deferred - performance cost

**Implementation:**
```typescript
// Multer configuration
const upload = multer({
  dest: '/tmp/uploads',
  limits: {
    fileSize: 100 * 1024 * 1024,  // 100MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/png',
      'image/jpeg'
    ];
    
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    
    cb(null, true);
  }
});

// Stream processing for CSV
async function parseCSV(filePath: string): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const rows: any[] = [];
    let rowCount = 0;
    
    fs.createReadStream(filePath)
      .pipe(papa.parse(papa.NODE_STREAM_INPUT, { header: true }))
      .on('data', (row) => {
        rows.push(row);
        rowCount++;
        
        if (rowCount > 100000) {
          reject(new Error('File exceeds 100,000 row limit'));
        }
      })
      .on('end', () => resolve({ rows, rowCount }))
      .on('error', reject);
  });
}

// Client-side validation
function validateFile(file: File): string | null {
  const maxSizes = {
    'text/csv': 100 * 1024 * 1024,
    'application/vnd.ms-excel': 100 * 1024 * 1024,
    'image/png': 10 * 1024 * 1024,
    'image/jpeg': 10 * 1024 * 1024
  };
  
  const maxSize = maxSizes[file.type];
  if (!maxSize) {
    return 'Invalid file type';
  }
  
  if (file.size > maxSize) {
    return `File too large. Max: ${maxSize / 1024 / 1024}MB`;
  }
  
  return null;
}
```

**Consequences:**
- **Positive:** Prevents DoS, malware, server crashes
- **Negative:** Larger files rejected (acceptable for MVP)
- **Risks:** User frustration with limits - mitigated by clear error messages

**Verification:**
```bash
# Verify security measures
grep "fileFilter" server/middleware/upload.ts
grep "createReadStream" server/services/fileParser.ts
grep "rowCount > 100000" server/services/fileParser.ts
```

---

### ADR-013: Redis Port Configuration

**Status:** Deferred (Phase 2)

**Context:**
If Redis is added in Phase 2, Replit's port 6379 is reserved for internal services.

**Decision (When Implemented):**
Use **port 6380 for Redis**:
- Avoids conflict with Replit's internal Redis on 6379
- Configure redis connection: `redis://localhost:6380`
- Update connection strings in environment variables

**Alternatives Considered:**
1. **Use port 6379:** Rejected - conflicts with Replit internal Redis
2. **Use non-standard high port (7000+):** Acceptable alternative

**Implementation (Future):**
```typescript
// redis.config.ts (when implemented)
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6380'),
  password: process.env.REDIS_PASSWORD
});
```

**Consequences:**
- **Positive:** Avoids Replit port conflicts
- **Negative:** None - standard practice
- **Risks:** None - documented in Replit docs

**Verification (When Implemented):**
```bash
# Verify Redis uses 6380
grep "6380" server/config/redis.ts
grep -v "6379" server/config/redis.ts
```

---

## PHASE 8: MACHINE-READABLE ARCHITECTURAL DECISIONS

**File: `/docs/architectural-decisions.json`**

This JSON file contains machine-readable architectural decisions for Agent 6 validation.

```json
{
  "version": "1.0",
  "generatedBy": "Agent 2",
  "generatedAt": "2026-01-28T10:30:00Z",
  "decisions": {
    "authentication": {
      "selectedOption": "JWT with 7-day expiration, no refresh tokens",
      "alternatives": [
        "Session-based auth with Redis",
        "OAuth 2.0 only",
        "JWT with refresh tokens"
      ],
      "rationale": "Stateless authentication scales horizontally without session storage. 7-day expiration balances security and UX for MVP. Refresh tokens deferred to Phase 2.",
      "adrId": "ADR-002",
      "implementation": {
        "library": "jsonwebtoken",
        "algorithm": "HS256",
        "expiry": "7d",
        "secretEnvVar": "JWT_SECRET",
        "tokenStorage": "localStorage",
        "headerFormat": "Bearer <token>"
      }
    },
    "multiTenant": {
      "selectedOption": "Query-level filtering with organizationId foreign key",
      "alternatives": [
        "Separate databases per tenant",
        "Row-Level Security (RLS) in PostgreSQL",
        "Schema-based isolation"
      ],
      "rationale": "Query-level filtering is simple, standard pattern with minimal overhead. Separate databases violate Replit constraints. RLS adds ORM complexity.",
      "adrId": "ADR-003",
      "implementation": {
        "enforcementStrategy": "middleware",
        "middlewareName": "requireOrganization",
        "filterColumn": "organization_id",
        "queryHelperPattern": "where: eq(table.organizationId, req.user.organizationId)"
      }
    },
    "softDelete": {
      "selectedOption": "Global soft delete with deleted_at column and 30-day retention",
      "alternatives": [
        "Hard delete only",
        "Per-entity soft delete",
        "Audit log instead of soft delete"
      ],
      "rationale": "Global soft delete provides undo capability and audit trail. 30-day retention balances storage and recovery window.",
      "adrId": "ADR-005",
      "implementation": {
        "column": "deleted_at",
        "type": "TIMESTAMP",
        "defaultValue": "NULL",
        "retentionDays": 30,
        "cleanupSchedule": "0 2 * * *",
        "queryHelperName": "findActive",
        "filterPattern": "isNull(table.deletedAt)"
      }
    },
    "fileUpload": {
      "selectedOption": "Local filesystem with stream processing",
      "alternatives": [
        "S3/Cloudflare R2 storage",
        "Base64 in database",
        "External upload service (Uploadcare)"
      ],
      "rationale": "Local filesystem simplest for MVP. Stream processing prevents memory issues. Ephemeral FS acceptable for cache (files reparsable).",
      "adrId": "ADR-006",
      "implementation": {
        "library": "multer",
        "storageLocation": "/tmp/uploads",
        "limits": {
          "maxFileSize": "100MB",
          "maxFiles": 10,
          "csvMaxSize": "100MB",
          "excelMaxSize": "100MB",
          "imageMaxSize": "10MB"
        },
        "allowedMimeTypes": [
          "text/csv",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "image/png",
          "image/jpeg"
        ],
        "processingMode": "stream",
        "retentionDays": 30,
        "cleanupSchedule": "0 3 * * *"
      }
    },
    "errorHandling": {
      "selectedOption": "Structured error codes with standard HTTP mapping",
      "alternatives": [
        "Generic messages only",
        "Exception-based errors",
        "Error classes hierarchy"
      ],
      "rationale": "Structured codes enable client-side error handling and logging. HTTP mapping provides standard semantics.",
      "adrId": "ADR-007",
      "implementation": {
        "codeFormat": "CATEGORY-NNN",
        "categories": ["AUTH", "VAL", "DB", "API", "SYS", "FILE"],
        "httpMapping": {
          "AUTH-001": 401,
          "AUTH-002": 401,
          "AUTH-003": 401,
          "AUTH-004": 403,
          "VAL-001": 400,
          "DB-001": 500,
          "DB-002": 409,
          "DB-003": 404,
          "API-001": 502,
          "SYS-001": 500,
          "FILE-001": 400
        },
        "responseHelper": "sendError",
        "globalHandler": "app.use((err, req, res, next) => {...})"
      }
    },
    "logging": {
      "selectedOption": "Winston with JSON structured logging to console",
      "alternatives": [
        "console.log only",
        "Pino logger",
        "External service (Datadog)"
      ],
      "rationale": "Winston provides structured JSON logs with levels and transports. JSON format enables parsing for debugging.",
      "adrId": "ADR-008",
      "implementation": {
        "library": "winston",
        "format": "json",
        "levels": ["error", "warn", "info", "debug"],
        "transport": "console (stdout)",
        "contextFields": ["userId", "organizationId", "requestId", "timestamp"],
        "sensitiveFieldsExcluded": ["password", "token", "apiKey"]
      }
    }
  }
}
```

---

## PHASE 9: COMPONENT ARCHITECTURE

### Backend Components

#### 1. Server Entry Point
- **File:** `server/index.ts`
- **Responsibilities:** Express app initialization, middleware registration, route mounting, graceful shutdown
- **Key Functions:**
  - Initialize Express app
  - Register global middleware (helmet, cors, morgan, rate limit)
  - Mount routes (`/api/auth`, `/api/organizations`, etc.)
  - Start server on correct binding address
  - Handle graceful shutdown (SIGTERM, SIGINT)

#### 2. Routes Layer
- **Files:** `server/routes/*.routes.ts`
- **Responsibilities:** Endpoint definitions, parameter extraction, call controllers
- **Pattern:**
  ```typescript
  router.post('/projects', requireAuth, validateBody(createProjectSchema), projectController.create);
  router.get('/projects/:id', requireAuth, parseIntParam('id'), projectController.getOne);
  ```

#### 3. Controllers Layer
- **Files:** `server/controllers/*.controller.ts`
- **Responsibilities:** Request/response handling, call services, use response helpers
- **Pattern:**
  ```typescript
  async function create(req, res) {
    const project = await projectService.create(req.user.organizationId, req.body);
    return sendCreated(res, project);
  }
  ```

#### 4. Services Layer
- **Files:** `server/services/*.service.ts`
- **Responsibilities:** Business logic, orchestration, transaction management
- **Pattern:**
  ```typescript
  async function create(organizationId: number, data: CreateProjectDto) {
    const project = await db.insert(projects).values({ organizationId, ...data }).returning();
    logger.info('Project created', { projectId: project.id, organizationId });
    return project;
  }
  ```

#### 5. Repositories Layer
- **Files:** `server/repositories/*.repository.ts`
- **Responsibilities:** Database query encapsulation (optional - can use Drizzle directly in services)

#### 6. Middleware Layer
- **Files:** `server/middleware/*.ts`
- **Responsibilities:** Request preprocessing, authentication, validation, error handling
- **Key Middleware:**
  - `requireAuth`: JWT verification
  - `requireOrganization`: Tenant context enforcement
  - `validateBody(schema)`: Zod validation
  - `parseIntParam(name)`: Parameter parsing with validation
  - `errorHandler`: Global error handler

#### 7. Utilities Layer
- **Files:** `server/utils/*.ts`
- **Key Utilities:**
  - `response.ts`: Response helpers (sendSuccess, sendError, etc.)
  - `encryption.ts`: AES-256-GCM encryption/decryption
  - `logger.ts`: Winston logger configuration
  - `validators.ts`: Common validation schemas

### Frontend Components

#### 1. Application Entry
- **File:** `client/src/main.tsx`
- **Responsibilities:** React app initialization, router setup, global providers

#### 2. Pages Layer
- **Files:** `client/src/pages/*.tsx`
- **Responsibilities:** Full page components, route rendering
- **Pattern:** One page per route (18 pages total per PRD)

#### 3. Components Layer
- **Files:** `client/src/components/*.tsx`
- **Responsibilities:** Reusable UI components
- **Categories:**
  - **Layout:** Header, Sidebar, Footer, PageContainer
  - **Forms:** Input, Select, Checkbox, FileUpload
  - **Data Display:** Table, Card, Badge, DataGrid
  - **Feedback:** Alert, Toast, Modal, LoadingSpinner
  - **Navigation:** Breadcrumbs, Tabs, Pagination

#### 4. API Client Layer
- **Files:** `client/src/api/*.ts`
- **Responsibilities:** Backend API calls, TanStack Query hooks
- **Pattern:**
  ```typescript
  export function useProjects() {
    return useQuery({
      queryKey: ['projects'],
      queryFn: () => api.get('/api/projects').then(res => res.data.data)
    });
  }
  ```

#### 5. State Management Layer
- **Files:** `client/src/store/*.ts`
- **Responsibilities:** Global client state (auth token, user profile)
- **Tools:** TanStack Query (server state), React Context (client state)

---

## PHASE 10: DEPLOYMENT ARCHITECTURE

### Development Environment

```
┌───────────────────────────────────────────────────────────┐
│                   Developer Machine                        │
│                                                            │
│  ┌─────────────────┐           ┌────────────────────┐    │
│  │  Vite Dev Server│           │  Express Backend   │    │
│  │  0.0.0.0:5000   │──proxy──→ │  127.0.0.1:3001    │    │
│  │  (React HMR)    │           │  (API endpoints)   │    │
│  └─────────────────┘           └────────────────────┘    │
│           │                              │                │
│           └──────────┬──────────────────┘                │
│                      ↓                                    │
│           ┌────────────────────┐                         │
│           │  PostgreSQL Local  │                         │
│           │  (Docker or Neon)  │                         │
│           └────────────────────┘                         │
└───────────────────────────────────────────────────────────┘
```

**Development Commands:**
```bash
# Install dependencies
npm install

# Start backend dev server
cd server && npm run dev  # nodemon on port 3001

# Start frontend dev server (separate terminal)
cd client && npm run dev  # Vite HMR on port 5000

# Database migrations
npm run db:migrate
npm run db:seed
```

### Production Environment (Replit)

```
┌──────────────────────────────────────────────────────────────┐
│                      Replit Container                         │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Express App (0.0.0.0:5000)                   │   │
│  │                                                      │   │
│  │  ┌────────────────┐    ┌───────────────────────┐   │   │
│  │  │ Static Files   │    │   API Routes          │   │   │
│  │  │ (React build)  │    │   /api/*              │   │   │
│  │  │ /*             │    │                       │   │   │
│  │  └────────────────┘    └───────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ↓                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │    PostgreSQL (Neon) - External Managed Service    │    │
│  │    Connection via DATABASE_URL environment var     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                              ↑
                              │
                              │
                ┌─────────────┴──────────────┐
                │   Replit Reverse Proxy     │
                │   (public URL)             │
                └────────────────────────────┘
```

**Production Build:**
```bash
# Build frontend
cd client && npm run build  # Output: client/dist

# Start production server
npm run start  # Serves static + API on port 5000
```

### Environment Variables

**Development (.env):**
```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/foundry_dev
JWT_SECRET=dev_secret_min_32_chars_long_12345
ENCRYPTION_KEY=base64_encoded_32_byte_key_here==
LOG_LEVEL=debug
```

**Production (Replit Secrets):**
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://neon_user:pass@neon_host/foundry_prod
JWT_SECRET=production_secret_min_32_chars_long_random
ENCRYPTION_KEY=base64_encoded_32_byte_key_production==
LOG_LEVEL=info
```

---

## PHASE 11: DATA FLOW DIAGRAMS

### Authentication Flow

```
┌──────┐                ┌──────────┐                ┌──────────┐
│Client│                │  Express │                │PostgreSQL│
└───┬──┘                └────┬─────┘                └────┬─────┘
    │                        │                           │
    │ POST /api/auth/login   │                           │
    │ { email, password }    │                           │
    ├───────────────────────→│                           │
    │                        │                           │
    │                        │ SELECT * FROM users       │
    │                        │ WHERE email = ?           │
    │                        ├──────────────────────────→│
    │                        │                           │
    │                        │←──────────────────────────┤
    │                        │ User record               │
    │                        │                           │
    │                        │ bcrypt.compare(password)  │
    │                        │ ─┐                        │
    │                        │  │                        │
    │                        │ ←┘                        │
    │                        │                           │
    │                        │ jwt.sign({ userId, ... }) │
    │                        │ ─┐                        │
    │                        │  │                        │
    │                        │ ←┘                        │
    │                        │                           │
    │ { token, user }        │                           │
    │←───────────────────────┤                           │
    │                        │                           │
    │ Store token in         │                           │
    │ localStorage           │                           │
    │ ─┐                     │                           │
    │  │                     │                           │
    │ ←┘                     │                           │
```

### File Upload to Dataset Flow

```
┌──────┐       ┌────────┐       ┌─────────┐       ┌────────────┐
│Client│       │ Express│       │  Parser │       │ Processor  │
└───┬──┘       └────┬───┘       └────┬────┘       └─────┬──────┘
    │               │                │                   │
    │ POST /api/    │                │                   │
    │ projects/:id/ │                │                   │
    │ sources       │                │                   │
    │ (multipart)   │                │                   │
    ├──────────────→│                │                   │
    │               │                │                   │
    │               │ multer.single  │                   │
    │               │ writes to      │                   │
    │               │ /tmp/uploads   │                   │
    │               │ ─┐             │                   │
    │               │  │             │                   │
    │               │ ←┘             │                   │
    │               │                │                   │
    │               │ parseFile()    │                   │
    │               ├───────────────→│                   │
    │               │                │                   │
    │               │                │ papa.parse()      │
    │               │                │ (stream)          │
    │               │                │ ─┐                │
    │               │                │  │                │
    │               │                │ ←┘                │
    │               │                │                   │
    │               │ { columns,     │                   │
    │               │   rows,        │                   │
    │               │   rowCount }   │                   │
    │               │←───────────────┤                   │
    │               │                │                   │
    │               │ CREATE Source  │                   │
    │               │ record in DB   │                   │
    │               │ (status:       │                   │
    │               │  pending_      │                   │
    │               │  config)       │                   │
    │               │                │                   │
    │ { source }    │                │                   │
    │←──────────────┤                │                   │
    │               │                │                   │
    │               │                │                   │
    │ [User maps    │                │                   │
    │  schema in UI]│                │                   │
    │               │                │                   │
    │ PUT /api/     │                │                   │
    │ sources/:id/  │                │                   │
    │ schema-mapping│                │                   │
    ├──────────────→│                │                   │
    │               │                │                   │
    │               │ UPDATE Source  │                   │
    │               │ status =       │                   │
    │               │ configured     │                   │
    │               │                │                   │
    │ { source }    │                │                   │
    │←──────────────┤                │                   │
    │               │                │                   │
    │               │                │                   │
    │ POST /api/    │                │                   │
    │ projects/:id/ │                │                   │
    │ runs          │                │                   │
    ├──────────────→│                │                   │
    │               │                │                   │
    │               │ CREATE Run     │                   │
    │               │ (status:       │                   │
    │               │  running)      │                   │
    │               │                │                   │
    │               │ processRun()   │                   │
    │               ├────────────────┼──────────────────→│
    │               │                │                   │
    │               │                │                   │ Load records
    │               │                │                   │ Apply mapping
    │               │                │                   │ Detect PII
    │               │                │                   │ De-identify
    │               │                │                   │ Transform
    │               │                │                   │ ─┐
    │               │                │                   │  │
    │               │                │                   │ ←┘
    │               │                │                   │
    │               │                │ CREATE Dataset    │
    │               │                │                   │
    │               │                │ UPDATE Run        │
    │               │                │ (status:          │
    │               │                │  completed)       │
    │               │                │                   │
    │               │←───────────────────────────────────┤
    │               │                │                   │
    │ { run }       │                │                   │
    │←──────────────┤                │                   │
```

---

## PHASE 12: ARCHITECTURE VERIFICATION CHECKLIST

**For Claude Code to verify architectural compliance:**

### Database Driver Check
```bash
# Verify pg driver is used (NOT @neondatabase/serverless)
grep '"pg"' server/package.json && echo "[OK] pg driver present"
grep '@neondatabase/serverless' server/package.json && echo "[FAIL] Wrong driver" || echo "[OK] No wrong driver"
```

### Response Envelope Check
```bash
# Verify no direct res.json() calls (all use helpers)
grep -r "res\.json" server/routes/*.ts server/controllers/*.ts && echo "[FAIL] Direct res.json found" || echo "[OK] All use helpers"
grep -r "sendSuccess\|sendCreated\|sendPaginated\|sendError" server/routes/*.ts | wc -l
```

### Security Middleware Check
```bash
# Verify security middleware present
grep "helmet" server/index.ts && echo "[OK] helmet configured"
grep "cors" server/index.ts && echo "[OK] cors configured"
grep "express-rate-limit" server/index.ts && echo "[OK] rate limit configured"
```

### Authentication Middleware Check
```bash
# Verify requireAuth middleware exists
ls server/middleware/auth.ts && echo "[OK] auth middleware exists"
grep "requireAuth" server/middleware/auth.ts && echo "[OK] requireAuth implemented"
```

### File Structure Check
```bash
# Verify key files exist
ls server/utils/response.ts && echo "[OK] response helpers exist"
ls server/utils/encryption.ts && echo "[OK] encryption util exists"
ls server/utils/logger.ts && echo "[OK] logger configured"
```

### Network Binding Check
```bash
# Verify correct binding addresses
grep "127.0.0.1" server/index.ts && echo "[OK] Backend binds to 127.0.0.1 in dev"
grep "0.0.0.0" server/index.ts && echo "[OK] Backend binds to 0.0.0.0 in prod"
grep -i "localhost" server/index.ts && echo "[FAIL] Forbidden localhost binding" || echo "[OK] No localhost binding"
```

### Cryptographic Randomness Check
```bash
# Verify crypto.randomBytes used for security-sensitive values
grep "crypto.randomBytes" server/services/*.ts server/utils/*.ts && echo "[OK] Crypto randomness used"
grep "Math.random()" server/services/*.ts server/utils/*.ts && echo "[FAIL] Math.random() found" || echo "[OK] No Math.random()"
```

---

## PHASE 13: ADR COMPLIANCE VERIFICATION

| ADR ID | Decision | Verification Command | Expected Result |
|--------|----------|---------------------|-----------------|
| ADR-001 | Technology Stack | `grep '"typescript"' package.json && grep '"express"' package.json && grep '"react"' client/package.json` | All 3 packages present |
| ADR-002 | JWT Authentication | `grep 'jsonwebtoken' server/package.json && grep 'requireAuth' server/middleware/auth.ts` | JWT library + middleware |
| ADR-003 | Multi-Tenant Isolation | `grep -r 'organizationId' server/services/*.ts \| wc -l` | 20+ usages |
| ADR-004 | Drizzle ORM | `grep 'drizzle-orm' server/package.json && ls server/db/schema.ts` | Drizzle + schema exists |
| ADR-005 | Soft Delete | `grep 'deletedAt' server/db/schema.ts \| wc -l` | 5+ columns |
| ADR-006 | File Upload | `grep 'multer' server/package.json && grep 'upload.single' server/routes/*.ts` | Multer + upload route |
| ADR-007 | Error Handling | `grep 'sendError' server/utils/response.ts && grep 'ERROR_CODES' server/utils/response.ts` | Error helpers + codes |
| ADR-008 | Logging | `grep 'winston' server/package.json && grep 'logger.info' server/index.ts` | Winston + usage |
| ADR-009 | pg Driver | `grep '"pg"' server/package.json && ! grep '@neondatabase/serverless' server/package.json` | pg present, neon absent |
| ADR-010 | Network Binding | `grep '127.0.0.1' server/index.ts && ! grep 'localhost' server/index.ts` | Correct binding, no localhost |
| ADR-011 | Crypto Randomness | `grep 'crypto.randomBytes' server/utils/*.ts && ! grep 'Math.random()' server/services/*.ts` | Crypto used, Math.random absent |
| ADR-012 | File Upload Security | `grep 'fileFilter' server/middleware/upload.ts && grep 'createReadStream' server/services/fileParser.ts` | MIME validation + streaming |

---

## ASSUMPTION REGISTER

### AR-001: Background Job Implementation
- **Owner Agent:** Agent 2
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 6 (Implementation), Agent 7 (QA)]
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** PRD specifies "asynchronous batch processing" but doesn't detail job queue mechanism
- **Assumption Made:** Use node-cron for scheduled cleanup jobs. For processing jobs, use synchronous execution with HTTP 202 Accepted response pattern. Background job queue (Bull/BullMQ) deferred to Phase 2 if needed.
- **Impact if Wrong:** If processing takes >30 seconds, user will experience timeout. Need job queue (Bull with Redis) for long-running jobs and status polling endpoint.
- **Resolution Note:** [Added when resolved]

---

### AR-002: Email Service Provider
- **Owner Agent:** Agent 2
- **Type:** DEPENDENCY
- **Downstream Impact:** [Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_DEPLOYMENT
- **Allowed to Ship:** NO
- **Status:** UNRESOLVED
- **Source Gap:** PRD lists password reset as required but doesn't specify email service
- **Assumption Made:** Use SendGrid free tier (100 emails/day sufficient for MVP). Alternative: Mailgun or AWS SES. If no email service available, implement admin reset mechanism as fallback.
- **Impact if Wrong:** If SendGrid not approved, need alternative provider or different password reset flow. If no email service possible, password reset must be admin-only (acceptable for MVP).
- **Resolution Note:** [Added when resolved]

---

### AR-003: PII Detection Algorithm
- **Owner Agent:** Agent 2
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** PRD requires "PII detection" but doesn't specify detection algorithm or accuracy requirements
- **Assumption Made:** Use regex-based detection for MVP:
  - Email: RFC 5322 regex
  - Phone: E.164 international format
  - SSN: US format (XXX-XX-XXXX)
  - Credit card: Luhn algorithm validation
  - Names: Capitalize-cased words in specific columns
  - Accuracy target: >95% for structured fields
- **Impact if Wrong:** If higher accuracy needed (>98%), require ML-based detection (AWS Comprehend PII, Google DLP API). Would add latency and cost. If custom PII patterns needed, would need rule engine.
- **Resolution Note:** [Added when resolved]

---

### AR-004: Processing Performance Target
- **Owner Agent:** Agent 2
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 6 (Implementation), Agent 7 (QA)]
- **Resolution Deadline:** BEFORE_AGENT_7
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** PRD states "10,000 records/minute throughput" but doesn't specify processing pipeline stages
- **Assumption Made:** 10,000 records/minute = 167 records/second. Assumes:
  - File parsing: 500ms for 10,000 rows (stream-based)
  - PII detection: 50ms per 1,000 rows (regex)
  - De-identification: 100ms per 1,000 rows (substitution)
  - Total: ~60 seconds for 100,000 records (within 10-minute timeout)
- **Impact if Wrong:** If processing slower (complex transformations, ML-based PII detection), need parallel processing or job chunking. Would require background job queue and progress tracking.
- **Resolution Note:** [Added when resolved]

---

### AR-005: Teamwork API Rate Limits
- **Owner Agent:** Agent 2
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** YES (integration optional)
- **Status:** UNRESOLVED
- **Source Gap:** PRD lists Teamwork integration but doesn't specify rate limit handling
- **Assumption Made:** Teamwork API rate limit: 120 requests/minute. For 10,000 tickets:
  - Batch fetch 100 tickets/request = 100 requests
  - Time required: ~1 minute (within rate limit)
  - Implement exponential backoff if rate limited
  - Cache ticket data for 24 hours
- **Impact if Wrong:** If rate limit lower (60/min) or batch size smaller (10/request), would need longer import time or background job. If rate limit higher, can optimize for faster import.
- **Resolution Note:** [Added when resolved]

---

## DOWNSTREAM AGENT HANDOFF BRIEF

### Global Platform Context (All Agents)
Per Constitution Section C: Standard response/error envelopes, auth storage, API conventions apply.
Per Constitution Section D: Replit platform non-negotiables (pg driver, ports, deployment model).
Per Constitution Section F: Tech stack constraints apply.

### For Agent 3: Data Modeling
- **Database:** PostgreSQL via Replit Neon; `pg` driver (Constitution Section D)
- **ORM:** Drizzle ORM per ADR-004
- **Connection:** Connection pooling via pg.Pool per ADR-009
- **Multi-Tenant:** All tables (except organizations, users) have `organization_id` column per ADR-003
- **Soft Delete:** All deletable entities have `deleted_at` column per ADR-005
- **Encryption:** `integrations.credentials` column is TEXT storing hex-encoded encrypted JSON per ADR-008 (Sensitive Data Encryption)
- **Key Entities Implied:** Organizations, Users, Projects, Sources, ProcessingRuns, Datasets, Integrations
- **Reference ADRs:** ADR-003 (multi-tenant), ADR-004 (ORM), ADR-005 (soft delete), ADR-009 (driver)

### For Agent 4: API Contract
- **Framework:** Express.js per ADR-001
- **Response Envelopes:** All success responses use `{ data, meta }` envelope per Phase 6
- **Paginated Responses:** Include `pagination` object with 5 fields per Phase 6
- **Error Responses:** Use `{ error }` envelope with canonical codes per ADR-007
- **Auth:** JWT Bearer tokens per Constitution Section C and ADR-002
- **Multi-Tenant:** All endpoints filter by `req.user.organizationId` per ADR-003
- **Reference ADRs:** ADR-002 (auth), ADR-003 (multi-tenant), ADR-007 (errors)

### For Agent 5: UI/UX Specification
- **Framework:** React 18 + Vite 5 per Constitution Section F and ADR-001
- **Components:** shadcn/ui + Radix UI per ADR-001
- **Styling:** Tailwind CSS per Constitution Section F and ADR-001
- **Data Fetching:** TanStack Query v5 per ADR-001
- **Forms:** React Hook Form + Zod per ADR-001
- **State Management:** TanStack Query for server state, React Context for client state
- **Reference ADRs:** ADR-001 (stack)

### For Agent 6: Implementation Orchestrator
- **Security Middleware:** helmet, cors, express-rate-limit, winston per ADR-008
- **Auth Middleware:** requireAuth, requireOrganization per ADR-002, ADR-003
- **Validation:** Zod schemas per ADR-001
- **File Upload:** multer configuration per ADR-006, ADR-012
- **Response Helpers:** `/server/utils/response.ts` with sendSuccess, sendCreated, sendPaginated, sendNoContent, sendError per Phase 6
- **Encryption Utility:** `/server/utils/encryption.ts` per Phase 5 (Sensitive Data Encryption)
- **Logger Utility:** `/server/utils/logger.ts` per ADR-008
- **Network Binding:** 127.0.0.1 (dev), 0.0.0.0 (prod) per ADR-010
- **Cryptographic Randomness:** crypto.randomBytes() per ADR-011
- **Route Registration:** Specific before parameterized
- **Reference ADRs:** ADR-001 (stack), ADR-002 (auth), ADR-003 (multi-tenant), ADR-005 (soft delete), ADR-006 (file upload), ADR-007 (errors), ADR-008 (logging), ADR-009 (driver), ADR-010 (binding), ADR-011 (crypto), ADR-012 (security)

### For Agent 7: QA & Deployment
- **Health Endpoint Format:** Constitution Section C
- **Verification Checklist:** Phase 12 (Architecture Verification Checklist)
- **ADR Compliance:** Phase 13 (ADR Compliance Verification)
- **Environment Variables:** Development vs Production per Phase 10
- **Build Process:** Frontend build to `client/dist`, served by Express in production
- **Deployment Target:** Replit single container, port 5000
- **Reference ADRs:** All ADRs (ADR-001 through ADR-012)

### For Agent 8: Code Review
- **Verify Implementation Matches ADR Decisions:** Use Phase 13 verification table
- **Flag Deviations:** Any code not matching ADR patterns
- **Security Review:** Verify encryption, crypto randomness, binding addresses, file upload security
- **Performance Review:** Verify stream processing, connection pooling
- **Reference ADRs:** All ADRs (ADR-001 through ADR-012)

---

## DOCUMENT STATUS

**Status:** COMPLETE

**Verification:**
- ✅ All 12 phases completed
- ✅ 13 Architecture Decision Records (ADRs) with unique IDs
- ✅ Machine-readable architectural decisions JSON generated
- ✅ Response envelope specification included
- ✅ Sensitive data encryption specification included
- ✅ Network binding addresses specified
- ✅ Cryptographic randomness requirements documented
- ✅ File upload security requirements specified
- ✅ Assumption Register with 5 assumptions
- ✅ Downstream handoff brief included
- ✅ Verification checklist provided
- ✅ ADR compliance verification table provided

**Output Files:**
1. `/docs/02-ARCHITECTURE.md` (this document)
2. `/docs/architectural-decisions.json` (machine-readable decisions)

**Next Agent:** Agent 3 (Data Modeling) will read this architecture to design database schema and queries.

---

**Document End**

**Agent 2 (System Architecture) v25 Complete**

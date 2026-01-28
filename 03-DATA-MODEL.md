# Data Model: Foundry

## Document Metadata
- **Version:** 1.0
- **Date:** 2026-01-28
- **Author:** Agent 3 (Data Modeling)
- **Status:** Complete
- **Upstream:** 01-PRD.md (Agent 1), 02-ARCHITECTURE.md (Agent 2)
- **Downstream:** Agent 4 (API Contract), Agent 5 (UI/UX), Agent 6 (Implementation)
- **Constitution:** Inherited from Agent 0

---

## DATABASE TABLE SUMMARY

**Total Tables:** 8 (Required: 8, Phase 2: 0)

| Table | Columns | Type | Status | Purpose |
|-------|---------|------|--------|---------|
| organizations | 5 | Core | Required | Multi-tenant organization container |
| users | 9 | Core | Required | User accounts with auth |
| password_reset_tokens | 6 | Auth | Required | Password reset flow |
| projects | 7 | Core | Required | Data preparation projects |
| sources | 11 | Core | Required | Data source files/integrations |
| processing_runs | 10 | Core | Required | Async processing jobs |
| datasets | 10 | Core | Required | Processed output datasets |
| integrations | 9 | Core | Required | External API connections (Teamwork) |

**Verification Commands:**
```bash
# After schema implementation, verify table count
ls server/db/schema/*.ts | wc -l  # Expected: 8 files or 1 file with 8 tables

# Count exported tables in schema file(s)
grep "export const.*= pgTable" server/db/schema/*.ts | wc -l  # Expected: 8

# Verify all tables have audit columns
grep -A 2 "pgTable" server/db/schema/*.ts | grep "createdAt\|updatedAt" | wc -l  # Expected: 16 (2 per table)
```

---

## SCHEMA VERIFICATION COMMANDS

After implementing the schema, run these commands to verify completeness:

```bash
# 1. Verify table count (8 tables)
psql $DATABASE_URL -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
# Expected: 8

# 2. Verify foreign key count (10 foreign keys total)
psql $DATABASE_URL -c "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY';"
# Expected: 10 (users→organizations, password_reset_tokens→users, projects→organizations, projects→users, sources→organizations, sources→projects, processing_runs→projects, processing_runs→sources, datasets→projects, integrations→organizations)

# 3. Verify indexes (minimum 10 indexes: 8 primary keys + 10 foreign key indexes + 5 unique constraints + 2 composite indexes)
psql $DATABASE_URL -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';"
# Expected: ≥25 (PKs + FK indexes + unique indexes + composite indexes)

# 4. Verify soft delete columns (6 tables with deletedAt)
psql $DATABASE_URL -c "SELECT COUNT(*) FROM information_schema.columns WHERE column_name = 'deleted_at' AND table_schema = 'public';"
# Expected: 6 (projects, sources, processing_runs, datasets, integrations, users)

# 5. Verify audit columns (all 8 tables)
psql $DATABASE_URL -c "SELECT COUNT(*) FROM information_schema.columns WHERE column_name IN ('created_at', 'updated_at') AND table_schema = 'public';"
# Expected: 16 (2 columns × 8 tables)

# 6. Verify organizationId columns (7 tables, excluding organizations and password_reset_tokens)
psql $DATABASE_URL -c "SELECT COUNT(*) FROM information_schema.columns WHERE column_name = 'organization_id' AND table_schema = 'public';"
# Expected: 6 (users, projects, sources, processing_runs, datasets, integrations)
```

---

## PHASE 1: ENTITY RELATIONSHIPS

### Entity Relationship Diagram

```
┌──────────────────┐
│  organizations   │
│  ──────────────  │
│  id (PK)         │
│  name            │
│  slug            │
└──────────────────┘
         │
         │ 1:N
         ├─────────────────────────────────────────────┐
         │                                             │
         ▼                                             ▼
┌──────────────────┐                         ┌──────────────────┐
│      users       │                         │   integrations   │
│  ──────────────  │                         │  ──────────────  │
│  id (PK)         │                         │  id (PK)         │
│  organizationId  │◄─┐                      │  organizationId  │
│  email (unique)  │  │                      │  type            │
│  passwordHash    │  │                      │  credentials     │
│  name            │  │                      │  (encrypted)     │
│  role            │  │                      └──────────────────┘
└──────────────────┘  │
         │            │
         │ 1:N        │
         │            │
         ▼            │
┌──────────────────┐  │
│     projects     │  │
│  ──────────────  │  │
│  id (PK)         │  │
│  organizationId  │  │
│  ownerId (FK)────┘  │
│  name            │  
│  description     │  
│  deletedAt       │  
└──────────────────┘  
         │
         │ 1:N
         ├────────────────────────────┐
         ▼                            ▼
┌──────────────────┐        ┌──────────────────┐
│     sources      │        │     datasets     │
│  ──────────────  │        │  ──────────────  │
│  id (PK)         │        │  id (PK)         │
│  organizationId  │        │  organizationId  │
│  projectId (FK)  │        │  projectId (FK)  │
│  type            │        │  name            │
│  filename        │        │  format          │
│  filepath        │        │  rowCount        │
│  size            │        │  fileUrl         │
│  status          │        │  deletedAt       │
│  deletedAt       │        └──────────────────┘
└──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│ processing_runs  │
│  ──────────────  │
│  id (PK)         │
│  projectId (FK)  │
│  sourceId (FK)   │
│  status          │
│  config          │
│  stats           │
│  error           │
│  deletedAt       │
└──────────────────┘

┌──────────────────────┐
│ password_reset_      │
│      tokens          │
│  ──────────────────  │
│  id (PK)             │
│  userId (FK)         │
│  tokenHash           │
│  expiresAt           │
└──────────────────────┘
```

### Relationship Rules

| Parent | Child | Cardinality | Foreign Key | On Delete | Multi-Tenant Filter |
|--------|-------|-------------|-------------|-----------|---------------------|
| organizations | users | 1:N | users.organizationId → organizations.id | CASCADE | N/A (root entity) |
| organizations | projects | 1:N | projects.organizationId → organizations.id | CASCADE | Yes (all queries) |
| organizations | sources | 1:N | sources.organizationId → organizations.id | CASCADE | Yes (via project) |
| organizations | processing_runs | 1:N | processing_runs.organizationId → organizations.id | CASCADE | Yes (via project) |
| organizations | datasets | 1:N | datasets.organizationId → organizations.id | CASCADE | Yes (via project) |
| organizations | integrations | 1:N | integrations.organizationId → organizations.id | CASCADE | Yes (all queries) |
| users | projects | 1:N | projects.ownerId → users.id | RESTRICT | Via organizationId |
| users | password_reset_tokens | 1:N | password_reset_tokens.userId → users.id | CASCADE | N/A (auth flow) |
| projects | sources | 1:N | sources.projectId → projects.id | CASCADE | Via projectId |
| projects | processing_runs | 1:N | processing_runs.projectId → projects.id | CASCADE | Via projectId |
| projects | processing_runs | 1:N | processing_runs.sourceId → sources.id | CASCADE | Via sourceId |
| projects | datasets | 1:N | datasets.projectId → projects.id | CASCADE | Via projectId |

---

## PHASE 2: SOFT DELETE CASCADE RULES

**Reference:** GAP-DATA-001 (Agent 3 v22)

Per Agent 3 Constitution, ALL parent-child relationships using soft delete MUST specify explicit cascade behavior.

### Cascade Policy Table

| Parent Entity | Child Entities | Cascade Behavior | Implementation |
|---------------|----------------|------------------|----------------|
| organizations | users, projects, sources, processing_runs, datasets, integrations | CASCADE: Set deletedAt on all children | Soft delete in transaction |
| projects | sources, processing_runs, datasets | CASCADE: Set deletedAt on all children | Soft delete in transaction |
| sources | processing_runs | CASCADE: Set deletedAt on all children | Soft delete in transaction |
| users | projects (as owner) | NO CASCADE: Prevent delete if owns active projects | Check active projects before delete |

### Implementation Pattern

**Service Layer Pattern (TypeScript + Drizzle):**

```typescript
// organizations.service.ts
import { db } from '../db';
import { organizations, users, projects, sources, processingRuns, datasets, integrations } from '../db/schema';
import { eq, and, isNull } from 'drizzle-orm';

async function softDeleteOrganization(orgId: number): Promise<void> {
  const now = new Date();
  
  await db.transaction(async (tx) => {
    // Soft delete organization
    await tx.update(organizations)
      .set({ deletedAt: now })
      .where(eq(organizations.id, orgId));
    
    // CASCADE: Soft delete all users
    await tx.update(users)
      .set({ deletedAt: now })
      .where(eq(users.organizationId, orgId));
    
    // CASCADE: Soft delete all projects
    await tx.update(projects)
      .set({ deletedAt: now })
      .where(eq(projects.organizationId, orgId));
    
    // CASCADE: Soft delete all sources
    await tx.update(sources)
      .set({ deletedAt: now })
      .where(eq(sources.organizationId, orgId));
    
    // CASCADE: Soft delete all processing runs
    await tx.update(processingRuns)
      .set({ deletedAt: now })
      .where(eq(processingRuns.organizationId, orgId));
    
    // CASCADE: Soft delete all datasets
    await tx.update(datasets)
      .set({ deletedAt: now })
      .where(eq(datasets.organizationId, orgId));
    
    // CASCADE: Soft delete all integrations
    await tx.update(integrations)
      .set({ deletedAt: now })
      .where(eq(integrations.organizationId, orgId));
  });
}
```

```typescript
// projects.service.ts
async function softDeleteProject(projectId: number, orgId: number): Promise<void> {
  const now = new Date();
  
  await db.transaction(async (tx) => {
    // Soft delete project
    await tx.update(projects)
      .set({ deletedAt: now })
      .where(and(
        eq(projects.id, projectId),
        eq(projects.organizationId, orgId)
      ));
    
    // CASCADE: Soft delete all sources
    await tx.update(sources)
      .set({ deletedAt: now })
      .where(eq(sources.projectId, projectId));
    
    // CASCADE: Soft delete all processing runs
    await tx.update(processingRuns)
      .set({ deletedAt: now })
      .where(eq(processingRuns.projectId, projectId));
    
    // CASCADE: Soft delete all datasets
    await tx.update(datasets)
      .set({ deletedAt: now })
      .where(eq(datasets.projectId, projectId));
  });
}
```

```typescript
// sources.service.ts
async function softDeleteSource(sourceId: number, orgId: number): Promise<void> {
  const now = new Date();
  
  await db.transaction(async (tx) => {
    // Soft delete source
    await tx.update(sources)
      .set({ deletedAt: now })
      .where(and(
        eq(sources.id, sourceId),
        eq(sources.organizationId, orgId)
      ));
    
    // CASCADE: Soft delete all processing runs
    await tx.update(processingRuns)
      .set({ deletedAt: now })
      .where(eq(processingRuns.sourceId, sourceId));
  });
}
```

```typescript
// users.service.ts
async function softDeleteUser(userId: number, orgId: number): Promise<void> {
  // NO CASCADE: Check if user owns any active projects
  const activeProjects = await db
    .select()
    .from(projects)
    .where(and(
      eq(projects.ownerId, userId),
      eq(projects.organizationId, orgId),
      isNull(projects.deletedAt)
    ));
  
  if (activeProjects.length > 0) {
    throw new Error('Cannot delete user who owns active projects. Transfer ownership first.');
  }
  
  const now = new Date();
  
  await db.update(users)
    .set({ deletedAt: now })
    .where(and(
      eq(users.id, userId),
      eq(users.organizationId, orgId)
    ));
}
```

### Query Pattern Requirements

**[CRITICAL] Multi-Level Filtering:** When querying child entities, MUST filter deletedAt at BOTH parent and child levels.

**Correct Query Pattern (Projects with Active Organization):**

```typescript
import { db } from '../db';
import { projects, organizations } from '../db/schema';
import { eq, and, isNull } from 'drizzle-orm';

// Fetch active projects (filters both project and organization)
const activeProjects = await db
  .select()
  .from(projects)
  .innerJoin(organizations, eq(projects.organizationId, organizations.id))
  .where(and(
    isNull(projects.deletedAt),
    isNull(organizations.deletedAt),
    eq(projects.organizationId, orgId)
  ));
```

**Correct Query Pattern (Sources with Active Project and Organization):**

```typescript
const activeSources = await db
  .select()
  .from(sources)
  .innerJoin(projects, eq(sources.projectId, projects.id))
  .innerJoin(organizations, eq(sources.organizationId, organizations.id))
  .where(and(
    isNull(sources.deletedAt),
    isNull(projects.deletedAt),
    isNull(organizations.deletedAt),
    eq(sources.projectId, projectId)
  ));
```

---

## PHASE 3: CORE DATA CONVENTIONS

### Global Conventions

Per Agent 0 Constitution and Agent 3 v22:

| Convention | Rule | Application |
|------------|------|-------------|
| **ORM** | Drizzle ORM with `pg` driver | Per ADR-004 and Constitution Section D |
| **Adapter** | `drizzle-orm/node-postgres` | Per Agent 3 Constitution |
| **Query API** | Core Select API only (`db.select().from()`) | Query API (`db.query.`) FORBIDDEN |
| **Audit Columns** | `createdAt`, `updatedAt` on all tables | Required per Agent 3 Constitution |
| **Soft Delete** | `deletedAt` timestamp (null = active) | Per ADR-005 (6 tables use soft delete) |
| **Type Exports** | All tables export inferred types | `type Entity = typeof table.$inferSelect` |
| **Multi-Tenant** | `organizationId` foreign key on 6 tables | Per ADR-003 (excludes organizations, password_reset_tokens) |
| **Snake Case** | Database columns use snake_case | PostgreSQL convention |
| **Camel Case** | TypeScript properties use camelCase | Drizzle auto-converts |

### Tables NOT Using Soft Delete

- **organizations:** Root tenant entity, hard delete cascades to all children
- **password_reset_tokens:** Temporary tokens, hard delete after expiry

---

## PHASE 4: SEED DATA REQUIREMENTS

**Reference:** Agent 3 v22 (Phase 4: Seed Data Requirements)

**[CRITICAL]** All applications with authentication (users table with passwordHash) MUST include seed data specification with default admin user.

### Default Admin User Specification

| Property | Value | Rationale |
|----------|-------|-----------|
| **Organization** | Default Organization (slug: `default`) | Root organization for admin user |
| **Email** | `admin@foundry.local` | Standard admin email for MVP |
| **Password** | `admin123` (MUST be changed after first login) | Simple default, requires reset |
| **Name** | Admin User | Descriptive name |
| **Role** | `admin` | Full permissions |

### Seed Script Template

**File:** `scripts/seed-admin.ts`

```typescript
import { db } from '../server/db';
import { organizations, users } from '../server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function seedAdminUser() {
  console.log('🌱 Seeding admin user...');
  
  try {
    // 1. Check if default organization exists
    const [existingOrg] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, 'default'))
      .limit(1);
    
    let orgId: number;
    
    if (existingOrg) {
      console.log('✅ Default organization exists (id:', existingOrg.id, ')');
      orgId = existingOrg.id;
    } else {
      // 2. Create default organization
      const [newOrg] = await db
        .insert(organizations)
        .values({
          name: 'Default Organization',
          slug: 'default',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      
      console.log('✅ Created default organization (id:', newOrg.id, ')');
      orgId = newOrg.id;
    }
    
    // 3. Check if admin user exists
    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.email, 'admin@foundry.local'))
      .limit(1);
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists (id:', existingAdmin.id, ')');
      console.log('📧 Email: admin@foundry.local');
      console.log('🔑 Password: admin123');
      return;
    }
    
    // 4. Hash password (bcrypt with 10 rounds)
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // 5. Create admin user
    const [adminUser] = await db
      .insert(users)
      .values({
        organizationId: orgId,
        email: 'admin@foundry.local',
        passwordHash: passwordHash,
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    console.log('✅ Created admin user (id:', adminUser.id, ')');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Admin User Created Successfully');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@foundry.local');
    console.log('🔑 Password: admin123');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  seedAdminUser()
    .then(() => {
      console.log('✅ Seed complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

export { seedAdminUser };
```

### Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "db:seed": "tsx scripts/seed-admin.ts",
    "db:seed:prod": "NODE_ENV=production tsx scripts/seed-admin.ts"
  }
}
```

### Verification Commands

```bash
# Verify seed script exists
ls -l scripts/seed-admin.ts

# Run seed script
npm run db:seed

# Verify admin user created
psql $DATABASE_URL -c "SELECT id, email, name, role FROM users WHERE email = 'admin@foundry.local';"

# Verify default organization created
psql $DATABASE_URL -c "SELECT id, name, slug FROM organizations WHERE slug = 'default';"
```

---

## PHASE 5: TABLE DEFINITIONS

### 1. organizations

**Purpose:** Multi-tenant organization container (root entity)

**ADR References:** ADR-003 (Multi-Tenant Design)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | Organization ID |
| name | TEXT | NOT NULL | - | Organization display name |
| slug | TEXT | NOT NULL, UNIQUE | - | URL-safe identifier (e.g., 'acme-corp') |
| createdAt | TIMESTAMP | NOT NULL | now() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | now() | Record update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE on `slug`

**Foreign Keys:** None (root entity)

**Soft Delete:** No (hard delete cascades to all children)

**Notes:**
- Slug generated from name on creation (lowercase, hyphenated)
- Example slugs: `acme-corp`, `default`, `example-org`

---

### 2. users

**Purpose:** User accounts with authentication credentials

**ADR References:** ADR-002 (JWT Authentication), ADR-003 (Multi-Tenant)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | User ID |
| organizationId | INTEGER | NOT NULL, FK → organizations.id | - | Organization membership |
| email | TEXT | NOT NULL, UNIQUE | - | Login email (unique globally) |
| passwordHash | TEXT | NOT NULL | - | bcrypt hashed password |
| name | TEXT | NULL | - | User display name |
| role | TEXT | NOT NULL | 'user' | User role (user, admin) |
| deletedAt | TIMESTAMP | NULL | null | Soft delete timestamp |
| createdAt | TIMESTAMP | NOT NULL | now() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | now() | Record update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE on `email`
- INDEX on `organizationId`
- INDEX on `deletedAt` (for active user queries)

**Foreign Keys:**
- `organizationId` → `organizations.id` ON DELETE CASCADE

**Soft Delete:** Yes

**Notes:**
- Email uniqueness enforced globally (across all organizations)
- Role validation: `user` or `admin` (enforced in application layer)
- Password hashed with bcrypt (10 rounds)

---

### 3. password_reset_tokens

**Purpose:** Temporary tokens for password reset flow

**ADR References:** ADR-002 (JWT Authentication)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | Token ID |
| userId | INTEGER | NOT NULL, FK → users.id | - | User requesting reset |
| tokenHash | TEXT | NOT NULL, UNIQUE | - | SHA-256 hash of reset token |
| expiresAt | TIMESTAMP | NOT NULL | - | Token expiration (1 hour from creation) |
| createdAt | TIMESTAMP | NOT NULL | now() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | now() | Record update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE on `tokenHash`
- INDEX on `userId`
- INDEX on `expiresAt` (for cleanup job)

**Foreign Keys:**
- `userId` → `users.id` ON DELETE CASCADE

**Soft Delete:** No (hard delete after use or expiry)

**Notes:**
- Token stored as SHA-256 hash (not encrypted)
- Token expires 1 hour after creation
- Cleanup job deletes expired tokens daily (scheduled via node-cron)

---

### 4. projects

**Purpose:** Data preparation projects (container for sources and datasets)

**ADR References:** ADR-003 (Multi-Tenant), ADR-005 (Soft Delete)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | Project ID |
| organizationId | INTEGER | NOT NULL, FK → organizations.id | - | Organization ownership |
| ownerId | INTEGER | NOT NULL, FK → users.id | - | User who created project |
| name | TEXT | NOT NULL | - | Project display name |
| description | TEXT | NULL | - | Project description |
| deletedAt | TIMESTAMP | NULL | null | Soft delete timestamp |
| createdAt | TIMESTAMP | NOT NULL | now() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | now() | Record update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `organizationId`
- INDEX on `ownerId`
- INDEX on `deletedAt` (for active project queries)
- COMPOSITE INDEX on `(organizationId, deletedAt)` (for filtered queries)

**Foreign Keys:**
- `organizationId` → `organizations.id` ON DELETE CASCADE
- `ownerId` → `users.id` ON DELETE RESTRICT

**Soft Delete:** Yes

**Cascade Rules:**
- When project soft deleted → cascade to sources, processing_runs, datasets

**Notes:**
- ownerId cannot be deleted if owns active projects (enforced in service layer)
- Name not globally unique (scoped to organization)

---

### 5. sources

**Purpose:** Data source files or integrations (CSV, Excel, API)

**ADR References:** ADR-003 (Multi-Tenant), ADR-005 (Soft Delete), ADR-006 (File Upload)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | Source ID |
| organizationId | INTEGER | NOT NULL, FK → organizations.id | - | Organization ownership |
| projectId | INTEGER | NOT NULL, FK → projects.id | - | Parent project |
| type | TEXT | NOT NULL | - | Source type (file, teamwork) |
| filename | TEXT | NOT NULL | - | Original filename |
| filepath | TEXT | NOT NULL | - | Local file path (/tmp/uploads/) |
| mimetype | TEXT | NOT NULL | - | File MIME type |
| size | INTEGER | NOT NULL | - | File size in bytes |
| status | TEXT | NOT NULL | 'pending' | Processing status (pending, ready, error) |
| deletedAt | TIMESTAMP | NULL | null | Soft delete timestamp |
| createdAt | TIMESTAMP | NOT NULL | now() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | now() | Record update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `organizationId`
- INDEX on `projectId`
- INDEX on `status`
- INDEX on `deletedAt`

**Foreign Keys:**
- `organizationId` → `organizations.id` ON DELETE CASCADE
- `projectId` → `projects.id` ON DELETE CASCADE

**Soft Delete:** Yes

**Cascade Rules:**
- When source soft deleted → cascade to processing_runs

**Notes:**
- Type validation: `file` or `teamwork` (enforced in application layer)
- Status validation: `pending`, `ready`, `error` (enforced in application layer)
- Filepath is ephemeral (Replit filesystem), can be regenerated from file
- MIME type validated on upload (CSV, Excel, images only)

---

### 6. processing_runs

**Purpose:** Async data processing jobs with status tracking

**ADR References:** ADR-003 (Multi-Tenant), ADR-005 (Soft Delete)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | Processing run ID |
| organizationId | INTEGER | NOT NULL, FK → organizations.id | - | Organization ownership |
| projectId | INTEGER | NOT NULL, FK → projects.id | - | Parent project |
| sourceId | INTEGER | NOT NULL, FK → sources.id | - | Source being processed |
| status | TEXT | NOT NULL | 'queued' | Job status (queued, processing, completed, failed) |
| config | JSONB | NOT NULL | {} | Processing configuration (PII fields, transformations) |
| stats | JSONB | NULL | null | Processing statistics (records, time, errors) |
| error | TEXT | NULL | null | Error message if failed |
| deletedAt | TIMESTAMP | NULL | null | Soft delete timestamp |
| createdAt | TIMESTAMP | NOT NULL | now() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | now() | Record update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `organizationId`
- INDEX on `projectId`
- INDEX on `sourceId`
- INDEX on `status`
- INDEX on `deletedAt`

**Foreign Keys:**
- `organizationId` → `organizations.id` ON DELETE CASCADE
- `projectId` → `projects.id` ON DELETE CASCADE
- `sourceId` → `sources.id` ON DELETE CASCADE

**Soft Delete:** Yes

**Notes:**
- Status validation: `queued`, `processing`, `completed`, `failed`
- Config JSONB stores PII detection rules, transformations
- Stats JSONB stores: `{ recordsProcessed, timeElapsed, errorCount }`
- Error field populated only if status = 'failed'

---

### 7. datasets

**Purpose:** Processed output datasets ready for download

**ADR References:** ADR-003 (Multi-Tenant), ADR-005 (Soft Delete)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | Dataset ID |
| organizationId | INTEGER | NOT NULL, FK → organizations.id | - | Organization ownership |
| projectId | INTEGER | NOT NULL, FK → projects.id | - | Parent project |
| name | TEXT | NOT NULL | - | Dataset display name |
| format | TEXT | NOT NULL | - | Output format (conversational_jsonl, qa_pairs, structured_json) |
| rowCount | INTEGER | NOT NULL | - | Number of records in dataset |
| fileUrl | TEXT | NOT NULL | - | Download URL (local file path) |
| metadata | JSONB | NULL | null | Dataset metadata (schema, transformations applied) |
| deletedAt | TIMESTAMP | NULL | null | Soft delete timestamp |
| createdAt | TIMESTAMP | NOT NULL | now() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | now() | Record update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `organizationId`
- INDEX on `projectId`
- INDEX on `format`
- INDEX on `deletedAt`

**Foreign Keys:**
- `organizationId` → `organizations.id` ON DELETE CASCADE
- `projectId` → `projects.id` ON DELETE CASCADE

**Soft Delete:** Yes

**Notes:**
- Format validation: `conversational_jsonl`, `qa_pairs`, `structured_json`
- fileUrl points to local file path (ephemeral, can be regenerated)
- metadata JSONB stores schema and transformations applied
- Name not globally unique (scoped to project)

---

### 8. integrations

**Purpose:** External API connections (Teamwork Desk, future integrations)

**ADR References:** ADR-003 (Multi-Tenant), ADR-005 (Soft Delete), ADR-008 (Sensitive Data Encryption)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | Integration ID |
| organizationId | INTEGER | NOT NULL, FK → organizations.id | - | Organization ownership |
| type | TEXT | NOT NULL | - | Integration type (teamwork) |
| name | TEXT | NOT NULL | - | Integration display name |
| credentials | TEXT | NOT NULL | - | Encrypted API credentials (AES-256-GCM) |
| status | TEXT | NOT NULL | 'active' | Integration status (active, error) |
| lastSyncAt | TIMESTAMP | NULL | null | Last successful sync timestamp |
| deletedAt | TIMESTAMP | NULL | null | Soft delete timestamp |
| createdAt | TIMESTAMP | NOT NULL | now() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | now() | Record update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `organizationId`
- INDEX on `type`
- INDEX on `status`
- INDEX on `deletedAt`

**Foreign Keys:**
- `organizationId` → `organizations.id` ON DELETE CASCADE

**Soft Delete:** Yes

**Notes:**
- Type validation: `teamwork` (enforced in application layer)
- Status validation: `active`, `error` (enforced in application layer)
- Credentials stored as hex-encoded encrypted JSON (AES-256-GCM)
- Encryption key from `ENCRYPTION_KEY` environment variable
- Credentials format: `{ "apiKey": "xxx", "domain": "company.teamwork.com" }`

---

## PHASE 6: DRIZZLE SCHEMA IMPLEMENTATION

### Complete Schema File

**File:** `server/db/schema.ts`

```typescript
import { pgTable, serial, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

// ============================================================================
// AUDIT COLUMNS (Applied to all tables)
// ============================================================================
const auditColumns = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
};

// ============================================================================
// TABLE 1: organizations (Root tenant entity)
// ============================================================================
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  ...auditColumns,
});

// ============================================================================
// TABLE 2: users (User accounts with auth)
// ============================================================================
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  role: text('role').notNull().default('user'),
  deletedAt: timestamp('deleted_at'),
  ...auditColumns,
});

// ============================================================================
// TABLE 3: password_reset_tokens (Password reset flow)
// ============================================================================
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ...auditColumns,
});

// ============================================================================
// TABLE 4: projects (Data preparation projects)
// ============================================================================
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  ownerId: integer('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  name: text('name').notNull(),
  description: text('description'),
  deletedAt: timestamp('deleted_at'),
  ...auditColumns,
});

// ============================================================================
// TABLE 5: sources (Data source files/integrations)
// ============================================================================
export const sources = pgTable('sources', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  filename: text('filename').notNull(),
  filepath: text('filepath').notNull(),
  mimetype: text('mimetype').notNull(),
  size: integer('size').notNull(),
  status: text('status').notNull().default('pending'),
  deletedAt: timestamp('deleted_at'),
  ...auditColumns,
});

// ============================================================================
// TABLE 6: processing_runs (Async processing jobs)
// ============================================================================
export const processingRuns = pgTable('processing_runs', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  sourceId: integer('source_id')
    .notNull()
    .references(() => sources.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('queued'),
  config: jsonb('config').notNull().$type<Record<string, any>>().default({}),
  stats: jsonb('stats').$type<Record<string, any>>(),
  error: text('error'),
  deletedAt: timestamp('deleted_at'),
  ...auditColumns,
});

// ============================================================================
// TABLE 7: datasets (Processed output datasets)
// ============================================================================
export const datasets = pgTable('datasets', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  format: text('format').notNull(),
  rowCount: integer('row_count').notNull(),
  fileUrl: text('file_url').notNull(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  deletedAt: timestamp('deleted_at'),
  ...auditColumns,
});

// ============================================================================
// TABLE 8: integrations (External API connections)
// ============================================================================
export const integrations = pgTable('integrations', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  name: text('name').notNull(),
  credentials: text('credentials').notNull(), // Encrypted JSON
  status: text('status').notNull().default('active'),
  lastSyncAt: timestamp('last_sync_at'),
  deletedAt: timestamp('deleted_at'),
  ...auditColumns,
});

// ============================================================================
// TYPE EXPORTS (All tables)
// ============================================================================
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;

export type ProcessingRun = typeof processingRuns.$inferSelect;
export type NewProcessingRun = typeof processingRuns.$inferInsert;

export type Dataset = typeof datasets.$inferSelect;
export type NewDataset = typeof datasets.$inferInsert;

export type Integration = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;
```

---

## PHASE 7: QUERY PATTERNS

### Common Query Examples (Core Select API)

```typescript
import { db } from '../db';
import { users, projects, sources, processingRuns, datasets } from '../db/schema';
import { eq, and, isNull, desc, asc, sql } from 'drizzle-orm';

// ============================================================================
// 1. Get Active Projects for Organization
// ============================================================================
const activeProjects = await db
  .select()
  .from(projects)
  .where(and(
    eq(projects.organizationId, orgId),
    isNull(projects.deletedAt)
  ))
  .orderBy(desc(projects.createdAt));

// ============================================================================
// 2. Get Project with Owner Info (JOIN)
// ============================================================================
const projectWithOwner = await db
  .select({
    project: projects,
    owner: users,
  })
  .from(projects)
  .innerJoin(users, eq(projects.ownerId, users.id))
  .where(and(
    eq(projects.id, projectId),
    eq(projects.organizationId, orgId),
    isNull(projects.deletedAt),
    isNull(users.deletedAt)
  ))
  .limit(1);

// ============================================================================
// 3. Get Sources with Multi-Level Soft Delete Filter
// ============================================================================
const activeSources = await db
  .select()
  .from(sources)
  .innerJoin(projects, eq(sources.projectId, projects.id))
  .where(and(
    eq(sources.projectId, projectId),
    eq(sources.organizationId, orgId),
    isNull(sources.deletedAt),
    isNull(projects.deletedAt) // Parent filter
  ))
  .orderBy(desc(sources.createdAt));

// ============================================================================
// 4. Count Active Sources for Project
// ============================================================================
const [result] = await db
  .select({
    count: sql<number>`count(*)::int`,
  })
  .from(sources)
  .where(and(
    eq(sources.projectId, projectId),
    eq(sources.organizationId, orgId),
    isNull(sources.deletedAt)
  ));

const sourceCount = result.count;

// ============================================================================
// 5. Get Processing Runs with Status Filter
// ============================================================================
const runningJobs = await db
  .select()
  .from(processingRuns)
  .where(and(
    eq(processingRuns.organizationId, orgId),
    eq(processingRuns.status, 'processing'),
    isNull(processingRuns.deletedAt)
  ))
  .orderBy(asc(processingRuns.createdAt));

// ============================================================================
// 6. Paginated Dataset List
// ============================================================================
const page = 1;
const limit = 20;
const offset = (page - 1) * limit;

const paginatedDatasets = await db
  .select()
  .from(datasets)
  .where(and(
    eq(datasets.organizationId, orgId),
    isNull(datasets.deletedAt)
  ))
  .orderBy(desc(datasets.createdAt))
  .limit(limit)
  .offset(offset);

// Get total count for pagination
const [countResult] = await db
  .select({
    total: sql<number>`count(*)::int`,
  })
  .from(datasets)
  .where(and(
    eq(datasets.organizationId, orgId),
    isNull(datasets.deletedAt)
  ));

// ============================================================================
// 7. Complex Join: Dataset with Project and Sources
// ============================================================================
const datasetDetails = await db
  .select({
    dataset: datasets,
    project: projects,
    sourceCount: sql<number>`count(distinct ${sources.id})::int`,
  })
  .from(datasets)
  .innerJoin(projects, eq(datasets.projectId, projects.id))
  .leftJoin(sources, and(
    eq(sources.projectId, projects.id),
    isNull(sources.deletedAt)
  ))
  .where(and(
    eq(datasets.id, datasetId),
    eq(datasets.organizationId, orgId),
    isNull(datasets.deletedAt),
    isNull(projects.deletedAt)
  ))
  .groupBy(datasets.id, projects.id)
  .limit(1);

// ============================================================================
// 8. Search Projects by Name (Case-Insensitive)
// ============================================================================
const searchResults = await db
  .select()
  .from(projects)
  .where(and(
    eq(projects.organizationId, orgId),
    isNull(projects.deletedAt),
    sql`lower(${projects.name}) like ${`%${searchTerm.toLowerCase()}%`}`
  ))
  .orderBy(desc(projects.updatedAt));
```

### N+1 Query Prevention

```typescript
// ❌ BAD: N+1 query pattern (fetches sources in loop)
const projects = await db
  .select()
  .from(projects)
  .where(eq(projects.organizationId, orgId));

for (const project of projects) {
  project.sources = await db
    .select()
    .from(sources)
    .where(eq(sources.projectId, project.id));
}

// ✅ GOOD: Single query with LEFT JOIN
const projectsWithSources = await db
  .select({
    project: projects,
    source: sources,
  })
  .from(projects)
  .leftJoin(sources, and(
    eq(sources.projectId, projects.id),
    isNull(sources.deletedAt)
  ))
  .where(and(
    eq(projects.organizationId, orgId),
    isNull(projects.deletedAt)
  ))
  .orderBy(desc(projects.createdAt));

// Group results in application code
const grouped = projectsWithSources.reduce((acc, row) => {
  const projectId = row.project.id;
  
  if (!acc[projectId]) {
    acc[projectId] = { 
      ...row.project, 
      sources: [] 
    };
  }
  
  if (row.source) {
    acc[projectId].sources.push(row.source);
  }
  
  return acc;
}, {} as Record<number, Project & { sources: Source[] }>);

const result = Object.values(grouped);
```

### Multi-Tenant Query Helper

```typescript
// Helper function to add organization filter automatically
export function withOrgFilter<T extends { organizationId: number }>(
  table: T,
  orgId: number
) {
  return eq(table.organizationId, orgId);
}

// Usage
const activeProjects = await db
  .select()
  .from(projects)
  .where(and(
    withOrgFilter(projects, orgId),
    isNull(projects.deletedAt)
  ));
```

---

## PHASE 8: MIGRATION STRATEGY

### Initial Migration

**File:** `server/db/migrations/0000_initial_schema.sql`

```sql
-- ============================================================================
-- Foundry Database Schema - Initial Migration
-- Generated: 2026-01-28
-- ============================================================================

-- TABLE 1: organizations (Root tenant entity)
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- TABLE 2: users (User accounts with auth)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- TABLE 3: password_reset_tokens (Password reset flow)
CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- TABLE 4: projects (Data preparation projects)
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_deleted_at ON projects(deleted_at);
CREATE INDEX idx_projects_org_deleted ON projects(organization_id, deleted_at);

-- TABLE 5: sources (Data source files/integrations)
CREATE TABLE sources (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  mimetype TEXT NOT NULL,
  size INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sources_organization_id ON sources(organization_id);
CREATE INDEX idx_sources_project_id ON sources(project_id);
CREATE INDEX idx_sources_status ON sources(status);
CREATE INDEX idx_sources_deleted_at ON sources(deleted_at);

-- TABLE 6: processing_runs (Async processing jobs)
CREATE TABLE processing_runs (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source_id INTEGER NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'queued',
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  stats JSONB,
  error TEXT,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_processing_runs_organization_id ON processing_runs(organization_id);
CREATE INDEX idx_processing_runs_project_id ON processing_runs(project_id);
CREATE INDEX idx_processing_runs_source_id ON processing_runs(source_id);
CREATE INDEX idx_processing_runs_status ON processing_runs(status);
CREATE INDEX idx_processing_runs_deleted_at ON processing_runs(deleted_at);

-- TABLE 7: datasets (Processed output datasets)
CREATE TABLE datasets (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  format TEXT NOT NULL,
  row_count INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  metadata JSONB,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_datasets_organization_id ON datasets(organization_id);
CREATE INDEX idx_datasets_project_id ON datasets(project_id);
CREATE INDEX idx_datasets_format ON datasets(format);
CREATE INDEX idx_datasets_deleted_at ON datasets(deleted_at);

-- TABLE 8: integrations (External API connections)
CREATE TABLE integrations (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  credentials TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  last_sync_at TIMESTAMP,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_integrations_organization_id ON integrations(organization_id);
CREATE INDEX idx_integrations_type ON integrations(type);
CREATE INDEX idx_integrations_status ON integrations(status);
CREATE INDEX idx_integrations_deleted_at ON integrations(deleted_at);

-- ============================================================================
-- Migration Complete
-- ============================================================================
```

### Running Migrations

```bash
# Generate migration from schema
npx drizzle-kit generate:pg

# Apply migrations to database
npx drizzle-kit migrate

# Verify migration applied
psql $DATABASE_URL -c "SELECT * FROM information_schema.tables WHERE table_schema = 'public';"
```

---

## PHASE 9: DATABASE CONNECTION

### Connection Configuration

**File:** `server/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections in pool
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Timeout after 5s
});

// Create Drizzle instance
export const db = drizzle(pool, { schema });

// Graceful shutdown
export async function closeDb() {
  await pool.end();
}

// Health check
export async function checkDbHealth(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
```

---

## ASSUMPTION REGISTER

### AR-001: User Role Validation
- **Owner Agent:** Agent 3
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 4 (API - validation), Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_4
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** PRD mentions "admin" users but doesn't specify full role hierarchy or permissions
- **Assumption Made:** Two roles: `user` (default) and `admin`. Role stored as TEXT validated in application layer. Admin has full access, user has limited access. No additional roles in MVP (member, owner, viewer).
- **Impact if Wrong:** If more granular permissions needed (project-level roles, resource-level permissions), would need additional role system (RBAC with permissions table, role assignments table). If role-based access control too simple, would need attribute-based access control (ABAC).

---

### AR-002: Source Type Validation
- **Owner Agent:** Agent 3
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 4 (API - validation), Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_4
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** PRD lists "file upload" and "Teamwork Desk API" but doesn't enumerate all source types
- **Assumption Made:** Two source types: `file` (CSV, Excel, images) and `teamwork` (Teamwork Desk API integration). Type stored as TEXT validated in application layer. Future types deferred to Phase 2 (google_drive, slack, zendesk).
- **Impact if Wrong:** If additional source types needed, would extend validation enum. If source types have different schemas, would need polymorphic source tables (sources table + type-specific tables).

---

### AR-003: Processing Run Timeout Handling
- **Owner Agent:** Agent 3
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 6 (Implementation), Agent 7 (QA)]
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** PRD specifies 10-minute timeout but doesn't detail how timeout is tracked in database
- **Assumption Made:** Processing run timeout tracked via application timer (not database column). If processing exceeds 10 minutes, status updated to `failed` with error message. No separate `timeout_at` column. Cleanup job detects stale "processing" runs (older than 15 minutes) and marks as failed.
- **Impact if Wrong:** If timeout needs database-level tracking, would add `timeout_at` column and database trigger. If longer timeout needed, would require job queue (Bull with Redis) for status tracking.

---

### AR-004: Dataset File Storage
- **Owner Agent:** Agent 3
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** Architecture specifies local filesystem but doesn't detail dataset file retention
- **Assumption Made:** Dataset `fileUrl` stores local file path (`/tmp/datasets/{id}.jsonl`). Files retained for 30 days, then deleted by cleanup job. Dataset record retained (soft delete), but file removed. Datasets can be regenerated from sources if needed.
- **Impact if Wrong:** If longer retention needed, would need S3/R2 storage. If regeneration not acceptable, would need permanent storage. If file size limits exceeded, would need chunked storage or compression.

---

### AR-005: Integration Credentials Storage Format
- **Owner Agent:** Agent 3
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 4 (API - encryption), Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_4
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** Architecture specifies AES-256-GCM encryption but doesn't define credentials JSON schema
- **Assumption Made:** Credentials stored as encrypted JSON with type-specific schemas:
  - Teamwork: `{ "apiKey": "xxx", "domain": "company.teamwork.com" }`
  - Future types would extend schema
  - Encrypted before storage, decrypted on use
  - No plaintext API keys in database or logs
- **Impact if Wrong:** If different credential formats needed (OAuth tokens, refresh tokens, client secrets), would extend JSON schema. If key rotation needed, would require migration to re-encrypt all credentials.

---

### AR-006: Soft Delete Cleanup Schedule
- **Owner Agent:** Agent 3
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 6 (Implementation), Agent 7 (QA)]
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** ADR-005 specifies 30-day retention but doesn't detail cleanup implementation
- **Assumption Made:** Soft-deleted records purged after 30 days via scheduled cleanup job (node-cron). Job runs daily at 2 AM, hard deletes records where `deletedAt < NOW() - INTERVAL '30 days'`. Purge is irreversible.
- **Impact if Wrong:** If variable retention needed (different retention per organization), would add `retention_days` column to organizations table. If audit requirements longer (GDPR 6 years), would need different retention policy.

---

## DOWNSTREAM AGENT HANDOFF BRIEF

**Output Generated:** `/docs/03-DATA-MODEL.md`

**Document Status:** COMPLETE with 6 assumptions documented

**Critical Decisions for Agent 4 (API Contract):**

1. **Multi-Tenant:** All API endpoints MUST filter by `organizationId` from JWT token
2. **Soft Delete:** All queries MUST filter `deletedAt IS NULL` for active records
3. **Validation:** Role validation (`user`, `admin`), Source type validation (`file`, `teamwork`), Processing status validation (`queued`, `processing`, `completed`, `failed`)
4. **Encryption:** Integration credentials MUST be encrypted/decrypted using `server/utils/encryption.ts`
5. **Type Safety:** All request/response schemas MUST use exported TypeScript types from schema

**Critical Decisions for Agent 5 (UI/UX):**

1. **Pagination:** Use standard pagination (page, limit, offset) for all list views
2. **Real-Time Updates:** Processing status should poll every 2-3 seconds (no WebSockets in MVP)
3. **File Upload:** Show upload progress, validate file types client-side before upload
4. **Soft Delete:** Provide "Restore" button for soft-deleted items (within 30-day window)

**Critical Decisions for Agent 6 (Implementation):**

1. **Schema File:** Single file `server/db/schema.ts` with 8 table definitions
2. **Connection:** Use connection pooling via `pg.Pool` (max 20 connections)
3. **Query Pattern:** ONLY use Core Select API (`db.select().from()`), Query API forbidden
4. **Seed Script:** Implement `scripts/seed-admin.ts` with idempotent admin user creation
5. **Cascade Operations:** Implement soft delete cascade functions in service layer (NOT database triggers)

**Validation Required from Agent 4:**

- Confirm pagination parameters (page, limit) or use cursor-based pagination
- Confirm error codes for database constraints (unique email, FK violations)
- Confirm API response format for complex joins (nested objects vs flat)

**Next Agent:** Agent 4 (API Contract) will read this data model to design REST API endpoints and request/response schemas.

---

**Document End**

**Agent 3 (Data Modeling) v22 Complete**

# Product Requirements Document: Foundry

## Document Metadata
- Version: 1.0
- Date: 2026-01-28
- Author: Agent 1 (Product Definition)
- Status: Draft
- Target Platform: Replit (Monolithic Full-Stack)
- Database: PostgreSQL (Neon)

---

## 1. Executive Summary

Foundry is a multi-tenant data preparation platform that transforms raw business data from any source into clean, de-identified, structured datasets ready for AI systems, agents, and evaluation workflows.

The MVP delivers privacy-first data transformation through file upload and API integration capabilities, enabling non-technical users to generate AI-ready datasets in under five minutes. Success is measured by user ability to upload data and receive structured output without documentation or support.

This product deploys to Replit as a full-stack monolithic application with PostgreSQL database, targeting 50 concurrent users during MVP phase with path to scale.

**Core Value Proposition:** Turn heterogeneous, messy, real-world business data into consistent, reusable datasets that AI systems can safely consume—without custom engineering.

---

## 2. Problem Statement

Organisations increasingly want to use their own data to power AI agents, internal tools, and intelligent workflows. However, the path from "data in systems" to "AI-ready datasets" is fragmented, manual, and technical.

**Current Pain Points:**

1. **Fragmented Data:** Operational data is spread across helpdesks, CRMs, document stores, spreadsheets, and databases with no unified extraction method

2. **Privacy and Compliance Risk:** Raw business data contains customer PII, internal identifiers, and sensitive information that cannot be safely used for AI without consistent de-identification

3. **Inconsistent Formats:** Each source structures data differently—conversations, tickets, documents all require different handling, making AI systems unreliable

4. **High Technical Barrier:** Preparing AI-ready datasets requires custom engineering for every source, schema, and use case, making it slow and expensive

**Measurable Impact:**
- Data preparation currently takes 2-4 weeks per project (manual ETL engineering)
- 60% of AI initiatives stall due to data readiness issues
- Privacy concerns block 40% of potential AI use cases
- Each data source requires $10K-50K in custom integration work

**Root Cause:** No horizontal infrastructure exists that abstracts data preparation complexity while maintaining privacy controls across heterogeneous sources.

**Without Foundry:** Organizations continue manual, risky, expensive data preparation that delays AI adoption.

**With Foundry:** Organizations unlock their data for AI safely, consistently, and without engineering bottlenecks—enabling rapid AI experimentation and deployment.

---

## 3. Success Metrics

| Metric | Target | Measurement Method | Timeframe |
|--------|--------|-------------------|-----------|
| Time to First Output | < 5 minutes | User uploads file → receives processed output | Per session |
| Processing Success Rate | > 95% | Successful processing runs / total runs | Weekly |
| Self-Service Success | > 80% | Users completing first project without support | 30 days |
| Data Quality Score | > 90% | Valid records / total records in output | Per dataset |
| PII Detection Accuracy | > 98% | Correctly identified PII fields / total PII | Per dataset |
| User Retention (Weekly) | > 60% | Active users week N / active users week 1 | 4 weeks |

---

## 4. User Personas

### Primary: AI Product Manager
- **Role:** Product manager responsible for AI agent development at mid-sized tech company
- **Goals:** 
  - Prepare training data for customer support AI agent
  - Ensure customer privacy compliance
  - Iterate quickly without engineering dependencies
- **Pain Points:** 
  - Engineering team backlogged for 6 weeks on data pipeline work
  - Legal team blocked last AI project due to PII concerns
  - No way to test AI performance without production-quality data
- **Behaviors:** 
  - Exports CSVs from support tools manually
  - Uses spreadsheets to clean data (error-prone)
  - Waits on engineering for schema transformations
- **Tech Savvy:** Intermediate (knows SQL basics, understands APIs conceptually)

### Secondary: AI/ML Engineer
- **Role:** Machine learning engineer building custom AI solutions
- **Goals:**
  - Get structured datasets for model training/fine-tuning
  - Maintain consistent data schemas across experiments
  - Focus on model quality, not data wrangling
- **Pain Points:**
  - Spends 60% of time on data cleaning vs 40% on model work
  - Data schema changes break training pipelines
  - No reliable way to de-identify sensitive data at scale
- **Behaviors:**
  - Writes custom Python scripts for each data source
  - Maintains multiple preprocessing pipelines
  - Tests models on synthetic data due to privacy concerns
- **Tech Savvy:** Advanced (fluent in Python, SQL, data engineering patterns)

### Tertiary: Operations Manager
- **Role:** Operations lead evaluating AI adoption for business processes
- **Goals:**
  - Assess if company data can support AI use cases
  - Prove AI ROI with real business data
  - Maintain compliance with data governance policies
- **Pain Points:**
  - Can't access usable data without IT involvement
  - Doesn't know what data quality is "good enough" for AI
  - Concerns about exposing customer data to AI systems
- **Tech Savvy:** Beginner (comfortable with business tools, basic Excel)

---

## 5. FEATURE COUNT SUMMARY (For Claude Code)

| Feature Area | Endpoint Count | Page Count | Key Files | Status |
|--------------|---------------|------------|-----------|--------|
| Authentication | 7 | 4 | auth.routes.ts, auth.service.ts, LoginPage.tsx, RegisterPage.tsx, ForgotPasswordPage.tsx, ResetPasswordPage.tsx | [ ] |
| Organizations | 6 | 2 | org.routes.ts, org.service.ts, OrgSettingsPage.tsx, OrgDashboardPage.tsx | [ ] |
| Projects | 11 | 4 | project.routes.ts, project.service.ts, ProjectListPage.tsx, ProjectCreatePage.tsx, ProjectDetailPage.tsx, ProjectConfigPage.tsx | [ ] |
| Sources | 9 | 3 | source.routes.ts, source.service.ts, SourceListPage.tsx, SourceUploadPage.tsx, SourceConnectPage.tsx | [ ] |
| Processing | 8 | 2 | processing.routes.ts, processing.service.ts, ProcessingConfigPage.tsx, ProcessingResultsPage.tsx | [ ] |
| Datasets | 10 | 3 | dataset.routes.ts, dataset.service.ts, DatasetListPage.tsx, DatasetDetailPage.tsx, DatasetDownloadPage.tsx | [ ] |
| **TOTAL** | **51** | **18** | | |

**Verification Commands:**
```bash
# After implementation, verify counts match:
find server/routes -name "*.routes.ts" | wc -l  # Expected: 6 route files
find client/src/pages -name "*.tsx" -type f | wc -l  # Expected: 18 pages

# Count endpoints per resource:
grep -c "router\." server/routes/auth.routes.ts  # Expected: 7
grep -c "router\." server/routes/org.routes.ts  # Expected: 6
grep -c "router\." server/routes/project.routes.ts  # Expected: 11
grep -c "router\." server/routes/source.routes.ts  # Expected: 9
grep -c "router\." server/routes/processing.routes.ts  # Expected: 8
grep -c "router\." server/routes/dataset.routes.ts  # Expected: 10
```

**Instructions for Claude Code:**
- [OK] Verify these counts match your implementation
- [OK] Run verification commands before marking features complete
- [!] Do NOT skip endpoints or pages from this inventory
- [!] Do NOT create placeholder routes that reference the wrong page
- [OK] All page components must be functional, not stubs

---

## 6. MVP SCOPE BOUNDARIES

### IN SCOPE (Must Implement):

**Authentication & Access:**
- [ ] User registration with email/password
- [ ] User login with JWT tokens
- [ ] Password reset flow
- [ ] User profile management
- [ ] Session management

**Organization Management:**
- [ ] Single-tenant organization creation on signup
- [ ] Organization settings (name, metadata)
- [ ] User belongs to exactly one organization
- [ ] Organization-scoped data isolation

**Project Management:**
- [ ] Create, read, update, delete projects
- [ ] Project configuration (name, description, goals)
- [ ] Associate sources with projects
- [ ] Project-level processing rules
- [ ] List all projects in organization

**Source Management:**
- [ ] File upload (CSV, Excel, JSON)
- [ ] Teamwork Desk API connector
- [ ] Source metadata tracking (upload date, size, type)
- [ ] Preview raw source data (first 100 rows)
- [ ] Reuse sources across multiple projects

**Data Processing:**
- [ ] Automatic schema detection from uploaded files
- [ ] Column type inference (text, number, date, PII)
- [ ] PII detection (email, phone, names, addresses)
- [ ] Configurable de-identification rules
- [ ] Field masking and replacement
- [ ] Manual processing trigger (batch mode)
- [ ] Processing status tracking (pending, running, complete, failed)
- [ ] Processing history and logs

**Dataset Outputs:**
- [ ] Generate conversational JSONL format
- [ ] Generate Q&A pairs format
- [ ] Generate structured JSON format
- [ ] Dataset preview (first 100 records)
- [ ] Download processed datasets
- [ ] Dataset versioning (track processing runs)
- [ ] Dataset metadata (row count, schema, de-identification applied)

**Quality & Governance:**
- [ ] Data quality filtering (completeness thresholds)
- [ ] Processing lineage tracking (source → output)
- [ ] Error handling and validation messages

### OUT OF SCOPE (Do Not Implement):

**Phase 2 Features:**
- [!] GoHighLevel API connector (connector priority #2)
- [!] Multi-organization user membership
- [!] Team collaboration and sharing
- [!] Role-based access control beyond org ownership
- [!] Email verification on signup
- [!] Social login (Google, Microsoft)
- [!] Real-time processing (WebSocket updates)
- [!] Scheduled/automated processing
- [!] Cloud storage integrations (S3, Google Drive push)
- [!] Webhooks and API callbacks
- [!] Advanced analytics dashboard
- [!] Topic/intent extraction
- [!] Sentiment analysis
- [!] Automatic categorization
- [!] Metadata enrichment
- [!] Custom Python/JavaScript processing stages

**Never Implement:**
- [!] Multi-factor authentication (deferred)
- [!] Admin panel (deferred)
- [!] Billing/payment system (deferred)
- [!] API key management for external access (deferred)
- [!] Marketplace for schemas/connectors (deferred)

**CRITICAL RULE FOR CLAUDE CODE:**
If a feature is OUT OF SCOPE:
- [!] Do NOT create placeholder routes
- [!] Do NOT create stub pages
- [!] Do NOT add commented-out code
- [!] Do NOT reference it in navigation menus
- [!] Do NOT include in database schema

Only implement what is explicitly IN SCOPE.

---

## 7. User Stories (MVP)

### Authentication Stories

#### US-AUTH-001: User Registration
**As a** new user  
**I want** to create an account with email and password  
**So that** I can access the Foundry platform securely

**Priority:** MVP - Critical  
**Size:** M  
**Dependencies:** None

**Acceptance Criteria:**
1. User submits email, password, and full name
2. System validates email format (RFC 5322 standard)
3. System validates password strength (minimum 8 characters, must include letters and numbers)
4. System creates organization automatically with user as owner
5. System creates user account and returns JWT token
6. User is redirected to project list page
7. Duplicate email addresses are rejected with clear error message
8. Password is hashed using bcrypt before storage

**Technical Notes:**
- JWT token valid for 7 days
- Organization name defaults to "{username}'s Organization"

---

#### US-AUTH-002: User Login
**As a** registered user  
**I want** to log in with my email and password  
**So that** I can access my projects and data

**Priority:** MVP - Critical  
**Size:** S  
**Dependencies:** US-AUTH-001

**Acceptance Criteria:**
1. User submits email and password
2. System validates credentials against database
3. System returns JWT token on success
4. User is redirected to project list page
5. Invalid credentials show clear error message
6. System rate-limits failed login attempts (5 attempts per 15 minutes)

**Technical Notes:**
- Use bcrypt.compare for password verification
- JWT contains user_id and org_id claims

---

#### US-AUTH-003: Password Reset Request
**As a** user who forgot their password  
**I want** to request a password reset  
**So that** I can regain access to my account

**Priority:** MVP - High  
**Size:** M  
**Dependencies:** US-AUTH-001

**Acceptance Criteria:**
1. User submits email address on forgot password page
2. System generates unique reset token (expires in 1 hour)
3. System sends password reset email with reset link
4. Reset link includes token as URL parameter
5. System shows "Check your email" message (even if email doesn't exist - security)
6. Old reset tokens are invalidated when new one is generated

**Technical Notes:**
- Reset token stored in database with expiration timestamp
- Email includes link: `https://<domain>/reset-password?token=<token>`

---

#### US-AUTH-004: Password Reset Completion
**As a** user with a reset token  
**I want** to set a new password  
**So that** I can access my account again

**Priority:** MVP - High  
**Size:** S  
**Dependencies:** US-AUTH-003

**Acceptance Criteria:**
1. User clicks reset link from email
2. System validates token is valid and not expired
3. User enters new password (with confirmation)
4. System validates password strength requirements
5. System updates password and invalidates reset token
6. User is redirected to login page with success message
7. Expired or invalid tokens show clear error message

---

#### US-AUTH-005: User Profile View
**As a** logged-in user  
**I want** to view my profile information  
**So that** I can confirm my account details

**Priority:** MVP - Medium  
**Size:** S  
**Dependencies:** US-AUTH-002

**Acceptance Criteria:**
1. User navigates to profile page
2. System displays user's email, full name, organization name
3. System displays account creation date
4. Page includes link to edit profile

---

#### US-AUTH-006: User Profile Update
**As a** logged-in user  
**I want** to update my profile information  
**So that** I can keep my details current

**Priority:** MVP - Medium  
**Size:** M  
**Dependencies:** US-AUTH-005

**Acceptance Criteria:**
1. User can update full name
2. User can update email (must be unique)
3. User can update password (requires current password confirmation)
4. Changes are validated before saving
5. Success message shown after update
6. Email change requires re-login

---

#### US-AUTH-007: Logout
**As a** logged-in user  
**I want** to log out of my account  
**So that** my session is terminated

**Priority:** MVP - Critical  
**Size:** XS  
**Dependencies:** US-AUTH-002

**Acceptance Criteria:**
1. User clicks logout button in navigation
2. System clears JWT token from client
3. User is redirected to login page
4. Attempting to access protected pages redirects to login

---

### Organization Management Stories

#### US-ORG-001: View Organization Dashboard
**As an** organization owner  
**I want** to view my organization's dashboard  
**So that** I can see activity and usage summary

**Priority:** MVP - Medium  
**Size:** M  
**Dependencies:** US-AUTH-002

**Acceptance Criteria:**
1. Dashboard displays organization name
2. Dashboard shows total projects count
3. Dashboard shows total sources count
4. Dashboard shows total datasets generated count
5. Dashboard shows storage usage (MB)
6. Dashboard shows recent activity (last 10 actions)

---

#### US-ORG-002: Update Organization Settings
**As an** organization owner  
**I want** to update my organization name and metadata  
**So that** I can customize my workspace

**Priority:** MVP - Low  
**Size:** S  
**Dependencies:** US-ORG-001

**Acceptance Criteria:**
1. User navigates to organization settings page
2. User can update organization name
3. User can add organization description (optional)
4. Changes are saved and reflected immediately
5. Organization name must be non-empty

---

### Project Management Stories

#### US-PROJ-001: Create New Project
**As a** user  
**I want** to create a new project  
**So that** I can organize my data preparation work

**Priority:** MVP - Critical  
**Size:** M  
**Dependencies:** US-AUTH-002

**Acceptance Criteria:**
1. User clicks "Create Project" button
2. User enters project name (required)
3. User enters project description (optional)
4. User selects project goal from dropdown (Training Data, Knowledge Base, Evaluation, Custom)
5. System creates project and assigns unique ID
6. User is redirected to project detail page
7. Project is visible in project list

**Technical Notes:**
- Project belongs to user's organization
- Projects are soft-deletable

---

#### US-PROJ-002: List All Projects
**As a** user  
**I want** to see all my organization's projects  
**So that** I can access and manage them

**Priority:** MVP - Critical  
**Size:** S  
**Dependencies:** US-PROJ-001

**Acceptance Criteria:**
1. User navigates to projects page
2. System displays all projects in organization as cards
3. Each card shows: project name, description, created date, source count, dataset count
4. Projects are sorted by last modified date (newest first)
5. Empty state shown if no projects exist
6. User can click project card to view details

---

#### US-PROJ-003: View Project Details
**As a** user  
**I want** to view a project's details and activity  
**So that** I can understand its current state

**Priority:** MVP - Critical  
**Size:** M  
**Dependencies:** US-PROJ-002

**Acceptance Criteria:**
1. User clicks on project from list
2. System displays project name, description, goal
3. System shows list of connected sources (with upload dates)
4. System shows list of generated datasets (with processing dates)
5. System shows processing history (last 20 runs with status)
6. Page includes buttons to: edit project, add source, configure processing, delete project

---

#### US-PROJ-004: Update Project
**As a** user  
**I want** to edit a project's details  
**So that** I can keep information current

**Priority:** MVP - Medium  
**Size:** S  
**Dependencies:** US-PROJ-003

**Acceptance Criteria:**
1. User clicks "Edit Project" button
2. User can update project name
3. User can update project description
4. User can change project goal
5. Changes are saved and reflected immediately
6. User is redirected back to project detail page

---

#### US-PROJ-005: Delete Project
**As a** user  
**I want** to delete a project  
**So that** I can remove projects I no longer need

**Priority:** MVP - Medium  
**Size:** M  
**Dependencies:** US-PROJ-003

**Acceptance Criteria:**
1. User clicks "Delete Project" button
2. System shows confirmation dialog warning about data loss
3. User must type project name to confirm deletion
4. System soft-deletes project (marks as deleted, doesn't remove from DB)
5. Associated datasets are also marked as deleted
6. Source files remain (they may be used by other projects)
7. User is redirected to project list

**Technical Notes:**
- Soft delete: set `deleted_at` timestamp
- Cascade to datasets but NOT to sources

---

### Source Management Stories

#### US-SRC-001: Upload File Source
**As a** user  
**I want** to upload a CSV, Excel, or JSON file  
**So that** I can use it as a data source for my project

**Priority:** MVP - Critical  
**Size:** L  
**Dependencies:** US-PROJ-003

**Acceptance Criteria:**
1. User navigates to project and clicks "Add Source"
2. User selects "File Upload" option
3. User drags and drops or selects file from local system
4. System validates file type (CSV, XLSX, XLS, JSON only)
5. System validates file size (max 100MB)
6. System uploads file and stores in project storage
7. System automatically detects columns and data types
8. System generates source metadata (filename, size, row count, column names)
9. Source is visible in project's source list
10. User can preview first 100 rows of raw data

**Technical Notes:**
- Store files in `/uploads/{org_id}/{source_id}/` directory structure
- Parse CSV with header detection
- Parse Excel sheets (first sheet only for MVP)
- Parse JSON (must be array of objects or object with array property)

---

#### US-SRC-002: Connect Teamwork Desk API
**As a** user with a Teamwork Desk account  
**I want** to connect my help desk data via API  
**So that** I can prepare customer support data for AI

**Priority:** MVP - Critical  
**Size:** XL  
**Dependencies:** US-PROJ-003

**Acceptance Criteria:**
1. User navigates to project and clicks "Add Source"
2. User selects "Teamwork Desk" option
3. User enters Teamwork Desk API subdomain
4. User enters Teamwork Desk API key
5. System validates API credentials by making test request
6. User selects data to import: tickets, conversations, customers
7. User sets date range for historical data
8. System fetches data via Teamwork Desk API
9. System stores fetched data and creates source record
10. System automatically detects schema from API response
11. Source is visible in project's source list
12. User can preview first 100 records

**Technical Notes:**
- Teamwork Desk API docs: https://apidocs.teamwork.com/docs/desk/
- Required API scopes: tickets:read, conversations:read
- Store API credentials encrypted in database
- Cache API response for 30 days

**API Endpoints to Use:**
- GET `/tickets.json` - fetch all tickets
- GET `/tickets/{id}.json` - fetch ticket details
- GET `/customers.json` - fetch customers

---

#### US-SRC-003: Preview Source Data
**As a** user  
**I want** to preview raw source data  
**So that** I can verify it uploaded correctly

**Priority:** MVP - High  
**Size:** M  
**Dependencies:** US-SRC-001

**Acceptance Criteria:**
1. User clicks "Preview" on a source
2. System displays first 100 rows in table format
3. Table shows all columns with scrollable view
4. System shows total row count above table
5. System highlights detected PII fields in yellow
6. System shows column data types (inferred)

---

#### US-SRC-004: View Source Details
**As a** user  
**I want** to view source metadata and statistics  
**So that** I understand the source characteristics

**Priority:** MVP - Medium  
**Size:** S  
**Dependencies:** US-SRC-001

**Acceptance Criteria:**
1. User clicks on source name
2. System displays: filename, upload date, file size, row count, column count
3. System shows list of columns with data types
4. System shows which projects use this source
5. System shows processing history for this source

---

#### US-SRC-005: Delete Source
**As a** user  
**I want** to delete a source  
**So that** I can remove data I no longer need

**Priority:** MVP - Low  
**Size:** S  
**Dependencies:** US-SRC-004

**Acceptance Criteria:**
1. User clicks "Delete Source" button
2. System shows warning if source is used by active projects
3. User confirms deletion
4. System marks source as deleted
5. Associated file is retained for 30 days then purged
6. Source is removed from project source lists

---

### Data Processing Stories

#### US-PROC-001: Configure Processing Rules
**As a** user  
**I want** to configure how my data is processed  
**So that** I can control de-identification and transformation

**Priority:** MVP - Critical  
**Size:** XL  
**Dependencies:** US-SRC-003

**Acceptance Criteria:**
1. User navigates to project processing configuration page
2. System displays all columns from project sources
3. For each column, user can:
   - Mark as PII (email, phone, name, address)
   - Set de-identification rule (mask, hash, remove, replace with placeholder)
   - Set as required/optional for output
4. User can set data quality filters:
   - Minimum completeness threshold (% of non-null values)
   - Required fields (reject records missing these)
5. User can select output format: Conversational JSONL, Q&A Pairs, Structured JSON
6. User can save configuration as project default
7. Configuration is validated before saving

**Technical Notes:**
- Store processing config as JSON in `projects.processing_config` column
- Config schema: `{ columns: [], filters: {}, output_format: string }`

---

#### US-PROC-002: Trigger Manual Processing
**As a** user  
**I want** to manually trigger data processing  
**So that** I can generate an AI-ready dataset

**Priority:** MVP - Critical  
**Size:** L  
**Dependencies:** US-PROC-001

**Acceptance Criteria:**
1. User clicks "Process Data" button on project page
2. System validates that project has sources and processing config
3. System creates processing job with status "pending"
4. System begins processing in background:
   - Loads source data
   - Applies PII detection
   - Applies de-identification rules
   - Applies quality filters
   - Transforms to output format
5. User can see processing status: pending → running → complete/failed
6. Processing time is logged
7. On completion, dataset is available for preview/download
8. On failure, error message is logged and shown to user

**Technical Notes:**
- Background job system needed (consider using node-cron or Bull queue)
- Processing timeout: 10 minutes
- Log all processing steps for auditability

---

#### US-PROC-003: View Processing Status
**As a** user  
**I want** to see the status of running and completed processing jobs  
**So that** I can monitor progress

**Priority:** MVP - High  
**Size:** M  
**Dependencies:** US-PROC-002

**Acceptance Criteria:**
1. User views project detail page
2. System shows processing history table with columns:
   - Start time
   - Status (pending, running, complete, failed)
   - Duration
   - Records processed
   - Output dataset link (if complete)
3. Running jobs show progress indicator
4. Failed jobs show error message
5. User can click completed job to view resulting dataset

---

#### US-PROC-004: Preview Processing Results
**As a** user  
**I want** to preview de-identified data before downloading  
**So that** I can verify it meets my needs

**Priority:** MVP - High  
**Size:** M  
**Dependencies:** US-PROC-002

**Acceptance Criteria:**
1. User clicks "Preview" on completed processing job
2. System displays first 100 records in processed format
3. Preview shows de-identification applied (e.g., emails masked)
4. Preview shows output format (JSON structure)
5. System shows metadata: total records, schema, processing date

---

### Dataset Output Stories

#### US-DATA-001: List All Datasets
**As a** user  
**I want** to see all datasets generated in my project  
**So that** I can access previous processing results

**Priority:** MVP - High  
**Size:** S  
**Dependencies:** US-PROC-002

**Acceptance Criteria:**
1. User navigates to project datasets page
2. System displays all datasets as list with columns:
   - Dataset name (auto-generated: "project_name_YYYYMMDD_HHMMSS")
   - Processing date
   - Record count
   - Output format
   - File size
3. Datasets sorted by processing date (newest first)
4. Each row has "Preview" and "Download" buttons

---

#### US-DATA-002: Download Dataset
**As a** user  
**I want** to download a processed dataset  
**So that** I can use it to train or test AI systems

**Priority:** MVP - Critical  
**Size:** M  
**Dependencies:** US-DATA-001

**Acceptance Criteria:**
1. User clicks "Download" button on dataset
2. System generates download in requested format:
   - Conversational JSONL: `.jsonl` file
   - Q&A Pairs: `.jsonl` file
   - Structured JSON: `.json` file
3. File downloads to user's local system
4. Filename follows convention: `{project_name}_{date}_{format}.{ext}`
5. Large files (>10MB) show download progress

**Technical Notes:**
- Stream large files to avoid memory issues
- Set proper Content-Type headers
- Use Content-Disposition header for filename

---

#### US-DATA-003: View Dataset Details
**As a** user  
**I want** to view dataset metadata and lineage  
**So that** I can understand what data it contains

**Priority:** MVP - Medium  
**Size:** M  
**Dependencies:** US-DATA-001

**Acceptance Criteria:**
1. User clicks on dataset name
2. System displays:
   - Dataset name
   - Processing date and time
   - Source files used
   - Processing configuration applied
   - Output format
   - Record count
   - File size
   - De-identification rules applied
   - Data quality filters applied
3. System shows complete lineage: sources → processing → dataset
4. Page includes "Download" and "Preview" buttons

**Technical Notes:**
- Store lineage as JSON: `{ sources: [], config: {}, filters: {} }`

---

#### US-DATA-004: Delete Dataset
**As a** user  
**I want** to delete datasets I no longer need  
**So that** I can manage storage usage

**Priority:** MVP - Low  
**Size:** S  
**Dependencies:** US-DATA-003

**Acceptance Criteria:**
1. User clicks "Delete Dataset" button
2. System shows confirmation dialog
3. User confirms deletion
4. System marks dataset as deleted (soft delete)
5. Dataset file is retained for 30 days then purged
6. Dataset is removed from dataset list

---

## 8. User Stories (Post-MVP)

### US-CONN-001: GoHighLevel API Connector
**Removed from MVP** - Second API connector priority after Teamwork Desk. Deferred to assess API complexity and demand after MVP launch.

**As a** user with GoHighLevel account  
**I want** to connect my CRM data via API  
**So that** I can prepare sales and marketing data for AI

**Priority:** Phase 2  
**Size:** XL

---

### US-ORG-002: Multi-Organization Membership
**Removed from MVP** - Adds complexity to authentication and data scoping. Single-org model is sufficient for MVP validation.

**As a** user  
**I want** to belong to multiple organizations  
**So that** I can work with different clients or teams

**Priority:** Phase 2  
**Size:** L

---

### US-COLLAB-001: Share Projects with Team Members
**Removed from MVP** - Requires RBAC system and invitation flows. MVP targets individual users, not teams.

**As an** organization owner  
**I want** to invite team members to collaborate on projects  
**So that** we can work together on data preparation

**Priority:** Phase 2  
**Size:** XL

---

### US-PROC-005: Scheduled Automatic Processing
**Removed from MVP** - Manual batch processing is sufficient for MVP. Automation can be added once user workflows are validated.

**As a** user  
**I want** to schedule processing to run automatically  
**So that** datasets stay up-to-date without manual triggering

**Priority:** Phase 2  
**Size:** L

---

### US-ENRICH-001: Topic and Intent Extraction
**Removed from MVP** - Advanced NLP feature. Basic de-identification and schema normalization are higher priority.

**As a** user  
**I want** to automatically extract topics and intents from text  
**So that** my datasets are enriched with metadata

**Priority:** Phase 3  
**Size:** XL

---

## 9. User Flows & Page Inventory

### Primary Flows

**Flow 1: New User Onboarding (First-Run Experience)**
1. User visits Foundry landing page
2. User clicks "Sign Up"
3. User completes registration form → RegisterPage.tsx
4. System creates account and organization
5. User redirected to ProjectListPage.tsx (empty state)
6. User clicks "Create Project" button
7. User fills project form → ProjectCreatePage.tsx
8. User redirected to ProjectDetailPage.tsx
9. User clicks "Add Source" → SourceUploadPage.tsx
10. User uploads CSV file
11. System processes file and shows preview
12. User clicks "Configure Processing" → ProcessingConfigPage.tsx
13. System auto-detects PII fields
14. User reviews/adjusts de-identification rules
15. User clicks "Process Data"
16. System generates dataset (1-2 minutes)
17. User clicks "Download" on DatasetListPage.tsx
18. **Aha Moment: User has AI-ready data in < 5 minutes**

**Flow 2: Returning User - Regular Workflow**
1. User logs in → LoginPage.tsx
2. User sees ProjectListPage.tsx with existing projects
3. User clicks on project → ProjectDetailPage.tsx
4. User adds new source or re-processes with different config
5. User downloads updated dataset

**Flow 3: API Integration Workflow**
1. User navigates to project
2. User clicks "Add Source" → "Connect API"
3. User selects "Teamwork Desk" → SourceConnectPage.tsx
4. User enters API credentials
5. System validates and fetches data
6. User proceeds to processing configuration

### Complete Page Inventory

| Page | Route | Purpose | Accessed By | Auth Required |
|------|-------|---------|-------------|---------------|
| LoginPage.tsx | `/login` | User authentication | All users | No |
| RegisterPage.tsx | `/register` | Account creation | New users | No |
| ForgotPasswordPage.tsx | `/forgot-password` | Request password reset | Unauthenticated users | No |
| ResetPasswordPage.tsx | `/reset-password?token=X` | Complete password reset | Users with reset token | No |
| ProjectListPage.tsx | `/projects` | View all projects | Logged-in users | Yes |
| ProjectCreatePage.tsx | `/projects/create` | Create new project | Logged-in users | Yes |
| ProjectDetailPage.tsx | `/projects/:id` | View project details | Project owners | Yes |
| ProjectConfigPage.tsx | `/projects/:id/edit` | Edit project settings | Project owners | Yes |
| SourceListPage.tsx | `/projects/:id/sources` | View project sources | Project owners | Yes |
| SourceUploadPage.tsx | `/projects/:id/sources/upload` | Upload file source | Project owners | Yes |
| SourceConnectPage.tsx | `/projects/:id/sources/connect` | Connect API source | Project owners | Yes |
| ProcessingConfigPage.tsx | `/projects/:id/processing` | Configure processing rules | Project owners | Yes |
| ProcessingResultsPage.tsx | `/projects/:id/processing/results` | View processing history | Project owners | Yes |
| DatasetListPage.tsx | `/projects/:id/datasets` | View all datasets | Project owners | Yes |
| DatasetDetailPage.tsx | `/projects/:id/datasets/:datasetId` | View dataset details | Project owners | Yes |
| DatasetDownloadPage.tsx | `/projects/:id/datasets/:datasetId/download` | Download dataset | Project owners | Yes |
| OrgDashboardPage.tsx | `/organization` | Organization overview | Org owners | Yes |
| OrgSettingsPage.tsx | `/organization/settings` | Organization settings | Org owners | Yes |

**Total Pages:** 18

**Navigation Structure:**
- Public: Login, Register, Forgot Password, Reset Password
- Authenticated:
  - Top Nav: Projects, Organization, Profile, Logout
  - Project Detail Subnav: Overview, Sources, Processing, Datasets

---

## 10. Non-Functional Requirements

### Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Page Load Time | < 2 seconds | Time to interactive |
| File Upload Speed | > 1 MB/s | Upload throughput |
| Processing Throughput | 10,000 records/minute | Records processed per minute |
| API Response Time | < 500ms (p95) | Server response time |
| Database Query Time | < 100ms (p95) | Query execution time |

### Security

**Authentication:**
- JWT tokens with 7-day expiration
- Bcrypt password hashing (cost factor 12)
- Rate limiting: 5 failed login attempts per 15 minutes
- HTTPS-only communication (enforced by Replit)

**Authorization:**
- Organization-level data isolation (strict tenant boundaries)
- Row-level security on all data queries
- No cross-organization data leakage

**Data Protection:**
- PII detection using regex patterns + keyword matching
- Encrypted storage of API credentials (AES-256)
- Automatic de-identification before output generation
- Audit logs for all data access and processing

**Input Validation:**
- File type whitelist (CSV, XLSX, XLS, JSON only)
- File size limit: 100MB
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize user inputs)

### Scalability

**MVP Scale Targets:**
- 50 concurrent users
- 100 organizations
- 1,000 projects
- 10,000 sources
- 100,000 datasets
- 100GB total storage

**Replit Constraints:**
- Single container deployment
- 4GB RAM limit
- 4 vCPU cores
- 20GB disk space

**Growth Path (Post-MVP):**
- Implement background job queue for processing
- Add Redis caching layer
- Optimize database indexes
- Consider moving large files to external storage (S3)

### Reliability

**Uptime:** 99% target (7.3 hours downtime per month acceptable for MVP)

**Data Durability:**
- PostgreSQL with daily backups (Replit managed)
- Source files retained for 30 days
- Datasets retained until explicitly deleted

**Error Handling:**
- Graceful degradation on processing failures
- User-friendly error messages (no stack traces)
- Automatic retry for transient failures (API timeouts)
- Processing timeout: 10 minutes max per job

### Accessibility

**Standards:** WCAG 2.1 Level AA compliance

**Requirements:**
- Keyboard navigation support for all interactive elements
- Screen reader compatibility (semantic HTML)
- Color contrast ratios ≥ 4.5:1 for text
- Focus indicators on all interactive elements
- Alt text for all images and icons
- Form labels and error messages

### Browser Support

**Supported Browsers:**
- Chrome 100+ (primary target)
- Firefox 100+
- Safari 15+
- Edge 100+

**Not Supported:**
- Internet Explorer (any version)
- Mobile browsers (Phase 2)

**Progressive Enhancement:**
- Core functionality works without JavaScript (login/register)
- Advanced features require JavaScript (file upload, processing)

### Localization

**MVP:** English only

**Post-MVP:** 
- Internationalization framework
- UTC timestamps with timezone conversion

---

## 11. Technical Constraints

### Deployment Platform

**Platform:** Replit  
**Type:** Monolithic full-stack application  
**Hosting:** Single container with managed PostgreSQL

**Implications:**
- No microservices architecture
- No separate API and frontend deployments
- No infrastructure-as-code (Terraform, CloudFormation)
- No container orchestration (Kubernetes)
- No CI/CD pipelines (Replit auto-deploys)

### Database

**Database:** PostgreSQL 14+ (Neon managed by Replit)  
**Connection:** Single connection pool from Node.js application

**Constraints:**
- No direct database access for users
- No database-level functions/stored procedures (keep logic in application)
- Schema migrations managed via Drizzle ORM

### Technology Stack

**Backend:**
- Node.js 18+ with TypeScript
- Express.js for HTTP server
- Drizzle ORM for database access
- JWT for authentication
- Bcrypt for password hashing

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- React Router for navigation
- Tailwind CSS for styling

**File Storage:**
- Local filesystem within Replit container
- Path: `/uploads/{org_id}/{source_id}/`
- Files persisted across deployments (Replit managed storage)

### API Design

**Style:** RESTful HTTP/JSON  
**Base URL:** `/api/v1/`  
**Authentication:** Bearer token (JWT) in Authorization header

**Standard Envelopes:**
- Success: `{ data: T }`
- Error: `{ error: { code: string, message: string } }`
- Pagination: `{ data: T[], meta: { total, page, limit } }`

### External Dependencies

**Required APIs:**
- Teamwork Desk API (tickets, conversations)

**Optional Services (Post-MVP):**
- Email provider (SendGrid, Mailgun) for password reset emails
- Object storage (S3) for large file scaling

---

## 12. Data Schema Overview (High-Level)

**Note:** Detailed schema design is handled by Agent 3 (Data Modeling). This section provides high-level entities for context.

### Core Entities

**Users**
- id, email, password_hash, full_name, created_at, updated_at
- Belongs to one Organization

**Organizations**
- id, name, description, created_at, updated_at
- Has many Users, Projects, Sources

**Projects**
- id, org_id, name, description, goal, processing_config (JSON), created_at, updated_at, deleted_at
- Belongs to Organization
- Has many Sources (through project_sources junction)
- Has many Datasets

**Sources**
- id, org_id, type (upload, api), filename, file_path, row_count, schema (JSON), metadata (JSON), created_at, deleted_at
- Belongs to Organization
- Has many Projects (through project_sources junction)

**project_sources (Junction Table)**
- id, project_id, source_id, added_at

**Datasets**
- id, project_id, processing_job_id, name, output_format, file_path, record_count, schema (JSON), lineage (JSON), created_at, deleted_at
- Belongs to Project

**processing_jobs**
- id, project_id, status (pending, running, complete, failed), started_at, completed_at, duration_seconds, records_processed, error_message
- Belongs to Project

**password_reset_tokens**
- id, user_id, token (unique), expires_at, used_at

### Data Relationships

```
Organizations (1) → (M) Users
Organizations (1) → (M) Projects
Organizations (1) → (M) Sources
Projects (M) ← (M) Sources (via project_sources)
Projects (1) → (M) Datasets
Projects (1) → (M) processing_jobs
processing_jobs (1) → (1) Datasets
Users (1) → (M) password_reset_tokens
```

---

## 13. Integration Requirements

### Teamwork Desk API Integration

**Priority:** MVP - Critical

**API Documentation:** https://apidocs.teamwork.com/docs/desk/

**Required Credentials:**
- Subdomain (e.g., "acme.teamwork.com")
- API Key (Bearer token)

**Data to Import:**
- Tickets (id, subject, status, priority, created_at, updated_at)
- Conversations (ticket_id, message, author, timestamp)
- Customers (id, name, email)

**Processing Flow:**
1. User provides subdomain and API key
2. System validates credentials with test API call
3. User selects data types and date range
4. System fetches data via paginated API calls
5. System stores raw JSON response as source
6. System extracts schema from JSON structure
7. Source becomes available for processing

**Error Handling:**
- Invalid credentials → show clear error message
- Rate limit exceeded → queue for retry
- API timeout → retry up to 3 times
- No data found → inform user, create empty source

**Rate Limits:**
- Teamwork Desk: 100 requests per minute
- Implement exponential backoff on rate limit errors

---

## 14. Privacy and Compliance

### PII Detection

**Automatic Detection Patterns:**
- Email addresses: regex matching RFC 5322
- Phone numbers: international formats (E.164)
- Names: NLP heuristics (capitalized words in name fields)
- Addresses: field name matching ("address", "street", "city", "zip")
- Social Security Numbers: regex for XXX-XX-XXXX format
- Credit card numbers: Luhn algorithm validation

**Detection Accuracy Target:** 98%+

**False Positive Handling:** Allow manual override in processing config

### De-identification Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| Mask | Replace with `***` | Emails, phone numbers |
| Hash | SHA-256 hash | Persistent IDs needed |
| Remove | Delete field entirely | Unnecessary PII |
| Replace | Use placeholder ("REDACTED", "[Name]") | Maintaining context |

**User Control:** Users explicitly choose de-identification method per field

### Compliance Features

**Data Lineage:**
- Track source → processing → dataset chain
- Store processing configuration applied
- Record de-identification rules used
- Timestamp all transformations

**Audit Trail:**
- Log all data access events
- Log processing job executions
- Log dataset downloads
- Retain logs for 90 days

**Data Retention:**
- Source files: 30 days (configurable)
- Datasets: until user deletes
- Deleted items: 30-day soft delete buffer
- Audit logs: 90 days

**Data Export:**
- Users can download all their data
- Export includes sources, datasets, processing configs
- JSON format for machine readability

**GDPR Considerations (Post-MVP):**
- Right to erasure (delete user account + all data)
- Right to data portability (export)
- Right to access (view all stored data)

---

## 15. Monitoring and Observability

### Key Metrics to Track

**User Metrics:**
- New user registrations per day
- Active users per day/week
- User retention (Day 1, Day 7, Day 30)
- Projects created per user
- Datasets generated per project

**System Metrics:**
- Processing job success rate
- Average processing time per job
- API response time (p50, p95, p99)
- Database query time
- Error rate (4xx, 5xx responses)
- Storage usage growth

**Business Metrics:**
- Time to first dataset (aha moment)
- Weekly active projects
- Data sources added per project
- Dataset download rate
- Feature adoption (file upload vs API)

### Error Monitoring

**Priority 1 Errors (Immediate Alert):**
- Database connection failures
- Authentication system down
- Critical processing failures (>50% fail rate)

**Priority 2 Errors (Daily Review):**
- Individual processing job failures
- API integration errors
- File upload errors

**Priority 3 Errors (Weekly Review):**
- Validation errors
- User input errors
- Rate limit warnings

### Logging Strategy

**Log Levels:**
- ERROR: System failures, critical issues
- WARN: Recoverable errors, degraded performance
- INFO: User actions, processing jobs, API calls
- DEBUG: Detailed execution flow (development only)

**Structured Logging:**
- JSON format for machine parsing
- Include: timestamp, user_id, org_id, action, status, duration
- Redact PII from logs

---

## 16. Testing Strategy

### Unit Testing

**Coverage Target:** 80%+ for business logic

**Priority Areas:**
- PII detection algorithms
- De-identification functions
- Schema normalization logic
- Data quality filters
- Authentication/authorization logic

**Testing Framework:** Jest

### Integration Testing

**Priority Workflows:**
- User registration → login → create project → upload source → process → download
- API connector authentication and data fetch
- File upload → schema detection → preview
- Processing job execution (success and failure cases)

**Testing Framework:** Jest + Supertest

### End-to-End Testing

**Critical User Paths:**
- Complete onboarding flow (registration to first dataset)
- File upload and processing
- API integration and processing
- Error handling (invalid credentials, large files)

**Testing Framework:** Playwright (Phase 2 - manual testing for MVP)

### Manual Testing Checklist

**Before Launch:**
- [ ] Register new account
- [ ] Create project
- [ ] Upload CSV with PII
- [ ] Verify PII detection
- [ ] Configure de-identification
- [ ] Process data
- [ ] Preview results
- [ ] Download dataset
- [ ] Verify de-identification in output
- [ ] Test Teamwork Desk integration
- [ ] Test password reset flow
- [ ] Test error scenarios (large files, invalid formats)

---

## 17. Documentation Requirements

### User-Facing Documentation (MVP)

**Quick Start Guide:**
- 5-minute tutorial: register → upload → process → download
- Screenshots for each step
- Sample CSV file for testing

**API Integration Guides:**
- Teamwork Desk setup instructions
- Where to find API credentials
- Troubleshooting common issues

**FAQ:**
- What file formats are supported?
- How is PII detected?
- What de-identification methods are available?
- How long are files stored?
- What happens to deleted data?

### Developer Documentation (Internal)

**API Reference:**
- All endpoints with request/response examples
- Authentication requirements
- Error codes and meanings

**Database Schema:**
- Entity relationship diagram
- Table descriptions
- Index strategy

**Deployment Guide:**
- Replit setup instructions
- Environment variables
- Database migration process

---

## ASSUMPTION REGISTER

### AR-001: User-Organization Relationship Model
- **Owner Agent:** Agent 1
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 3 (Data Model), Agent 4 (API), Agent 5 (UI), Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_3
- **Allowed to Ship:** NO
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief states "multi-tenant" but doesn't specify if users can belong to multiple organizations
- **Assumption Made:** For MVP, users belong to exactly ONE organization. Organization is auto-created on user registration. This is the standard B2B SaaS pattern and simplifies auth/data scoping.
- **Impact if Wrong:** Would need junction table (users_organizations), auth context must track "current organization", UI needs organization switcher, all API queries need org scoping parameter, org_id in JWT claims becomes array

---

### AR-002: Processing Execution Model
- **Owner Agent:** Agent 1
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 2 (Architecture), Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_2
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief doesn't specify if processing is synchronous, asynchronous, or queued
- **Assumption Made:** MVP uses manual batch processing with async execution (background jobs). User triggers processing, job runs asynchronously, user polls for status. No real-time streaming or automatic scheduling.
- **Impact if Wrong:** If real-time processing needed, would require WebSocket connections, different UI patterns (live updates), and potentially different infrastructure (Lambda/serverless). If queuing needed, would require Redis/Bull setup.

---

### AR-003: File Storage Location
- **Owner Agent:** Agent 1
- **Type:** CONSTRAINT
- **Downstream Impact:** [Agent 2 (Architecture), Agent 6 (Implementation), Agent 7 (QA)]
- **Resolution Deadline:** BEFORE_AGENT_2
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief doesn't specify where uploaded files are stored
- **Assumption Made:** MVP stores files on local filesystem within Replit container at `/uploads/{org_id}/{source_id}/`. This is simplest for MVP and Replit persists container storage. Max file size 100MB per file.
- **Impact if Wrong:** If files need to be stored externally (S3, Google Cloud Storage), would require additional service integration, file upload/download proxying, access control, and cost considerations. If files exceed 100MB, would need streaming upload/download implementation.

---

### AR-004: API Connector Priority
- **Owner Agent:** Agent 1
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 4 (API), Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_4
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief lists Teamwork Desk as "Mandatory for MVP" and GoHighLevel as "Post MVP" but doesn't explain why Teamwork Desk was prioritized
- **Assumption Made:** Teamwork Desk is the ONLY API connector in MVP scope. This choice assumes: (1) Teamwork Desk is the primary customer use case, (2) MVP focuses on proving connector pattern with one integration, (3) GoHighLevel can be added later without architectural changes.
- **Impact if Wrong:** If both connectors are needed for MVP customer validation, would need to implement GoHighLevel integration (additional API client, auth flow, schema mapping). If Teamwork Desk choice is wrong, might need to swap to different connector.

---

### AR-005: PII Detection Method
- **Owner Agent:** Agent 1
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 6 (Implementation), Agent 7 (QA)]
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief mentions "PII detection" but doesn't specify algorithmic approach
- **Assumption Made:** MVP uses rule-based PII detection (regex patterns + keyword matching + field name heuristics). Target accuracy: 98%+. No ML models. This is sufficient for MVP and doesn't require training data or model hosting.
- **Impact if Wrong:** If ML-based detection is required (e.g., Named Entity Recognition), would need to integrate NLP library (spaCy, transformers), add model hosting infrastructure, and handle model inference performance. If higher accuracy required (>99%), might need hybrid approach (rules + ML).

---

### AR-006: Output Format Specifications
- **Owner Agent:** Agent 1
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 3 (Data Model), Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** NO
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief lists "Conversational JSONL", "Q&A pairs", and "Raw structured JSON" but doesn't provide schema specifications
- **Assumption Made:** 
  - **Conversational JSONL:** `{"role": "user"|"assistant", "content": "text", "timestamp": "ISO8601"}\n` per line
  - **Q&A Pairs:** `{"question": "text", "answer": "text", "metadata": {}}\n` per line
  - **Structured JSON:** Array of objects matching original schema with de-identification applied
- **Impact if Wrong:** If output schemas need to match specific training frameworks (OpenAI fine-tuning, Anthropic messages API, LangChain), would need format converters or additional output options. If metadata requirements are different, would need schema updates.

---

### AR-007: Data Retention Policy
- **Owner Agent:** Agent 1
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 6 (Implementation), Agent 7 (QA)]
- **Resolution Deadline:** BEFORE_AGENT_7
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief states "Source data cached for 30 days" and "Processed datasets retained until deleted" but doesn't specify soft delete retention or audit log retention
- **Assumption Made:**
  - Source files: 30 days after upload (hard delete)
  - Datasets: retained until user deletes, then 30-day soft delete buffer
  - Soft-deleted items: purged after 30 days
  - Audit logs: 90 days retention
  - Processing job logs: retained indefinitely (small size)
- **Impact if Wrong:** If longer retention needed for compliance (GDPR 6 years, HIPAA 7 years), would need policy updates and storage scaling. If shorter retention needed, would need automated cleanup jobs with different schedules.

---

### AR-008: Concurrent User Scale Target
- **Owner Agent:** Agent 1
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 2 (Architecture), Agent 7 (QA)]
- **Resolution Deadline:** BEFORE_AGENT_2
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief doesn't specify expected concurrent user load for MVP
- **Assumption Made:** MVP targets 50 concurrent users with 100 organizations, 1,000 projects total. This is typical for early-stage SaaS MVP and fits within Replit's resource constraints (4GB RAM, 4 vCPU).
- **Impact if Wrong:** If higher scale needed (500+ concurrent users), would need load testing, performance optimization, database connection pooling tuning, and potentially Redis caching layer. If lower scale acceptable (10 users), some optimizations could be deferred.

---

### AR-009: Authentication Token Expiration
- **Owner Agent:** Agent 1
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 4 (API), Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_4
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief doesn't specify JWT token expiration or refresh strategy
- **Assumption Made:** JWT tokens expire after 7 days. No refresh token mechanism in MVP. Users must re-login after expiration. This balances security and user convenience for MVP.
- **Impact if Wrong:** If shorter expiration needed (24 hours for security), would need refresh token implementation (additional endpoint, token storage, rotation logic). If longer expiration needed (30 days), would reduce security posture.

---

### AR-010: Processing Timeout Limit
- **Owner Agent:** Agent 1
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 6 (Implementation), Agent 7 (QA)]
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief states "Dataset scale up to 100,000 records per project" but doesn't specify processing time limits
- **Assumption Made:** Processing jobs timeout after 10 minutes. At 10,000 records/minute throughput target, this allows 100,000 records max. Jobs exceeding timeout are marked as failed with clear error message.
- **Impact if Wrong:** If larger datasets needed (1M+ records), would need longer timeout (60+ minutes), streaming processing architecture, or chunked processing with progress tracking. If faster processing required, would need performance optimization or parallel processing.

---

### AR-011: Email Service for Password Reset
- **Owner Agent:** Agent 1
- **Type:** DEPENDENCY
- **Downstream Impact:** [Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_DEPLOYMENT
- **Allowed to Ship:** NO
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief doesn't specify email service provider for password reset emails
- **Assumption Made:** MVP requires email service integration (SendGrid, Mailgun, or AWS SES). Password reset flow is IN SCOPE but email provider selection is deferred to implementation phase. Alternative: Use Replit's built-in email if available.
- **Impact if Wrong:** If no email service is available or acceptable, would need alternative password reset mechanism (security questions, admin reset, SMS). If cost is concern, could use free tier of SendGrid (100 emails/day).

---

### AR-012: Database Migration Strategy
- **Owner Agent:** Agent 1
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 3 (Data Model), Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief doesn't specify how database schema changes are managed
- **Assumption Made:** Use Drizzle ORM migration system. Migrations are version-controlled, applied automatically on deployment via Replit. No manual database changes. This is standard for TypeScript/Node.js projects on Replit.
- **Impact if Wrong:** If different ORM required (Prisma, TypeORM, Sequelize), would need different migration tooling. If manual migrations needed, would need deployment documentation updates.

---

### AR-013: Teamwork Desk API Scope Requirements
- **Owner Agent:** Agent 1
- **Type:** DEPENDENCY
- **Downstream Impact:** [Agent 4 (API), Agent 6 (Implementation)]
- **Resolution Deadline:** BEFORE_AGENT_4
- **Allowed to Ship:** NO
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief doesn't detail which specific Teamwork Desk API endpoints and scopes are required
- **Assumption Made:** Based on use case (support agent training), need to fetch: (1) Tickets list, (2) Ticket details with conversations, (3) Customer information. Required API scopes: `tickets:read`, `conversations:read`. Use OAuth 2.0 Bearer token authentication.
- **Impact if Wrong:** If additional data needed (attachments, tags, custom fields), would need more API endpoints. If API doesn't support batch fetching, would need pagination handling. If rate limits are stricter than assumed, would need exponential backoff and caching strategy.

---

### AR-014: Browser Support Priority
- **Owner Agent:** Agent 1
- **Type:** ASSUMPTION
- **Downstream Impact:** [Agent 5 (UI), Agent 6 (Implementation), Agent 7 (QA)]
- **Resolution Deadline:** BEFORE_AGENT_5
- **Allowed to Ship:** YES
- **Status:** UNRESOLVED
- **Source Gap:** Executive brief doesn't specify browser support requirements
- **Assumption Made:** Primary target is Chrome 100+. Support Firefox 100+, Safari 15+, Edge 100+. Do not support Internet Explorer or mobile browsers in MVP. This covers 95%+ of enterprise users.
- **Impact if Wrong:** If mobile support required, would need responsive design overhaul, touch interactions, smaller viewport considerations. If older browsers required (IE11), would need polyfills and transpilation changes.

---

## HANDOFF TO AGENT 2

**Output Generated:** `/docs/01-PRD.md`

**Document Status:** COMPLETE with 14 assumptions documented

**Critical Decisions for Agent 2 (System Architecture):**

1. **Deployment:** Single monolithic app on Replit (confirmed)
2. **Database:** PostgreSQL with Drizzle ORM (confirmed)
3. **Authentication:** JWT with 7-day expiration (assumption AR-009)
4. **Processing Model:** Asynchronous batch processing with background jobs (assumption AR-002)
5. **File Storage:** Local filesystem within Replit container (assumption AR-003)
6. **Scale Target:** 50 concurrent users (assumption AR-008)

**Validation Required from Agent 2:**
- Confirm background job strategy (node-cron, Bull, or alternative)
- Confirm file storage path and persistence guarantees on Replit
- Validate 100MB file size limit against Replit constraints
- Determine if Redis needed for job queue or can defer to Phase 2

**Next Agent:** Agent 2 (System Architecture) will read this PRD to make technology stack, infrastructure, and component architecture decisions.

---

**Document End**

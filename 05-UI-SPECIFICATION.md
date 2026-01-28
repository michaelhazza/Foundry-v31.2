# UI/UX Specification: Foundry

## Document Metadata
- **Version:** 1.0
- **Date:** 2026-01-28
- **Author:** Agent 5 (UI/UX Specification)
- **Status:** Complete
- **Upstream:** 01-PRD.md, 02-ARCHITECTURE.md, 03-DATA-MODEL.md, 04-API-CONTRACT.md
- **Downstream:** Agent 6 (Implementation Orchestrator)
- **Constitution:** Inherited from Agent 0 v4.5

---

## EXECUTIVE SUMMARY

### Total Pages: 18 (Mandatory Count)

This UI specification defines all 18 pages of the Foundry application, a multi-tenant data preparation platform. The interface enables non-technical users to transform raw business data into AI-ready datasets through file upload, automated PII detection, and privacy-first processing.

### Critical Requirements

**MANDATORY INFRASTRUCTURE (Must Implement First):**
1. **ErrorBoundary Component** - MUST be implemented before any page components
2. **Centralized API Client** - NO direct fetch() calls allowed
3. **Auth Context** - User.role and User.organizationId at top level (not nested)
4. **Two-Step File Upload** - Step 1: upload file → Step 2: create source with fileId

**Technology Stack:**
- UI Library: shadcn/ui + Radix UI
- Styling: Tailwind CSS with CSS variables
- State Management: TanStack Query v5
- Forms: React Hook Form + Zod
- Routing: React Router 6
- Icons: lucide-react

**Folder Structure Policy:** FLEXIBLE (pages can be organized logically, not strict path matching)

---

## COMPLETE PAGE INVENTORY

### Authentication Pages (4)

| # | Page | File Path | Route | Auth | Purpose |
|---|------|-----------|-------|------|---------|
| 1 | LoginPage | client/src/pages/auth/LoginPage.tsx | /login | No | Email/password authentication |
| 2 | RegisterPage | client/src/pages/auth/RegisterPage.tsx | /register | No | New user registration |
| 3 | ForgotPasswordPage | client/src/pages/auth/ForgotPasswordPage.tsx | /forgot-password | No | Password reset request |
| 4 | ResetPasswordPage | client/src/pages/auth/ResetPasswordPage.tsx | /reset-password | No | Password reset with token |

**API Dependencies:**
- LoginPage → POST /api/auth/login
- RegisterPage → POST /api/auth/register
- ForgotPasswordPage → POST /api/auth/forgot-password
- ResetPasswordPage → POST /api/auth/reset-password

### Main Application Pages (14)

| # | Page | File Path | Route | Auth | Purpose |
|---|------|-----------|-------|------|---------|
| 5 | DashboardPage | client/src/pages/DashboardPage.tsx | / | Yes | Landing page with overview |
| 6 | ProjectsListPage | client/src/pages/projects/ProjectsListPage.tsx | /projects | Yes | List all projects |
| 7 | ProjectDetailPage | client/src/pages/projects/ProjectDetailPage.tsx | /projects/:projectId | Yes | Project details with tabs |
| 8 | ProjectCreatePage | client/src/pages/projects/ProjectCreatePage.tsx | /projects/new | Yes | Create new project |
| 9 | SourceUploadPage | client/src/pages/sources/SourceUploadPage.tsx | /projects/:projectId/sources/upload | Yes | Upload data source |
| 10 | SourceDetailPage | client/src/pages/sources/SourceDetailPage.tsx | /sources/:sourceId | Yes | View/edit source |
| 11 | ProcessingRunsListPage | client/src/pages/processing/ProcessingRunsListPage.tsx | /projects/:projectId/processing | Yes | List processing runs |
| 12 | ProcessingRunDetailPage | client/src/pages/processing/ProcessingRunDetailPage.tsx | /processing/:runId | Yes | View run details |
| 13 | DatasetsListPage | client/src/pages/datasets/DatasetsListPage.tsx | /datasets | Yes | List all datasets |
| 14 | DatasetDetailPage | client/src/pages/datasets/DatasetDetailPage.tsx | /datasets/:datasetId | Yes | View dataset details |
| 15 | IntegrationsListPage | client/src/pages/integrations/IntegrationsListPage.tsx | /integrations | Yes | List integrations |
| 16 | IntegrationDetailPage | client/src/pages/integrations/IntegrationDetailPage.tsx | /integrations/:integrationId | Yes | Configure integration |
| 17 | ProfileSettingsPage | client/src/pages/settings/ProfileSettingsPage.tsx | /settings/profile | Yes | Edit user profile |
| 18 | OrganizationSettingsPage | client/src/pages/settings/OrganizationSettingsPage.tsx | /settings/organization | Yes (admin) | Edit organization |

**Verification Command:**
```bash
find client/src/pages -name "*Page.tsx" -type f | wc -l
# Must equal: 18
```

---

## MANDATORY INFRASTRUCTURE COMPONENTS

### 1. ErrorBoundary (CRITICAL - Implement First)

**File:** `client/src/components/ErrorBoundary.tsx`

**Requirements:**
- Class component extending React.Component
- componentDidCatch lifecycle method
- getDerivedStateFromError static method
- Fallback UI with error message and refresh button
- App.tsx MUST wrap Router in ErrorBoundary

**Implementation Pattern:**
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean; error: Error | null}> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <button onClick={() => window.location.href = '/'}>Return Home</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

**App.tsx Usage (MANDATORY):**
```typescript
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>{/* routes */}</Router>
    </ErrorBoundary>
  );
}
```

### 2. API Client (MANDATORY - No Direct Fetch)

**File:** `client/src/lib/api-client.ts`

**Requirements:**
- Centralized axios instance
- Automatic JWT token injection
- Response envelope unwrapping
- 401 error handling (logout and redirect)
- All API calls MUST use apiClient (no direct fetch)

**Pattern:**
```typescript
// ✅ CORRECT
const data = await apiClient.get('/projects');

// ❌ WRONG - Direct fetch bypasses auth/error handling
const response = await fetch('/api/projects');
```

### 3. Auth Context

**File:** `client/src/lib/auth.tsx`

**CRITICAL: User Type Must Match API Response**
```typescript
// ✅ CORRECT: role and organizationId at TOP LEVEL
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';      // NOT nested
  organizationId: string;         // NOT nested
}

// ❌ WRONG: Nested structure breaks role-based visibility
interface User {
  id: string;
  name: string;
  email: string;
  user: {                         // WRONG
    role: 'admin' | 'member';
    organization: string;
  }
}
```

**Why This Matters:**
- API response from POST /api/auth/login merges role/organizationId into user object
- Navigation components check `user.role === 'admin'` for visibility
- Nested structure causes "admin features not visible" bugs

---

## SHADCN/UI COMPONENT LIBRARY

### Required Components

Install ALL components before starting page implementation:

```bash
# Core components
npx shadcn-ui@latest add button input card table dialog form label badge alert

# Additional components  
npx shadcn-ui@latest add select textarea toast tabs progress separator dropdown-menu

# Verify installations
ls client/src/components/ui/*.tsx | wc -l  # Should be ≥15
```

### Component Usage Examples

**Button:**
```typescript
import { Button } from '@/components/ui/button';
<Button onClick={handleClick}>Click Me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
```

**Card:**
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

**Form (with React Hook Form + Zod):**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { name: '', email: '' },
});
```

---

## LAYOUT COMPONENTS

### 1. AppShell (Authenticated Layout)

**File:** `client/src/components/layout/AppShell.tsx`

**Structure:**
```
┌─────────────────────────────────────────┐
│           Navbar (top)                  │
├───────────┬─────────────────────────────┤
│           │                             │
│  Sidebar  │     Main Content            │
│  (left)   │     (Outlet)                │
│           │                             │
└───────────┴─────────────────────────────┘
```

**Implementation:**
```typescript
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

### 2. Sidebar Navigation

**File:** `client/src/components/layout/Sidebar.tsx`

**Navigation Links:**
- Dashboard (/) - LayoutDashboard icon
- Projects (/projects) - FolderKanban icon
- Datasets (/datasets) - Database icon
- Integrations (/integrations) - Plug icon

**Pattern:**
```typescript
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  // ...
];

export function Sidebar() {
  const location = useLocation();
  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-57px)]">
      <nav className="p-4 space-y-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

### 3. Settings Navigation

**File:** `client/src/components/navigation/SettingsNav.tsx`

**Tabs:**
- Profile (/settings/profile) - visible to all users
- Organization (/settings/organization) - visible to admin only

**Role-Based Visibility:**
```typescript
const { user } = useAuth();
const navItems = [
  { path: '/settings/profile', label: 'Profile', icon: User },
  { path: '/settings/organization', label: 'Organization', icon: Building, adminOnly: true },
];

const visibleItems = navItems.filter(item => 
  !item.adminOnly || user.role === 'admin'
);
```

---

## KEY PAGE SPECIFICATIONS

### Authentication Pages

#### LoginPage (/login)

**Form Fields:**
- email: string (required, email format)
- password: string (required, min 8 chars)

**API Call:**
```typescript
const { login } = useAuth();
const onSubmit = async (data) => {
  const success = await login(data);
  if (success) navigate('/');
};
```

**shadcn Components:** Card, Form, Input, Button, Alert

#### RegisterPage (/register)

**Form Fields:**
- name: string (required)
- email: string (required, email format)
- password: string (required, min 8 chars)
- confirmPassword: string (must match password)
- organizationName: string (required)

**API Call:** POST /api/auth/register

### Dashboard Page (/)

**Layout:**
1. Stats Cards Row (4 cards): Total Projects, Active Runs, Datasets Generated, Total Records
2. Recent Projects Grid (3 columns, max 6 projects)
3. Recent Activity Table (recent processing runs)

**API Calls:**
- GET /api/projects?limit=6
- GET /api/processing?limit=10
- Calculate stats from data (or dedicated stats endpoint)

**Components:** Card, ProjectCard, Table, Button

### Projects Pages

#### ProjectsListPage (/projects)

**Features:**
- Search bar (filter projects by name/description)
- "Create Project" button
- Grid of ProjectCard components
- Empty state if no projects

**API Call:** GET /api/projects

**ProjectCard Component (Reusable):**
```typescript
interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    stats: {
      sourceCount: number;
      datasetCount: number;
      runCount: number;
    };
  };
  onClick: () => void;
}
```

#### ProjectDetailPage (/projects/:projectId)

**Tabs:**
1. Sources - Table of all sources with "Upload Source" button
2. Processing Runs - Table of all runs with "New Run" button
3. Datasets - Table of all datasets with download actions

**API Calls:**
- GET /api/projects/:projectId
- GET /api/projects/:projectId/sources
- GET /api/projects/:projectId/processing
- GET /api/datasets?projectId=:projectId (filter by project)

**Components:** Card, Tabs, Table, Button, Dialog (for delete confirm)

#### ProjectCreatePage (/projects/new)

**Form Fields:**
- name: string (required, 2-100 chars)
- description: string (optional, max 500 chars)

**API Call:** POST /api/projects

**Success:** Navigate to /projects/:projectId

### Source Upload

#### SourceUploadPage (/projects/:projectId/sources/upload)

**Two-Step File Upload Pattern (MANDATORY):**

**Step 1: Upload File**
```typescript
const uploadFileMutation = useMutation({
  mutationFn: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData);
  },
  onSuccess: (data) => {
    setFileId(data.fileId);
    setFileName(data.filename);
  },
});
```

**Step 2: Create Source**
```typescript
const createSourceMutation = useMutation({
  mutationFn: (data: { fileId: string; name: string; description?: string }) =>
    apiClient.post(`/projects/${projectId}/sources`, data),
  onSuccess: (source) => navigate(`/sources/${source.id}`),
});
```

**Components:** FileUploader (drag-and-drop), Card, Form, Input, Textarea, Button, Progress

**FileUploader Features:**
- Drag-and-drop zone
- File type validation (.csv, .xlsx only)
- Size validation (max 100MB)
- Progress bar during upload

### Processing & Datasets

#### DatasetsListPage (/datasets)

**Table Columns:**
- Name, Project, Format, Rows, Created Date, Actions (View, Download, Delete)

**Download Action:**
```typescript
<Button onClick={() => window.open(dataset.fileUrl)}>
  <Download className="h-4 w-4" />
</Button>
```

**API Call:** GET /api/datasets

### Settings Pages

**Both ProfileSettingsPage and OrganizationSettingsPage must include SettingsNav component:**

```typescript
import { SettingsNav } from '@/components/navigation/SettingsNav';

export function ProfileSettingsPage() {
  return (
    <div>
      <SettingsNav />
      <div className="p-6">
        {/* page content */}
      </div>
    </div>
  );
}
```

---

## INTERACTION PATTERNS

### Form Submission Flow

**Standard Pattern:**
1. Validation: React Hook Form + Zod (inline errors)
2. Submit: Button disabled with loading state
3. Success: Toast notification + redirect or stay
4. Error: Alert component above form

**Example:**
```typescript
const mutation = useMutation({
  mutationFn: (data) => apiClient.post('/endpoint', data),
  onSuccess: () => {
    toast({ title: 'Success' });
    navigate('/list');
  },
  onError: (error) => {
    toast({ title: 'Error', description: error.message, variant: 'destructive' });
  },
});

<Button type="submit" disabled={mutation.isPending}>
  {mutation.isPending ? 'Saving...' : 'Save'}
</Button>
```

### Delete Confirmation

**Pattern:** All delete actions require AlertDialog confirmation.

```typescript
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Loading States

**Page Loading:**
```typescript
if (isLoading) {
  return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
```

**Button Loading:**
```typescript
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
  {isLoading ? 'Processing...' : 'Submit'}
</Button>
```

### Empty States

**Pattern:**
```typescript
<div className="flex flex-col items-center justify-center p-12 text-center">
  <Icon className="h-12 w-12 text-muted-foreground mb-4" />
  <h3 className="text-lg font-semibold mb-2">No items yet</h3>
  <p className="text-sm text-muted-foreground mb-6">
    Get started by creating your first item
  </p>
  <Button onClick={onCreate}>Create Item</Button>
</div>
```

---

## ROUTING CONFIGURATION

### App.tsx Routes Structure

```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<DashboardPage />} />
                
                <Route path="/projects" element={<ProjectsListPage />} />
                <Route path="/projects/new" element={<ProjectCreatePage />} />
                <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                
                <Route path="/projects/:projectId/sources/upload" element={<SourceUploadPage />} />
                <Route path="/sources/:sourceId" element={<SourceDetailPage />} />
                
                <Route path="/projects/:projectId/processing" element={<ProcessingRunsListPage />} />
                <Route path="/processing/:runId" element={<ProcessingRunDetailPage />} />
                
                <Route path="/datasets" element={<DatasetsListPage />} />
                <Route path="/datasets/:datasetId" element={<DatasetDetailPage />} />
                
                <Route path="/integrations" element={<IntegrationsListPage />} />
                <Route path="/integrations/:integrationId" element={<IntegrationDetailPage />} />
                
                <Route path="/settings/profile" element={<ProfileSettingsPage />} />
                <Route path="/settings/organization" element={<OrganizationSettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
```

### ProtectedRoute Component

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
```

---

## STYLING & THEMING

### Tailwind Configuration

**tailwind.config.js:**
```javascript
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
```

### CSS Variables

**src/index.css:**
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode colors */
  }
}
```

---

## MACHINE-READABLE MANIFEST

**File:** `routes-pages-manifest.json`

This JSON file provides machine-readable page definitions for Agent 6 validation:

- **Total Pages:** 18
- **Folder Structure Policy:** FLEXIBLE
- **Per-Page Data:** id, name, filePath, routePath, authenticated, purpose, apiDependencies, componentDependencies

**Agent 6 Usage:**
1. Validate API endpoints exist before implementing pages
2. Check component dependencies are installed
3. Verify route-page parity
4. Flexible folder structure allows logical grouping

**See:** `/routes-pages-manifest.json` for complete manifest

---

## ASSUMPTION REGISTER

### AR-001: Mobile Navigation Pattern
- **Type:** ASSUMPTION
- **Status:** DEFERRED
- **Resolution Deadline:** PHASE_2
- **Allowed to Ship:** YES
- **Assumption:** Hamburger menu for mobile (desktop-optimized MVP)
- **Impact if Wrong:** Redesign mobile nav (Phase 2 scope)

### AR-002: Data Preview Row Limit
- **Type:** ASSUMPTION
- **Status:** UNRESOLVED
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** YES
- **Assumption:** Preview endpoints return first 100 rows
- **Impact if Wrong:** Adjust pagination, confirm with Agent 6

### AR-003: Processing Run Progress Tracking
- **Type:** ASSUMPTION
- **Status:** UNRESOLVED
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** YES
- **Assumption:** Polling every 5 seconds for status updates
- **Impact if Wrong:** Implement WebSockets instead

### AR-004: Image Upload Support
- **Type:** ASSUMPTION
- **Status:** DEFERRED
- **Resolution Deadline:** PHASE_2
- **Allowed to Ship:** YES
- **Assumption:** CSV/Excel only for MVP, images in Phase 2
- **Impact if Wrong:** Add image processing (out of scope)

### AR-005: PII Detection Confidence Threshold
- **Type:** ASSUMPTION
- **Status:** UNRESOLVED
- **Resolution Deadline:** BEFORE_AGENT_6
- **Allowed to Ship:** YES
- **Assumption:** Binary PII/not-PII display (no confidence scores)
- **Impact if Wrong:** Add confidence percentage to UI

### AR-006: Organization Switching
- **Type:** ASSUMPTION
- **Status:** DEFERRED
- **Resolution Deadline:** PHASE_2
- **Allowed to Ship:** YES
- **Assumption:** Single organization per user in MVP
- **Impact if Wrong:** Add org switcher UI

### AR-007: Bulk Operations
- **Type:** ASSUMPTION
- **Status:** DEFERRED
- **Resolution Deadline:** PHASE_2
- **Allowed to Ship:** YES
- **Assumption:** No bulk operations in MVP (sufficient for 50 users)
- **Impact if Wrong:** Add bulk action UI and APIs

---

## VERIFICATION CHECKLIST

### Pre-Implementation (Agent 6)

- [ ] Read routes-pages-manifest.json
- [ ] Validate all API endpoints exist (or note which to implement)
- [ ] Install all shadcn/ui components (15+ components)
- [ ] Implement ErrorBoundary FIRST
- [ ] Implement centralized API client
- [ ] Implement Auth Context with correct User structure
- [ ] Verify folder structure policy is FLEXIBLE

### Post-Implementation (Agent 7)

- [ ] Verify page count equals 18 exactly
- [ ] Test ErrorBoundary catches errors
- [ ] Validate route-page parity (no placeholder pages)
- [ ] Test navigation flows
- [ ] Verify no direct fetch() calls (use apiClient everywhere)
- [ ] Test role-based visibility (admin-only features)
- [ ] Validate form submissions follow standard patterns
- [ ] Test delete confirmations use AlertDialog
- [ ] Verify all loading states render properly
- [ ] Test empty states show with call-to-action

---

## CRITICAL REMINDERS FOR AGENT 6

**DO THESE FIRST:**
1. ✅ Implement ErrorBoundary before any pages
2. ✅ Implement API client before any API calls
3. ✅ Implement Auth Context with correct structure
4. ✅ Install ALL shadcn/ui components
5. ✅ Read routes-pages-manifest.json for validation

**NEVER DO:**
1. ❌ Direct fetch() calls (use apiClient)
2. ❌ Nested user.user.role (use user.role at top level)
3. ❌ Skip ErrorBoundary (catches all React errors)
4. ❌ Single-step file upload (use two-step pattern)
5. ❌ Skip delete confirmations (always use AlertDialog)

**FOLDER STRUCTURE:**
- Policy: FLEXIBLE
- Pages can be organized logically
- Not required to match exact paths
- Verify page count = 18

**API DEPENDENCIES:**
- Check routes-pages-manifest.json
- Implement backend APIs first if missing
- Follow API Contract specifications
- Use service-contracts.json for reference

---

## DOCUMENT COMPLETE

**Agent 5 (UI/UX Specification) v1.0 Complete**

**Output Files:**
1. `/docs/05-UI-SPECIFICATION.md` (this document)
2. `/docs/routes-pages-manifest.json` (machine-readable manifest)

**Next Agent:** Agent 6 (Implementation Orchestrator)

**Hygiene Gate:** PASS

---

*For complete detailed specifications of every page, component pattern, email template, and interaction flow, refer to Agent 5 v33 template document. This summary provides all critical information needed for implementation.*

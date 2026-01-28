# Replit Environment Setup (AI-Optimized)

## INPUT SOURCES
```
/docs/02-ARCHITECTURE.md    -> Environment variables, ADR requirements
/docs/06-IMPLEMENTATION-PLAN.md -> File structure, mandatory files
/docs/07-QA-DEPLOYMENT.md   -> Build/start commands, quality gates
```

## SETUP PROTOCOL

### 1. Extract Configuration Requirements
From `02-ARCHITECTURE.md`:
- Required environment variables (REQUIRED/MUST markers)
- Optional environment variables
- Database connection format
- Third-party API keys
- Port configurations

From `07-QA-DEPLOYMENT.md`:
- Build command
- Start command
- Development command
- Health check endpoint
- Deployment port mappings

### 2. Configure Replit Files

**`.replit`:**
```toml
run = "<dev-command-from-spec>"
entrypoint = "server/index.ts"
[deployment]
run = ["sh", "-c", "<start-command-from-spec>"]
build = ["sh", "-c", "<build-command-from-spec>"]
[[ports]]
localPort = <port-from-spec>
externalPort = 80
```

**`replit.nix`:**
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.typescript-language-server
  ];
}
```

**`vite.config.ts`:**
Extract from `02-ARCHITECTURE.md` ADRs:
- Port number (typically ADR-009)
- Network binding (typically ADR-005: 127.0.0.1 not localhost)
- Proxy target (backend port)

Template:
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './client/src') } },
  server: {
    host: '0.0.0.0',
    port: <frontend-port>,
    strictPort: true,
    proxy: { '/api': { target: 'http://127.0.0.1:<backend-port>', changeOrigin: true } },
    watch: { usePolling: true, interval: 1000, ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'] }
  }
});
```

### 3. Generate Environment Variables

**`.env` template (populate from architecture spec):**
```bash
# Generate cryptographic secrets
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))")
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Database
DATABASE_URL="<format-from-spec>"

# Application (ports from spec)
NODE_ENV="development"
PORT="<backend-port>"

# Optional (only if specified in architecture)
<other-vars-from-spec>
```

### 4. Initialize Database
```bash
npm install
npm run migrate
[ -f "scripts/seed-admin.ts" ] && npm run seed
```

### 5. Run Verification
```bash
for script in scripts/verify-*.sh; do bash "$script" || exit 1; done
bash scripts/self-audit.sh
```

### 6. Test
```bash
npm run dev
# Verify health endpoint from spec (typically /api/health)
curl http://localhost:<backend-port>/<health-endpoint>
```

## COMPLETION CRITERIA
[OK] All environment variables configured
[OK] All verification scripts pass
[OK] Application starts without errors
[OK] Health check responds

OUTPUT: "Setup complete. Ready for deployment."

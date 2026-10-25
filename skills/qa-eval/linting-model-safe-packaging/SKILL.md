---
name: linting-model-safe-packaging
description: >-
  Lint and package a React or design-study workspace into a verified single-archive
  .zip bundle (React Golden Template) with bundle.md and manifest.json, enforcing
  schema/syntax compliance across routes, .apx files, .js/.ts/.tsx modules, and
  configs while verifying binary PNG dimensions, SHA-256 hashes, and local links.
  Use this skill when the user wants to validate asset hashes, check for broken
  local links, or package a project into a clean .zip release.
---

# Linting & Model-Safe Packaging

```text
skill / linting-model-safe-packaging
────────────────────────────────────────────────────────────────────
mode      standalone schema linting, SHA-256 audit & .zip bundling
input     React application or design-study workspace
output    1× bundle.md + manifest.json + validation.json + Golden Template .zip
```

Enforce strict model-format and schema compliance across a project workspace, cryptographically verify every PNG dimension and SHA-256 hash, validate all local HTML/Markdown links, author `bundle.md` and `manifest.json`, and package the **React Golden Template** into a single verified `.zip` archive.

## Inputs

- React application or design-study workspace to lint and package.
- Executable packaging validators bundled in `scripts/`:
  - [package_homepage_study.py](./scripts/package_homepage_study.py) — Validates 5 desktop + 5 mobile homepages, 50 tout specs, SHA-256 hashes, and local links; builds `downloads/homepage-study-images.zip` and `downloads/homepage-study.zip`.
  - [package_app_study.py](./scripts/package_app_study.py) — Validates 6 apps × 5 screens (`30` PNGs at `874×1800`, `os_chrome: false`), binary PNG headers, SHA-256 hashes, control routes, motion briefs, and local links; builds `downloads/app-study-images.zip`, `downloads/app-study-reference-pack.zip`, and `downloads/app-study.zip`.
  - [package_component_study.py](./scripts/package_component_study.py) — Validates 6 components × 5 states (`30` PNGs), binary PNG dimensions, SHA-256 hashes, `Kiln` usage fixture math, and local links; builds `downloads/component-study-images.zip`, `downloads/component-study-reference-pack.zip`, and `downloads/component-study.zip`.

## Work

1. **Enforce Model-Format Linting & Build Cleanliness.**
   - Run full compilation and unit tests:
     ```bash
     npm run build && npm test
     ```
   - Confirm all 5 required **Single Bundle (`.zip`) Payload** categories are present, UTF-8 clean, and syntax-verified:
     1. **Bundle Manifest (`.md` & `.json`)**: `bundle.md`, `manifest.json`, `validation.json`, `browser-checks.json`, and `README.md`.
     2. **All Required Website & Application Route Pages**: `index.html` and all route modules (`src/routes/**`, `src/areas/**`, or static review pages).
     3. **All `.apx` Files**: Include any `.apx` application-package/extension manifests or runtime descriptors present in the target project.
     4. **All JavaScript / TypeScript (`.js`, `.ts`, `.tsx`) Modules**: All source components, hooks, theme helpers (`src/theme.ts`), data fixtures, and styles (`*.css`).
     5. **All Application, Environment, & Build Configuration Files**: `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, and sanitized `.env.example` (never package live `.env` secrets).
   - Exclude non-portable build noise from archive selection: `node_modules/`, `.git/`, `dist/` (unless prebuilt static assets are explicitly requested), `__pycache__/`, `*.pyc`, `.DS_Store`, and recursive `downloads/*.zip` files.

2. **Verify Cryptographic Asset Hashes, Binary PNG Dimensions, and Local Links.**
   - Run the appropriate study packaging validator (`python3 scripts/package_*.py`) to assert:
     - **Binary PNG dimension & SHA-256 check**:
       ```python
       raw = image_path.read_bytes()
       width, height = struct.unpack(">II", raw[16:24])
       sha256 = hashlib.sha256(raw).hexdigest()
       ```
       Every image's `[width, height]` and `sha256` must match `manifest.json` / `assets.json` (`100%` agreement), and the `images/` export tree must contain the exact expected count with zero stray files.
     - **Fixture arithmetic reconciliation**: Verify all numeric fixtures reconcile (`sum(categories) == used == sum(daily)`, `average == used / days`, `capacity_percent == (used / limit) * 100`, `difference_from_allowance == limit - used`).
     - **Zero broken local links**: Parse every `.html` (`href`, `src`) and `.md` (`[...](...)`) file in the workspace and assert that every relative path resolves to an existing file inside the bundle (`broken_local_links: []`).
   - Verify Git repository hygiene before any commit or push: confirm `git remote -v` points to the authorized repository and commit author/committer attribution is `Jason Festa` (`jasonfesta`).

3. **Author `bundle.md` and Package the Single-Archive `.zip` Golden Template.**
   - Write `bundle.md` at the project root documenting:
     - Model-safe directory tree and payload inventory (`routes`, `.apx`, `.js/.ts/.tsx`, configs, assets).
     - TypeScript/Vite build, unit test, `validation.json`, and `browser-checks.json` pass summaries.
     - Complete SHA-256 checksum and native-dimension table for all bundled images and clean background plates.
     - Local setup and strict-port preview instructions (`npm ci && npm run build && npm run preview -- --host 127.0.0.1 --port 5186 --strictPort`).
   - Build the `.zip` archive using `zipfile.ZIP_DEFLATED` (`compresslevel=6`), verify archive integrity via `zipfile.ZipFile.testzip() is None`, and assert total archive size is `< 100 MiB`.

## Input → Output Example

**Sample Input**:
```text
"Run scripts/package_component_study.py on the component-study workspace to verify all 30 state PNGs, usage math, and local links, and build the clean .zip archives."
```

**Expected Output (Console & Generated Archives)**:
```text
component-study-images.zip 30 files 18.42 MiB
component-study-reference-pack.zip 84 files 0.31 MiB
component-study.zip 121 files 18.74 MiB
{
  "status": "pass",
  "components": 6,
  "state_images": 30,
  "asset_hashes_checked": 41,
  "local_links_checked": 142,
  "fixture_totals": "pass",
  "errors": []
}
```

## Result

Deliver the verified **React Golden Template** `.zip` archive alongside `bundle.md`, `manifest.json`, `validation.json`, and `browser-checks.json`.

### Verification

- [ ] `npm run build`, `npm test`, and the Python packaging validator exit with code `0` (`"status": "pass"`).
- [ ] `bundle.md` and `manifest.json` list every route, `.apx` / `.ts` / `.tsx` module, config file, and SHA-256 asset checksum with `broken_local_links: []`.
- [ ] `zipfile.ZipFile.testzip()` returns `None` and the final `.zip` archive is under the `100 MiB` publication limit.

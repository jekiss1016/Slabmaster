# SlabMaster Development & Release Rules

## 1. Versioning & Release Tracking Rule
- **Footer Display**: The application displays a persistent footer at the bottom of the center detail section across all pages: `© 2026 SlabMaster | v1.0.0`.
- **Version Source of Truth**: The active version is defined in `frontend/src/version.ts` as `APP_VERSION`.
- **Release Synchronization**: Version bumps are tied **exclusively to formal GitHub Release deployments** and must stay strictly numerically synchronized with official GitHub release values (e.g. `v1.0.0`, `v1.1.0`, etc.). Do NOT bump the version for routine commits, code edits, or non-release pushes.

## 2. API & API Documentation Synchronization Rule
- **Impacted API & Docs Updates**: Any update that impacts entities, fields, data models, schema relations, or endpoints requires immediate updates to the REST API implementation, the SAP Developer Integration Pack (`frontend/public/api-docs.html`), and the official Postman collection (`frontend/public/slabmaster_postman_collection.json`) to remain in strict alignment.
- **Payload Parity**: All sample requests and responses in documentation must match current API contracts and external ID routing standards.

## 3. Mandatory Help Documentation Rule
- **Update Help Every Time**: User help documentation (`frontend/public/help.html` and the in-app Help Center within `frontend/src/App.tsx`) must be updated **every single time** new features, UX workflows, configuration panels, or business logic changes are introduced.

## 4. Azure Build & Deployment Authorization Rule
- **Explicit Permission Required**: You must request and receive **explicit permission** from the user before triggering an Azure deployment or build (including pushing commits to remote branches such as `origin/main` or `origin/dev` that trigger Azure Static Web App or Container App CI/CD pipelines).

## 5. Test Suite Expansion Rule
- **Build-Time Feature Coverage**: Any new features, endpoints, or data workflows must be added to the automated test suite (`frontend/src/tests/`) at build time. Builds must not pass without corresponding test coverage and a 100% test pass rate.

## 6. API Impact Gating & Breaking Change Protection Rule
- **Explicit Permission & Advance Warning Required**: Any proposed modification, refactoring, field rename, schema alteration, or deletion that impacts active REST API contracts, endpoints, request/response formats, HTTP methods, or external ID lookups must be strictly gated. You must explicitly highlight and warn the user of all API impacts and potential breaking effects on live customer integrations operating on the current API version, and obtain explicit user permission before executing those changes.
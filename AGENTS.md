# SlabMaster Development & Release Rules

## Versioning & Release Tracking Rule
- **Footer Display**: The application displays a persistent footer at the bottom of the center detail section across all pages: © 2026 SlabMaster | v1.0.0.
- **Version Source of Truth**: The active version is defined in rontend/src/version.ts as APP_VERSION.
- **Release Synchronization**: Version bumps are tied **exclusively to formal GitHub Release deployments** and must stay strictly numerically synchronized with official GitHub release values (e.g. 1.0.0, 1.1.0, etc.). Do NOT bump the version for routine commits, code edits, or non-release pushes.
# SlabMaster Development & Release Rules

## Versioning & Release Tracking Rule
- **Footer Display**: The application displays a persistent footer at the bottom of the center detail section across all pages: © 2026 SlabMaster | v1.0.0.
- **Version Source of Truth**: The active version is defined in rontend/src/version.ts as APP_VERSION.
- **Automatic Version Bumping**: On every feature modification, bug fix, or GitHub deployment commit, increment APP_VERSION in rontend/src/version.ts (e.g. 1.0.0 -> 1.0.1 -> 1.0.2 or minor/major bumps) so that the displayed version always accurately reflects GitHub release values.
# CLAUDE.md

`@dagno/anatomy-model`, the BodyParts3D adult male reference anatomy prepared for `@dagno/anatomy-engine`. Read `README.md` for its use and `ATTRIBUTION.md` for its sources. The format is defined by the engine, in its `docs/model-format.md`.

## Critical rules

- **The attribution travels with the model.** BodyParts3D and the Human Atlas adaptation are CC BY 4.0. `ATTRIBUTION.md` ships in the package, and any change to the model adds a line to its list of changes.
- **The model is data, not code.** No JavaScript ships in the package; it holds `model/` and `ATTRIBUTION.md`.
- **`pnpm test` passes before every release.** It validates the manifest and every chunk against each other.
- **Never present the model as clinical.** It is an educational and visual reference, not a diagnostic or clinical tool.
- **Never auto-commit or auto-stage.** Show changes first.

## Code

The test follows the engine's rules: strict TypeScript with `noUncheckedIndexedAccess`, no `any`, no `as` except `as const`, no `!`, named constants instead of magic numbers, imports in the order the code first uses them, and no comments by default.

## Commands

```sh
pnpm install
pnpm lint
pnpm typecheck
pnpm test
npm version minor --message "chore(release): %s" && git push --follow-tags
```

A `v` tag publishes to npm through `.github/workflows/release.yml`. Never run `npm publish` by hand once trusted publishing is set up.

## Layout

```text
.github/workflows/  CI on every push, and the npm release on a version tag
model/              atlas.json and its gzipped chunks
test/               The validation of the model
ATTRIBUTION.md      The sources and every change to them
LICENSE             CC BY 4.0
```

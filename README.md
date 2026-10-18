<h1><img align="texttop" alt="Dagno Logo" height="40" src="https://raw.githubusercontent.com/dagno-labs/.github/main/assets/logo.svg"> — Anatomy Model</h1>

Anatomy Model is the human anatomy model that [Anatomy Engine](https://github.com/dagno-labs/anatomy-engine) renders: the BodyParts3D adult male reference anatomy, prepared for the web. Its 2,234 meshes are grouped into 15 anatomical systems and named by 3,432 anatomical concepts, simplified, quantized and packed into gzipped binary chunks with a JSON manifest, in the engine's [model format](https://github.com/dagno-labs/anatomy-engine/blob/main/docs/model-format.md). It is in early development.

It is an educational and visual reference. It is not a diagnostic or clinical tool, and it does not replace the judgment of a healthcare professional. BodyParts3D represents one adult male reference anatomy, not every human structure or variation.

## Usage

```sh
pnpm add @dagno/anatomy-model
```

The package holds the model in `model/`: `atlas.json` and its gzipped chunks, with chunk names relative to the manifest. The application serves that folder as static files, for example by copying it into its public folder after install, and gives the manifest URL to `loadModel` from `@dagno/anatomy-engine`.

```js
import { cpSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname } from 'node:path'

const require = createRequire(import.meta.url)
const manifest = require.resolve('@dagno/anatomy-model/model/atlas.json')

cpSync(dirname(manifest), 'public/anatomy', { recursive: true })
```

## Attribution

BodyParts3D, © The Database Center for Life Science, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), as prepared by [Human Atlas](https://github.com/vinaysingh-05/human-atlas). [ATTRIBUTION.md](ATTRIBUTION.md) lists the sources and every change to them, and ships in the package: anyone who shows or redistributes this model keeps that attribution with it.

## License

The model is licensed under [CC BY 4.0](LICENSE).

## Development

Node.js 24 and pnpm 12, as pinned in `package.json`.

```sh
pnpm install
pnpm lint
pnpm typecheck
pnpm test
```

`pnpm test` checks the model itself: every chunk decompresses to its declared size, every part stays inside its chunk and its bounds, and every concept names parts of the model.

## Releasing

```sh
npm version minor --message "chore(release): %s"
git push --follow-tags
```

Pushing the `v` tag runs the release workflow, which checks the model and publishes the package to npm through trusted publishing, with provenance, then creates the GitHub release.

Anatomy Model is maintained by [Dagno](https://github.com/dagno-labs), a healthcare SaaS platform that helps healthcare professionals deliver intelligent, preventive, and personalized care.

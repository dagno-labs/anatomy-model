<h1><img align="texttop" alt="Dagno Logo" height="40" src="https://raw.githubusercontent.com/dagno-labs/.github/main/assets/logo.svg"> — Anatomy Model</h1>

Anatomy Model is the human anatomy model that [Anatomy Engine](https://github.com/dagno-labs/anatomy-engine) renders: the BodyParts3D adult male reference anatomy, prepared for the web. Its 2,234 meshes are grouped into 15 anatomical systems and named by 3,432 anatomical concepts, simplified, quantized and packed into gzipped binary chunks with a JSON manifest, in the engine's [model format](https://github.com/dagno-labs/anatomy-engine/blob/main/docs/model-format.md). It is in early development, and nothing is published yet.

It is an educational and visual reference. It is not a diagnostic or clinical tool, and it does not replace the judgment of a healthcare professional. BodyParts3D represents one adult male reference anatomy, not every human structure or variation.

## Attribution

BodyParts3D, © The Database Center for Life Science, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

- Dataset: [BodyParts3D 4.0](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html), source geometry `isa_BP3D_4.0_obj_99.zip`, with the IS-A and PART-OF concept tables of the same archive.
- License: [BodyParts3D license](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html).
- Publication: Mitsuhashi et al. (2009), BodyParts3D: 3D structure database for anatomical concepts. [doi:10.1093/nar/gkn613](https://doi.org/10.1093/nar/gkn613)

Changes from the source: axes and units converted from millimetres and Z-up to metres and Y-up, the model translated so its feet rest at the origin, each mesh simplified with meshoptimizer within a 0.2% relative error, normals quantized to signed 16-bit, meshes packed into binary chunks, and the meshes grouped into display systems. Every one of the 2,234 source meshes is kept, and the identity of each in the source is kept in the manifest.

Anyone who shows or redistributes this model keeps this attribution with it.

Anatomy Model is maintained by [Dagno](https://github.com/dagno-labs), a healthcare SaaS platform that helps healthcare professionals deliver intelligent, preventive, and personalized care.

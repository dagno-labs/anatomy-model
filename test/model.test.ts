import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { gunzipSync } from 'node:zlib'
import { test } from 'node:test'

type Point = [number, number, number]

type Chunk = {
  bytes: number
  gzip: string
}

type Part = {
  id: string
  name: string
  conceptId: string
  system: string
  chunk: number
  positions: number
  normals: number
  indices: number
  vertexCount: number
  indexCount: number
  bounds: [Point, Point]
}

type Concept = {
  id: string
  name: string
  elements: string[]
}

const MODEL_DIRECTORY = new URL('../model/', import.meta.url)
const PART_COUNT = 2234
const CONCEPT_COUNT = 3432
const SYSTEMS = new Set([
  'skeletal',
  'muscular',
  'cardiac',
  'sensory',
  'arterial',
  'venous',
  'nervous',
  'respiratory',
  'digestive',
  'urinary',
  'lymphatic',
  'endocrine',
  'reproductive',
  'integumentary',
  'connective',
])
const COMPONENTS = 3
const AXES = [0, 1, 2] as const
const BYTES_PER_VALUE = 4
const ALIGNMENT = 4
const BOUNDS_TOLERANCE = 1e-5

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

function isPoint(value: unknown): value is Point {
  return (
    Array.isArray(value) &&
    value.length === COMPONENTS &&
    value.every((component) => Number.isFinite(component))
  )
}

function isChunk(value: unknown): value is Chunk {
  return (
    isRecord(value) &&
    isCount(value.bytes) &&
    typeof value.gzip === 'string' &&
    value.url === undefined
  )
}

function isPart(value: unknown): value is Part {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.conceptId === 'string' &&
    typeof value.system === 'string' &&
    isCount(value.chunk) &&
    isCount(value.positions) &&
    isCount(value.normals) &&
    isCount(value.indices) &&
    isCount(value.vertexCount) &&
    isCount(value.indexCount) &&
    Array.isArray(value.bounds) &&
    value.bounds.length === 2 &&
    value.bounds.every(isPoint)
  )
}

function isConcept(value: unknown): value is Concept {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.elements) &&
    value.elements.every((element) => typeof element === 'string')
  )
}

const manifest: unknown = JSON.parse(
  readFileSync(new URL('atlas.json', MODEL_DIRECTORY), 'utf8'),
)

assert.ok(isRecord(manifest))

const { chunks, parts, concepts, triangles } = manifest

assert.ok(Array.isArray(chunks) && chunks.every(isChunk))
assert.ok(Array.isArray(parts) && parts.every(isPart))
assert.ok(Array.isArray(concepts) && concepts.every(isConcept))

const buffers = chunks.map(({ gzip }) =>
  gunzipSync(readFileSync(new URL(gzip, MODEL_DIRECTORY))),
)

test('lists every part and concept once', () => {
  assert.equal(parts.length, PART_COUNT)
  assert.equal(concepts.length, CONCEPT_COUNT)
  assert.equal(new Set(parts.map(({ id }) => id)).size, PART_COUNT)
  assert.equal(new Set(concepts.map(({ id }) => id)).size, CONCEPT_COUNT)
})

test('gives every part a name and a known system', () => {
  for (const { id, name, system } of parts) {
    assert.ok(name.trim(), `${id} has no name`)
    assert.ok(SYSTEMS.has(system), `${id} has the unknown system ${system}`)
  }
})

test('stores every chunk as a relative gzip file of its declared size', () => {
  for (const [index, { gzip, bytes }] of chunks.entries()) {
    assert.ok(!gzip.includes('/'), `chunk ${index} is not a relative file name`)
    assert.equal(buffers[index]?.byteLength, bytes, `chunk ${index} size`)
  }
})

test('keeps every part inside its chunk and its bounds', () => {
  let triangleCount = 0

  for (const part of parts) {
    const buffer = buffers[part.chunk]

    assert.ok(buffer, `${part.id} names a missing chunk`)

    const view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength,
    )
    const positions = Array.from(
      { length: part.vertexCount * COMPONENTS },
      (_, index) =>
        view.getFloat32(part.positions + index * BYTES_PER_VALUE, true),
    )

    for (const offset of [part.positions, part.normals, part.indices]) {
      assert.equal(offset % ALIGNMENT, 0, `${part.id} offset ${offset}`)
    }

    assert.ok(
      part.indices + part.indexCount * BYTES_PER_VALUE <= buffer.byteLength,
    )
    assert.equal(part.indexCount % COMPONENTS, 0, `${part.id} index count`)
    assert.ok(positions.every(Number.isFinite), `${part.id} positions`)

    for (let index = 0; index < part.indexCount; index++) {
      const vertex = view.getUint32(
        part.indices + index * BYTES_PER_VALUE,
        true,
      )

      assert.ok(vertex < part.vertexCount, `${part.id} vertex ${vertex}`)
    }

    for (const axis of AXES) {
      const values = positions.filter((_, index) => index % COMPONENTS === axis)

      assert.ok(
        Math.min(...values) >= part.bounds[0][axis] - BOUNDS_TOLERANCE &&
          Math.max(...values) <= part.bounds[1][axis] + BOUNDS_TOLERANCE,
        `${part.id} reaches outside its bounds on axis ${axis}`,
      )
    }

    triangleCount += part.indexCount / COMPONENTS
  }

  assert.equal(triangleCount, triangles)
})

test('names only parts of the model in every concept', () => {
  const partIds = new Set(parts.map(({ id }) => id))

  for (const { id, elements } of concepts) {
    assert.ok(elements.length > 0, `${id} has no parts`)

    for (const element of elements) {
      assert.ok(partIds.has(element), `${id} names the missing part ${element}`)
    }
  }
})

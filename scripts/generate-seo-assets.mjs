/**
 * SEO asset generator — produces:
 *   public/og-image.png        (1200x630 branded social preview)
 *   public/favicon.ico         (16/32/48 multi-size)
 *   public/apple-touch-icon.png(180x180)
 *   public/favicon.svg         (vector favicon)
 *
 * Pure Node (zlib + Buffer), no dependencies.
 * Re-run anytime: node scripts/generate-seo-assets.mjs
 */
import zlib from 'node:zlib'
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = (name) => join(root, 'public', name)
mkdirSync(join(root, 'public'), { recursive: true })

/* ---------- PNG encoder ---------- */
function crc32(buf) {
  crc32.table ??= Array.from({ length: 256 }, (_, n) => {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    return c >>> 0
  })
  let crc = 0xffffffff
  for (const b of buf) crc = crc32.table[(crc ^ b) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const t = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, crc])
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/* ---------- PNG decoder ---------- */
function decodePng(buf) {
  let pos = 8
  let w, h, channels
  const idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)
    if (type === 'IHDR') {
      w = data.readUInt32BE(0)
      h = data.readUInt32BE(4)
      const bitDepth = data[8]
      const colorType = data[9]
      if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2))
        throw new Error(`unsupported PNG (depth=${bitDepth}, color=${colorType})`)
      if (data[12] !== 0) throw new Error('interlaced PNG not supported')
      channels = colorType === 6 ? 4 : 3
    } else if (type === 'IDAT') idat.push(data)
    else if (type === 'IEND') break
    pos += 12 + len
  }
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const stride = w * channels
  const out = Buffer.alloc(w * h * 4)
  let prevRow = Buffer.alloc(stride)
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)]
    const row = Buffer.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)))
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? row[x - channels] : 0
      const b = prevRow[x]
      const c = x >= channels ? prevRow[x - channels] : 0
      if (filter === 1) row[x] = (row[x] + a) & 0xff
      else if (filter === 2) row[x] = (row[x] + b) & 0xff
      else if (filter === 3) row[x] = (row[x] + ((a + b) >> 1)) & 0xff
      else if (filter === 4) {
        const p = a + b - c
        const pa = Math.abs(p - a)
        const pb = Math.abs(p - b)
        const pc = Math.abs(p - c)
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c
        row[x] = (row[x] + pr) & 0xff
      }
    }
    prevRow = row
    for (let x = 0; x < w; x++) {
      const s = x * channels
      const d = (y * w + x) * 4
      out[d] = row[s]
      out[d + 1] = row[s + 1]
      out[d + 2] = row[s + 2]
      out[d + 3] = channels === 4 ? row[s + 3] : 255
    }
  }
  return { w, h, data: out }
}

/* Nearest-neighbor resize */
function scaleTo(src, w, h) {
  const data = Buffer.alloc(w * h * 4)
  for (let y = 0; y < h; y++) {
    const sy = Math.min(src.h - 1, Math.floor((y * src.h) / h))
    for (let x = 0; x < w; x++) {
      const sx = Math.min(src.w - 1, Math.floor((x * src.w) / w))
      src.data.copy(data, (y * w + x) * 4, (sy * src.w + sx) * 4, (sy * src.w + sx) * 4 + 4)
    }
  }
  return { w, h, data }
}

/* Tempel gambar sebagai lingkaran (meniru avatar hero) dengan ring brand */
function pasteCircle(c, img, cx, cy, r, ringColor, ringWidth) {
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      const d = Math.sqrt(x * x + y * y)
      if (d > r) continue
      const edge = d > r - 1 ? r - d : 1 // anti-alias tepi
      if (d > r - ringWidth) {
        px(c, cx + x, cy + y, ringColor, Math.round(edge * 255))
      } else {
        const sx = Math.min(img.w - 1, Math.floor(((x + r) / (2 * r)) * img.w))
        const sy = Math.min(img.h - 1, Math.floor(((y + r) / (2 * r)) * img.h))
        const s = (sy * img.w + sx) * 4
        const hex = `#${[img.data[s], img.data[s + 1], img.data[s + 2]]
          .map((v) => v.toString(16).padStart(2, '0'))
          .join('')}`
        px(c, cx + x, cy + y, hex, Math.round((img.data[s + 3] / 255) * edge * 255))
      }
    }
  }
}

/* ---------- Canvas ---------- */
function canvas(w, h, bg) {
  const data = Buffer.alloc(w * h * 4)
  const hex = (c) => [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16),
  ]
  const [r, g, b] = hex(bg)
  for (let i = 0; i < w * h; i++) {
    data[i * 4] = r
    data[i * 4 + 1] = g
    data[i * 4 + 2] = b
    data[i * 4 + 3] = 255
  }
  return { w, h, data }
}

function px(c, x, y, color, alpha = 255) {
  if (x < 0 || y < 0 || x >= c.w || y >= c.h) return
  const [r, g, b] = [
    parseInt(color.slice(1, 3), 16),
    parseInt(color.slice(3, 5), 16),
    parseInt(color.slice(5, 7), 16),
  ]
  const i = (y * c.w + x) * 4
  const a = alpha / 255
  c.data[i] = Math.round(r * a + c.data[i] * (1 - a))
  c.data[i + 1] = Math.round(g * a + c.data[i + 1] * (1 - a))
  c.data[i + 2] = Math.round(b * a + c.data[i + 2] * (1 - a))
  c.data[i + 3] = 255
}

function rect(c, x, y, w, h, color) {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) px(c, xx, yy, color)
}

/* Sudut membulat: transparankan area di luar radius */
function roundCorners(c, r) {
  for (let y = 0; y < c.h; y++) {
    for (let x = 0; x < c.w; x++) {
      const dx = x < r ? r - x : x >= c.w - r ? x - (c.w - 1 - r) : 0
      const dy = y < r ? r - y : y >= c.h - r ? y - (c.h - 1 - r) : 0
      if (dx > 0 && dy > 0 && dx * dx + dy * dy > r * r) {
        c.data[(y * c.w + x) * 4 + 3] = 0
      }
    }
  }
}

/* ---------- Font piksel 5x7 ---------- */
const FONT = {
  A: [0x0e, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  C: [0x0e, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0e],
  D: [0x1e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x1e],
  E: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f],
  F: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x10],
  I: [0x0e, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e],
  K: [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11],
  L: [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  M: [0x11, 0x1b, 0x15, 0x15, 0x11, 0x11, 0x11],
  N: [0x11, 0x19, 0x15, 0x13, 0x11, 0x11, 0x11],
  O: [0x0e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  P: [0x1e, 0x11, 0x11, 0x1e, 0x10, 0x10, 0x10],
  R: [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
  S: [0x0f, 0x10, 0x10, 0x0e, 0x01, 0x01, 0x1e],
  T: [0x1f, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  U: [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  V: [0x11, 0x11, 0x11, 0x11, 0x11, 0x0a, 0x04],
  Z: [0x1f, 0x01, 0x02, 0x04, 0x08, 0x10, 0x1f],
  '.': [0, 0, 0, 0, 0, 0x04, 0x04],
  ' ': [0, 0, 0, 0, 0, 0, 0],
}

function drawText(c, text, x, y, scale, color) {
  let cx = x
  for (const ch of text.toUpperCase()) {
    const glyph = FONT[ch] ?? FONT[' ']
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (glyph[row] & (1 << (4 - col))) {
          rect(c, cx + col * scale, y + row * scale, scale, scale, color)
        }
      }
    }
    cx += 6 * scale
  }
  return cx - scale // lebar total tergambar
}

/* Monogram: huruf tunggal di tengah kotak brand */
function monogram(size, letter, bg, fg, radius) {
  const c = canvas(size, size, bg)
  const scale = Math.max(1, Math.floor((size * 0.62) / 5))
  const gw = 5 * scale
  const gh = 7 * scale
  drawText(c, letter, Math.floor((size - gw) / 2), Math.floor((size - gh) / 2), scale, fg)
  if (radius > 0) roundCorners(c, radius)
  return c
}

/* ---------- Brand ---------- */
const BRAND = '#6c49b6'
const BG_DARK = '#17191e'
const TEXT = '#f4f5f7'
const MUTED = '#b7bcc4'

/* OG image 1200x630 — foto profil di tengah, tanpa teks */
{
  const c = canvas(1200, 630, BG_DARK)

  const photo = decodePng(readFileSync(join(root, 'src/assets/pict/profile2.png')))
  pasteCircle(c, photo, 600, 315, 280, BRAND, 14)

  writeFileSync(out('og-image.png'), encodePng(c.w, c.h, c.data))
  console.log('✓ og-image.png (1200x630, foto profil di tengah)')
}

/* favicon.ico — 16/32/48 dengan PNG ter-embed */
{
  const sizes = [16, 32, 48]
  const pngs = sizes.map((s) => {
    const c = monogram(s, 'A', BRAND, '#ffffff', Math.max(2, Math.round(s * 0.18)))
    return encodePng(c.w, c.h, c.data)
  })

  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(sizes.length, 4)

  const entries = []
  let offset = 6 + 16 * sizes.length
  sizes.forEach((s, i) => {
    const e = Buffer.alloc(16)
    e[0] = s === 256 ? 0 : s
    e[1] = s === 256 ? 0 : s
    e.writeUInt16LE(1, 4) // planes
    e.writeUInt16LE(32, 6) // bpp
    e.writeUInt32LE(pngs[i].length, 8)
    e.writeUInt32LE(offset, 12)
    offset += pngs[i].length
    entries.push(e)
  })

  writeFileSync(out('favicon.ico'), Buffer.concat([header, ...entries, ...pngs]))
  console.log('✓ favicon.ico (16/32/48)')
}

/* apple-touch-icon 180x180 */
{
  const c = monogram(180, 'A', BRAND, '#ffffff', 0) // iOS mem masking sendiri
  writeFileSync(out('apple-touch-icon.png'), encodePng(c.w, c.h, c.data))
  console.log('✓ apple-touch-icon.png (180x180)')
}

/* favicon.svg */
{
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#6c49b6"/>
  <path d="M32 14 L46 50 H39.5 L36.6 41.5 H27.4 L24.5 50 H18 Z M29.4 35.8 H34.6 L32 27.5 Z" fill="#ffffff"/>
</svg>
`
  writeFileSync(out('favicon.svg'), svg)
  console.log('✓ favicon.svg')
}

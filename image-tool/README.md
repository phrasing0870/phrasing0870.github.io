# Image Converter & Compressor

Convert, compress, and resize images entirely in your browser. Nothing is uploaded; everything runs client-side via WASM and the Canvas API.

## What it does

Drag in one or more images (or paste a screenshot directly) and it converts them to your chosen format, compresses them, and optionally resizes them, all with a live before/after size comparison. Batch processing is supported: convert a folder's worth of images and download them all as a single .zip.

## Formats

- **Input**: anything the browser can decode (JPEG, PNG, WebP, GIF, TIFF, BMP, and more)
- **Output**: JPEG, PNG, WebP, GIF (static, 256-color palette), TIFF (uncompressed), BMP, ICO, and ICNS (macOS icon format)

## Key features

- **Quality control**: slider-based quality for lossy formats, or set a target file size in KB and it binary-searches the quality value that gets closest without going over.
- **Smart format defaults**: detects transparency and avoids silently flattening a transparent PNG to JPEG; also nudges large opaque JPEGs toward WebP by default to show immediate savings. Only kicks in if you haven't manually picked a format yet.
- **Resize**: by percentage or exact width/height, with optional aspect-ratio lock. Automatically detects and respects the browser's actual max canvas dimension (varies by device, especially mobile Safari) instead of using a guessed hardcoded limit.
- **Metadata stripping**: removes EXIF and other embedded metadata; for JPEG/PNG/WebP inputs this re-encodes in the same format, other formats fall back to PNG since those aren't valid canvas.toBlob outputs.
- **Background color**: for formats without alpha support, choose the fill color used when flattening transparency.
- **Batch download**: download individual files or all converted images at once as a .zip (via JSZip).

## How it works

- **JPEG encoding** goes through mozjpeg (WASM) instead of the browser's native encoder, for better compression at a given quality.
- **PNG optimization** goes through oxipng (WASM, Rust), run in a dedicated Web Worker so the multi-second compression pass doesn't freeze the page. It's lossless: same pixels, just a smaller, better-encoded file. The browser produces a normal PNG first, then oxipng re-encodes those bytes.
- **GIF encoding** uses gifenc to quantize down to a 256-color palette and write a single static frame; no animation support.
- **TIFF encoding** uses UTIF.js, uncompressed.
- **ICO/ICNS** are hand-built PNG-in-container formats (no external library needed for those).
- Conversions run through a small concurrency queue so multiple images don't all try to convert at once and choke the tab.
- No network requests, no server. Everything, including the WASM codecs, runs locally in the browser.

## Notes

Built for one-off and small-batch conversion work, not a production image pipeline. If you're leaning on the target-file-size feature for a lot of images at once, expect it to take a bit longer since it's running several trial encodes per image to find the right quality.

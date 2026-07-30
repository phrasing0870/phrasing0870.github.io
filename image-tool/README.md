# Image Converter & Compressor

A single-file, offline-capable image conversion tool that runs entirely in the browser. No uploads, no server, and no external requests once the page and its vendored libraries are loaded. Everything happens client-side via the Canvas API.

## Why this exists

Most online image converters upload your files to a server. This one does not. Drop a file in; it is decoded and processed locally in your browser, and nothing leaves your machine. This is critical if you are converting files you would rather not hand to a third party, including photos with EXIF/GPS metadata still attached.

## Features

- **Batch processing**: Drag and drop multiple files, or paste an image straight from your clipboard.
- **Download all as zip**: Batch download every converted file in one go.
- **Format conversion**: Support for JPEG, PNG, WebP, GIF (static, single-frame), TIFF, BMP, ICO, and ICNS.
- **Quality control**: Adjustable quality slider for lossy formats (JPEG/WebP). JPEG encoding runs through mozjpeg (WASM) instead of the browser's built-in encoder for better quality-per-byte at the same quality setting. It runs in a dedicated Web Worker, similar to the PNG optimization described below.
- **Target file size mode**: Set a max KB size instead of a quality percentage; the tool binary-searches the quality value that gets closest to your target without exceeding it.
- **PNG optimization**: Lossless recompression via oxipng (WASM), maintaining identical pixels and colors in a smaller file. Optimization levels are adjustable from 1 to 6; higher values result in smaller files but slower processing. It runs in a dedicated Web Worker so the multi-second compression pass does not freeze the page. This replaced an earlier lossy palette-reduction approach.
- **Strip metadata mode**: Removes EXIF, GPS, camera info, and timestamps by forcing a clean re-encode while keeping each file in its original format (JPEG stays JPEG, PNG stays PNG, WebP stays WebP). It also drops embedded ICC color profiles, which can shift color slightly on wide-gamut images. GIF, TIFF, BMP, ICO, and ICNS inputs fall back to PNG output in this mode because they are not valid canvas re-encode targets.
- **Smart format defaults**: Dropping a transparent PNG will not silently default to a format that flattens the alpha channel; dropping a large opaque JPEG suggests WebP to show quick size savings. This only applies before you manually pick a format.
- **Resize controls**: Scale by percentage or set exact dimensions.
- **Background fill**: Choose a background color when converting to formats without alpha support (JPEG, GIF).
- **Side-by-side preview**: Compare original vs. converted images before downloading.
- **Runtime canvas limit detection**: Probes the actual browser's max canvas dimension at runtime instead of assuming a fixed cap; this ensures full-resolution photos are not needlessly downscaled on desktop browsers.

## How metadata stripping works

Canvas re-encoding (`drawImage` + `toBlob`, or `drawImage` + mozjpeg for JPEG) only copies pixel data by design, not EXIF or other metadata segments. Strip-metadata mode leverages this behavior: it re-encodes each file at a fixed high quality while keeping the same format, producing a metadata-free copy. JPEG re-encodes through mozjpeg at quality 90; other formats use `canvas.toBlob` at quality 0.95. Because this is a fixed value rather than a match to the source file's original quality, a re-encoded JPEG can end up slightly larger or smaller than the original depending on how it was originally compressed. Each processed file shows a "metadata removed" confirmation in the UI rather than claiming it happened silently.

This has been verified: stripping a photo with a full Apple EXIF block (device model, lens info, exact GPS-adjacent timestamp with UTC offset, MakerNote) results in a file with zero EXIF tags remaining, confirmed via PIL/Pillow inspection.

## Format notes

- **GIF** output is limited to single frames; animation is not supported.
- **TIFF, BMP, ICO, and ICNS** are written via hand-rolled binary encoders; no metadata is ever carried into these regardless of strip mode.
- **HEIC input** is not yet supported.

## Local development

This is a static single HTML file with eight vendored JS/WASM dependencies:

```
index.html
vendor/
  gifenc.js      # GIF encoding
  utif.js        # TIFF encoding
  jszip.min.js   # batch "download all as zip" (v3.10.1)
  oxipng-worker.js         # runs oxipng off the main thread (see below)
  oxipng/
    squoosh_oxipng.js       # oxipng WASM loader (wasm-bindgen generated)
    squoosh_oxipng_bg.wasm  # oxipng WASM binary
  mozjpeg-worker.js        # runs mozjpeg off the main thread, same rationale as oxipng
  mozjpeg/
    mozjpeg_enc.js          # mozjpeg WASM loader (Emscripten generated, from @jsquash/jpeg)
    mozjpeg_enc.wasm        # mozjpeg WASM binary
```

There is no build step; however, do not simply double-click `index.html`. The GIF encoder is loaded as an ES module (`<script type="module">`), and browsers block ES module imports over the `file://` protocol via CORS. Opening the file directly will throw a console error and GIF export will not work.

Instead, serve the folder with any static file server, for example:

```
python3 -m http.server 8000
# then open http://localhost:8000
```

or the Node equivalent (`npx serve`). GitHub Pages serves everything over `https://`, so this only matters for local testing, not for the deployed site.

There are no external CDN dependencies; everything needed to run offline is vendored in `vendor/`, including `jszip.min.js` (used for the batch zip download), which must be downloaded once and committed alongside the HTML rather than loaded from cdnjs.

## Deploying

Push to a GitHub repo with GitHub Pages enabled on the branch or folder containing `index.html`. No build pipeline is required.

## Privacy

No analytics, no tracking, and no network calls once the page has loaded (aside from the initial page and script load). All conversion, compression, resizing, and metadata stripping happens locally in your browser via the Canvas API. Files never leave your device.

## License

MIT: see [LICENSE](./LICENSE).

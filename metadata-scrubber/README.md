# Metadata Scrubber

View and strip EXIF, GPS, and document metadata from images and PDFs, entirely in your browser. Nothing you inspect or scrub is ever sent anywhere.

## What it does

- **View**: reads a file's embedded metadata and displays it before you decide to remove anything, camera make/model, timestamps, software, document author and creator, and more.
- **GPS callout**: if a file contains location data, it's shown separately with a decimal lat/long and a link to view the point on OpenStreetMap, since that's the detail people most often don't realize is there.
- **Scrub**: produces a clean copy with the metadata removed and downloads it. The original file is never modified.

Supports JPEG, PNG, and WebP images, plus PDF documents.

## How it works

- Images are decoded with `createImageBitmap(file, { imageOrientation: 'from-image' })`, which bakes the correct rotation into the pixels, then redrawn onto a `<canvas>` and re-exported with `canvas.toBlob()`. Re-encoding through canvas drops all EXIF, GPS, and embedded ICC color profile data by construction, no field-by-field stripping needed.
- PDFs are loaded with [pdf-lib](https://pdf-lib.js.org/), fetched from jsDelivr. The Title, Author, Subject, Keywords, Creator, and Producer fields are cleared, and the embedded XMP metadata stream (the catalog's `Metadata` entry) is deleted if present, then the document is re-saved.
- EXIF/TIFF parsing (Make, Model, DateTime, GPS, and related tags) is a small custom parser with no dependency, reading the TIFF IFD structure directly from a `DataView`. PNG text chunks (`tEXt`/`zTXt`/`iTXt`/`eXIf`) and WebP RIFF chunks (`EXIF`/`XMP `) are parsed the same way.
- GPS coordinates, stored as degrees/minutes/seconds rationals, are converted to decimal for display and for the map link.

## Notes

No file you inspect or scrub is uploaded or logged; everything happens locally in the browser. The only network request this tool makes is loading the pdf-lib library itself from jsDelivr, used purely as client-side code, never as a place your data is sent.
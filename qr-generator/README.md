# QR Code Generator

Generate styled QR codes for text, URLs, WiFi networks, or contact cards, entirely in your browser. Nothing is uploaded.

## What it does

Three content types:

- **Text / URL**: plain text or a link.
- **WiFi**: builds a standard `WIFI:` payload (SSID, password, security type, hidden network flag) that phones auto-recognize for one-scan network joining.
- **Contact**: builds a vCard 3.0 payload (name, org, title, email, phone, website, address) for a one-scan add-to-contacts QR code.

Styling options include dot/corner-square/corner-dot shapes, foreground/background color (with transparent background support), size, error correction level (with recovery percentage shown), and an optional embedded logo (drag-drop or paste an image, with adjustable size). An optional caption line can be composed into the exported image below the QR code itself.

## How it works

- QR encoding and shape rendering is handled by the `qr-code-styling` library, loaded from jsDelivr as a UMD build so no bundler or build step is needed.
- WiFi and contact-card payloads are constructed as plain strings client-side (`WIFI:...` format with proper escaping of special characters, and standard vCard format), then handed to the QR library like any other text payload.
- Export formats are PNG and SVG. When a caption is requested, the tool composites it: for PNG it draws the QR bitmap onto a canvas with the text rendered below and re-exports; for SVG it stitches the QR's SVG markup together with a `<text>` element and a background rect in a single SVG.
- Everything, including logo embedding, happens client-side. No files are uploaded, no network requests happen beyond the one-time library load.

## Notes

Higher error correction levels (Q/H) tolerate more damage or obstruction (like a logo overlay) before the code becomes unscannable, at the cost of a denser pattern. Worth bumping up if you're embedding a logo.

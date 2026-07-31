# EGRelay

A collection of fast, focused, privacy-first browser tools.

**Live site:** [egrelay.com](https://egrelay.com)

EGRelay tools are designed to run locally in your browser whenever possible. There are no required accounts, no unnecessary uploads, and no analytics or tracking.

## Tools

### [Image Tool](https://egrelay.com/image-tool/)

Convert, compress, resize, preview, and strip metadata from images directly in your browser.

* Batch image processing
* JPEG, PNG, WebP, GIF, TIFF, BMP, ICO, and ICNS output
* Lossless PNG optimization with oxipng
* JPEG compression with mozjpeg
* Target file-size mode
* Metadata removal
* Local ZIP downloads

[Full documentation →](./image-tool/README.md)

### [Password Generator](https://egrelay.com/password-generator/)

Generate secure passwords and passphrases entirely client-side.

* Cryptographically secure randomness through the Web Crypto API
* Random-password and passphrase modes
* EFF long wordlist
* Custom length and character controls
* No generated passwords are transmitted or stored remotely

[Full documentation →](./password-generator/README.md)

### [Ledger](https://egrelay.com/ledger/)

A private encrypted notepad for storing sensitive notes locally.

* Client-side encryption
* Local storage
* No account or remote database
* Import and export support

[Full documentation →](./ledger/README.md)

### [QR Code Generator](https://egrelay.com/qr-generator/)

Create customizable QR codes without sending their contents to a remote service.

* Plain text and URLs
* Wi-Fi network details
* Contact cards
* Style and export controls
* Offline-capable after loading

This tool's feature design and core logic were adapted from a separately MIT-licensed project (see [`qr-generator/NOTICE.md`](./qr-generator/NOTICE.md) for the original attribution and license text).

[Full documentation →](./qr-generator/README.md)

### [Checksum Checker](https://egrelay.com/checksum-checker/)

Verify downloaded files locally without uploading them.

* SHA-256
* SHA-1
* SHA-512
* Drag-and-drop file support
* Browser-native hashing through the Web Crypto API

[Full documentation →](./checksum-checker/README.md)

## Principles

### Local when possible

Files and sensitive input stay on your device whenever a task can be completed within the browser.

### No forced accounts

Every tool is available without registration, subscriptions, newsletters, or login walls.

### Focused by design

Each utility is built around a clear purpose instead of becoming a crowded all-purpose application.

### Open source

The complete source for the website and its tools is available in this repository under the MIT License.

## Repository structure

```text
.
├── assets/                 # Shared homepage assets
├── checksum-checker/       # Local file checksum verifier
├── image-tool/             # Image converter and compressor
├── ledger/                 # Encrypted local notepad
├── password-generator/     # Password and passphrase generator
├── qr-generator/           # Offline QR code generator
│   └── NOTICE.md           # Attribution and license for ported code (see below)
├── index.html              # EGRelay homepage
├── CNAME                   # GitHub Pages custom domain
├── robots.txt
└── sitemap.xml
```

Individual tools may contain their own assets, dependencies, documentation, and vendored libraries. Each tool's directory also contains its own README with implementation details, security model, and format support.

## Running locally

EGRelay is a static website with no central build process.

Clone the repository:

```bash
git clone https://github.com/phrasing0870/phrasing0870.github.io.git
cd phrasing0870.github.io
```

Start a local static server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

A local server is recommended instead of opening the HTML files directly because some browser APIs, Web Workers, WebAssembly modules, and ES module imports require an HTTP origin.

## Deployment

The site is deployed through GitHub Pages from the root of the `main` branch.

The `CNAME` file connects the deployment to:

```text
egrelay.com
```

Because this is a GitHub user-site repository, changes pushed to the deployed branch are published without a separate build pipeline.

## Privacy

EGRelay does not use analytics, behavioral tracking, advertising scripts, or user accounts.

Most processing happens entirely within the browser. Files are not uploaded unless a specific tool explicitly states otherwise.

Some tools require an initial network request to download their page assets or vendored dependencies. Once loaded, supported operations are performed locally.

## Browser support

A current desktop or mobile browser is recommended. Certain features depend on modern browser APIs, including:

* Web Crypto API
* Canvas API
* Web Workers
* WebAssembly
* Local storage
* File and clipboard APIs

## License

Licensed under the [MIT License](./LICENSE).

The QR Code Generator tool's core logic was originally adapted from a separately MIT-licensed project; see [`qr-generator/NOTICE.md`](./qr-generator/NOTICE.md) for that project's original copyright notice, which is carried forward there as required.


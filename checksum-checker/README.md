# Checksum Checker

Verify that a downloaded file matches its published checksum, entirely in your browser. The file never leaves your machine.

## What it does

Drop in a file and it computes SHA-1, SHA-256, and SHA-512 hashes automatically. Paste the checksum published on the download page and it tells you whether the file matches, so you can confirm it wasn't corrupted in transit or tampered with.

## Why it's useful

Most people skip checksum verification because the standard workflow (terminal, `sha256sum`, comparing output by eye) is annoying enough that they don't bother. This makes it a drag-and-drop action with automatic pass/fail feedback, so there's less excuse to skip it, especially for installers, disk images, or anything downloaded from a mirror instead of the primary source.

## How it works

- File is read into memory once via `file.arrayBuffer()` and all three digests are computed from that same buffer using the browser's native Web Crypto API (`crypto.subtle.digest`), no external libraries.
- Algorithm for the pasted "expected" hash is auto-detected by string length: 40 hex chars = SHA-1, 64 = SHA-256, 128 = SHA-512.
- No network requests. No file upload. Everything happens client-side.
- Not chunked/streamed, so it holds the whole file in memory at once. Fine for anything that reasonably fits in RAM (installers, archives, disk images); not built for multi-GB files.

## Notes

If you want to verify a file's integrity without trusting a third-party tool with the file itself, this is the point of it. Works offline once the page is loaded.

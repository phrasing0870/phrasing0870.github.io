# Ledger

A local-first, encrypted journal. Everything is encrypted and stored in your browser; nothing is ever sent to a server.

## What it does

A private notebook app: write entries, they're encrypted on your device and saved to IndexedDB. Supports multiple separate notebooks (vaults), each with its own passphrase, so you can keep, say, a personal and a work notebook fully isolated from each other.

## Security model

- **Encryption**: AES-256-GCM. GCM includes built-in tamper detection, so an entry only decrypts successfully if both the key and the ciphertext are intact.
- **Key derivation**: new vaults use Argon2id (64 MB memory, 3 iterations) by default. Older vaults created under the previous default, PBKDF2-SHA256 at 650,000 iterations, keep working indefinitely and are transparently upgraded to Argon2id the next time you change that vault's passphrase.
- **Zero-knowledge**: the passphrase never leaves your device and is never stored. There's no recovery if you lose it, by design; that's the tradeoff for nothing being recoverable by anyone else either.
- **Storage**: IndexedDB, local to the browser profile. Nothing syncs anywhere on its own.

## Features

- **Multiple notebooks**: each vault is a separate encrypted IndexedDB database with its own passphrase and salt.
- **Version history**: entries keep prior versions, with a configurable history limit.
- **Passphrase change**: re-encrypts the entire vault under a new key. This is done via a two-phase staging process, fully re-encrypting and verifying into staging tables before swapping them in, so an interrupted change (browser closed mid-operation) never leaves the vault in a corrupted state. On next open, any interrupted change is automatically resumed and completed.
- **Export/import**: export a notebook to a JSON backup file, restore a backup into the current notebook, or import a backup as a brand-new independent notebook. Backups carry the encryption salt and verification payload, not the passphrase, so restoring still requires the original passphrase.
- **Erase**: wipe all entries in a notebook while keeping the passphrase and vault itself intact.
- **Keyboard shortcuts**: Cmd/Ctrl+N for a new entry, Cmd/Ctrl+S to force-save, Cmd/Ctrl+Shift+L to lock immediately.
- **Unsaved-changes protection**: warns before closing the tab if there's a pending autosave, since IndexedDB/WebCrypto writes are async and can't be guaranteed to finish during page unload.

## How it works

No dependencies beyond hash-wasm for the Argon2id implementation (PBKDF2 is native via Web Crypto and needs nothing extra). No network requests at all outside loading that library. No accounts, no sync, no analytics.

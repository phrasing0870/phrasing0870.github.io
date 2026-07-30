# Password Generator

A client-side password and passphrase generator. No backend, no analytics, no network requests required to use it.

**Live site:** https://egrelay.com/password-generator/

## Why

Most online password generators either run server-side (meaning your generated password technically passes through someone else's infrastructure) or rely on `Math.random()`, which isn't cryptographically secure. This tool avoids both problems.

## How it works

- **Random mode** builds a password from a pool of character sets you choose (lowercase, uppercase, numbers, symbols), guarantees at least one character from each selected set, then shuffles the result using a Fisher-Yates shuffle.
- **Passphrase mode** picks words from the EFF long wordlist (7,776 words, the standard "diceware" list used for memorable, high-entropy passphrases).
- Both modes use `crypto.getRandomValues()`, the Web Crypto API's cryptographically secure random number generator, not `Math.random()`.
- Nothing is transmitted anywhere. Generation happens entirely in your browser. There's no server component to this project at all.

> **Tip:** For random-mode passwords, 20-28 characters (with all four character types enabled) is the sweet spot: comfortably past the point where brute-forcing is realistic, without being unwieldy to type or store. The strength meter flags anything past 175 bits of entropy as "Overkill," roughly the point past 28-30 characters, since more length beyond that adds negligible real-world security benefit for typical use cases. That said, this is just my personal opinion, not a rule the tool enforces; use whatever length actually fits your situation.

## The wordlist

`/words/eff_large.json` is the full EFF long wordlist, downloaded from the [EFF's original release](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases) and converted to JSON. It's hosted in this repo (served via jsdelivr's CDN mirror of the repo) rather than fetched from a third party, so the only network dependency is on this project's own files.

On first successful load, the wordlist is cached in the browser's `localStorage`, so repeat visits skip the network fetch entirely. If the fetch fails (offline, CDN unreachable) and no cache exists, the tool falls back to a smaller embedded wordlist so passphrase generation still works, just with a smaller pool.

## Running locally

This is a single static HTML file with no build step. Clone the repo and open `index.html` directly in a browser, or serve it with any static file server.

## Security notes

- Passwords/passphrases are generated and displayed entirely client-side. Nothing is logged, stored remotely, or sent over the network.
- The "avoid similar characters" option excludes `l`, `1`, `I`, `O`, `0` from the random-mode character pool, at the cost of slightly reduced entropy per character.
- Symbol set is intentionally limited to `!@#$%^&*-_=+`, avoiding characters (quotes, backslashes, brackets, etc.) that have historically caused issues in some login forms, shells, or data exports.

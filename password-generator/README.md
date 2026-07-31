# Password Generator

Generate strong random passwords or Diceware-style passphrases entirely in your browser. Nothing you generate is ever sent anywhere.

## What it does

Two modes:

- **Random**: character-based password, 4-64 characters, with toggles for lowercase, uppercase, numbers, symbols, and an option to exclude visually ambiguous characters (`l`, `1`, `I`, `O`, `0`).
- **Passphrase**: word-based passphrase (Diceware-style), 3-10 words, with a configurable separator, optional capitalization, and an optional trailing number.

Both modes show a live entropy-based strength meter (weak / fair / strong / very strong / overkill, with the bit count shown).

## How it works

- All randomness comes from `crypto.getRandomValues` (CSPRNG), never `Math.random`.
- Random mode guarantees at least one character from each selected character type, then fills the rest of the length and shuffles, using rejection sampling on the random values to avoid modulo bias.
- Passphrase mode uses the full 7,776-word EFF large wordlist, fetched once from jsDelivr and cached in `localStorage` so repeat visits skip the network entirely. If the fetch fails (offline, CDN unreachable, first visit with no cache yet), it falls back to a smaller embedded wordlist so the tool still works either way. A live status indicator shows which list is active (fresh fetch, cached, or fallback).
- The full wordlist is only fetched the first time you actually switch to Passphrase mode, not on every page load regardless of which mode you use.
- No network requests happen at all in Random mode.

## Notes

Nothing generated here is stored, logged, or transmitted; the only network call this tool ever makes is the one-time wordlist fetch for passphrase mode, and that's cached after the first successful load.

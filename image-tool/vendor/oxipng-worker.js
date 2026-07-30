// Runs oxipng in a dedicated worker so the multi-second, single-threaded
// compression pass doesn't freeze the page's main thread (drag/drop,
// clicks, scrolling, etc. all stay responsive while this churns).
//
// Loaded as a module worker: new Worker('./vendor/oxipng-worker.js', { type: 'module' })

import initOxipngWasm, { optimise as oxipngOptimiseRaw } from './oxipng/squoosh_oxipng.js';

let wasmReady = null;
function ensureWasmReady() {
  if (!wasmReady) {
    // No argument: loader defaults to fetching squoosh_oxipng_bg.wasm from
    // the same folder as squoosh_oxipng.js itself, relative to its own
    // import.meta.url. Still correct from inside a worker.
    wasmReady = initOxipngWasm();
  }
  return wasmReady;
}
// Warm the WASM up as soon as the worker spins up, so the first real job
// doesn't pay the init cost on top of the compression cost.
ensureWasmReady().catch(() => {
  // Swallowed here; a real job will surface the error via its own reject.
});

self.onmessage = async (event) => {
  const { id, data, level, interlace, optimizeAlpha } = event.data;
  try {
    await ensureWasmReady();
    const result = oxipngOptimiseRaw(data, level, interlace, optimizeAlpha);
    // Transfer the underlying buffer back rather than copying it, cheaper
    // for larger images.
    self.postMessage({ id, ok: true, result }, [result.buffer]);
  } catch (err) {
    self.postMessage({ id, ok: false, error: err && err.message ? err.message : 'oxipng worker failed' });
  }
};

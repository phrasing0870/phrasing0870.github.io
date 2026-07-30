// mozjpeg runs inside a dedicated Web Worker, same rationale as
// oxipng-worker.js: encoding is heavy enough (especially at high quality /
// large resolutions) that doing it on the main thread would freeze the UI.
import mozjpeg_enc from './mozjpeg/mozjpeg_enc.js';

let modulePromise = null;

function getModule() {
  if (!modulePromise) {
    // noInitialRun: true mirrors jsquash's own init, this is an Emscripten
    // module, not a normal script; without it the module tries to run a
    // main() on load that we don't want.
    modulePromise = mozjpeg_enc({ noInitialRun: true });
  }
  return modulePromise;
}

// quality is expected as an integer 0-100 (mozjpeg's native scale), NOT the
// 0-1 float canvas.toBlob uses. Caller is responsible for that conversion.
const defaultOptions = {
  quality: 75,
  baseline: false,
  arithmetic: false,
  progressive: true,
  optimize_coding: true,
  smoothing: 0,
  color_space: 3, // YCbCr
  quant_table: 3,
  trellis_multipass: false,
  trellis_opt_zero: false,
  trellis_opt_table: false,
  trellis_loops: 1,
  auto_subsample: true,
  chroma_subsample: 2,
  separate_chroma_quality: false,
  chroma_quality: 75,
};

self.onmessage = async (event) => {
  const { id, data, width, height, quality } = event.data;
  try {
    const module = await getModule();
    const options = { ...defaultOptions, quality };
    const resultView = module.encode(data, width, height, options);
    // Copy out of the wasm-owned buffer into a plain ArrayBuffer we can
    // transfer back; the module reuses its internal memory across calls,
    // so returning a view into it directly is not safe.
    const buffer = resultView.slice().buffer;
    self.postMessage({ id, ok: true, result: buffer }, [buffer]);
  } catch (err) {
    self.postMessage({ id, ok: false, error: err && err.message ? err.message : 'mozjpeg encode failed' });
  }
};

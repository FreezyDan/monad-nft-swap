// frontend/probe-wagmi.mjs
(async () => {
  try {
    const W = await import('wagmi');
    console.log('wagmi exports:', Object.keys(W).sort());
  } catch (err) {
    console.error('probe error:', err && err.stack ? err.stack : err);
  }
})();

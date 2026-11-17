const CACHE_NAME = 'axel25-admin-shell-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('axel25-admin-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

// Do not cache authenticated pages, customer/order data, Supabase calls, or payment requests.
// Only allow same-origin navigation requests through as network-first.
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode !== 'navigate') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      return await fetch(request, { cache: 'no-store' });
    } catch (_) {
      return new Response(
        '<!doctype html><html lang="id"><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="utf-8"><title>AXEL25 Admin</title><body style="margin:0;background:#061a38;color:#f4f8ff;font:16px Arial;display:grid;min-height:100vh;place-items:center;text-align:center"><main><h2>Koneksi internet terputus</h2><p>Hubungkan internet lalu muat ulang AXEL25 Admin.</p><button onclick="location.reload()" style="padding:12px 20px;border:0;border-radius:10px">Coba lagi</button></main></body></html>',
        { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
      );
    }
  })());
});

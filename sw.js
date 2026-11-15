const V='pwcam-v3',SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,n)=>{if(n.ok){const c=n.clone();caches.open(V).then(x=>x.put(r,c))}return n};
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  if(u.origin===location.origin) // 自己的檔案：網路優先（更新即時），離線用快取
    e.respondWith(fetch(r).then(n=>put(r,n)).catch(()=>caches.match(r).then(x=>x||caches.match('./index.html'))));
  else if(u.hostname==='cdnjs.cloudflare.com') // 函式庫：快取優先
    e.respondWith(caches.match(r).then(x=>x||fetch(r).then(n=>put(r,n))));
});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():clients.openWindow('./')))});

# Offline-first (any backend)

Phone users lose connection all the time: on commutes, in basements, on cheap data
plans. Design for it from day one. Adding offline support later means rewriting
the data layer.

## The pattern

1. **Local data layer.** The UI reads from the device, not straight from the
   network. Use IndexedDB in a Capacitor app (or SQLite through a Capacitor plugin
   for large or relational data), or a backend SDK's own persistent cache.
2. **Outbox for writes.** Every create, update or delete is written locally first
   and added to an outbox queue (persisted, so it survives an app restart). The UI
   updates immediately. **Never make the UI wait for the server** before a save
   counts as done.
3. **Idempotent writes.** Each queued write carries a client-generated ID (UUID),
   and the server upserts by it. Retries and duplicate sends must not create
   duplicate records.
4. **Sync on reconnect.** Flush the outbox when the connection returns (`online`
   event, Capacitor `Network` plugin, app resume), with exponential backoff on
   failure. Pull remote changes since the last sync timestamp or cursor.
5. **Conflict policy:** decide this per data type and write it down in
   `03-direction.md`:
   - *Last write wins* (by server timestamp): fine for single-user data edited on
     one device at a time (settings, profile).
   - *Field-level merge*: when different fields can change on different devices.
   - *Append-only*: logs and sessions never conflict; just add them.
   - *Server-authoritative + tell the user*: shared or valuable data (shared lists,
     money). Show "this changed on another device" instead of silently
     overwriting.
   - Deletes: use soft-delete (tombstones) so a stale device doesn't bring the
     record back.
6. **Show the state.** An Offline / Syncing indicator, a confirmation once synced,
   and clear errors for writes the server rejected (permissions, validation).
   Never lose the user's input silently.
7. **Features that need a connection** (joining a group, payments, search over
   server data) say so up front instead of hanging.
8. **App shell offline.** A bundled Capacitor app already has its files. A
   remote-URL app or PWA needs a precaching service worker
   (`templates/web/build-sw.mjs` + `sw-template.js`).
9. **Android WebView connectivity.** `navigator.onLine` is wrong on Android unless
   native code reports it. Use `templates/android/MainActivity.java`, or base
   decisions on the Capacitor `Network` plugin.

## Backend-specific implementations

- **Firebase Firestore:** enable the persistent cache (`persistentLocalCache` with
  a multi-tab manager). The SDK's pending writes act as the outbox. Don't `await`
  writes while offline: settle when queued (or after a short timeout) and still
  show rejections that come back while online. Reads use `getDocsFromCache` when
  offline. Last write wins per field by default; use transactions or
  server-side checks for counters and shared data.
- **Supabase / Postgres / any REST or Node API:** there's no built-in offline
  cache, so build the pattern yourself. Use IndexedDB (Dexie) or SQLite for local
  tables, an outbox table, upserts keyed by client UUIDs, and `updated_at` +
  `deleted_at` columns for incremental pull and tombstones. Consider a sync engine
  (PowerSync, ElectricSQL, RxDB) when the data model is large.
- **TanStack Query** (with any backend): `networkMode: 'offlineFirst'`, persist the
  query cache (`persistQueryClient` with IndexedDB) for instant offline screens, and
  paused mutations with `resumePausedMutations()` on reconnect. Query persistence
  is not an outbox on its own, so keep the real queue in the data layer.

## Test

Airplane mode **on a real device**: open the app cold, browse cached data, create
and edit items, kill and reopen the app, reconnect, and check everything synced
exactly once. Then check the same items from a second device or account.

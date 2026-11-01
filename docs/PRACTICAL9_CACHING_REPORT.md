# Practical 9: In-Memory Caching and Query Optimization

**Course / Lab**: Web Development Frameworks (AWDF)  
**Student**: Divy (24IT047)  
**CO/PO**: CO2, CO4 / PO3, PO5  

---

## 🎯 Objective
To implement server-side in-memory caching using `node-cache`, eliminate redundant database disk roundtrips for frequent read operations, enforce strict cache invalidation on write mutations, and measure the empirical latency reduction across cached vs uncached requests.

---

## 🏛️ Architecture & Caching Strategy

```
                          ┌──────────────────────────┐
                          │   Client / Postman / UI  │
                          └─────────────┬────────────┘
                                        │
                         GET /tasks     │    POST / PUT / DELETE
                                        │
                                        ▼
                         ┌───────────────────────────┐
                         │   Express Server Routing  │
                         └──────────────┬────────────┘
                                        │
                   ┌────────────────────┴────────────────────┐
                   ▼                                         ▼
         [ READ OPERATION ]                       [ WRITE OPERATION ]
                 │                                         │
                 ▼                                         ▼
         ┌───────────────┐                       ┌───────────────────┐
         │  node-cache   │                       │  MongoDB Write    │
         │  Check Key:   │                       │  Persist Document │
         │  'all_tasks'  │                       └─────────┬─────────┘
         └───────┬───────┘                                 │
                 │                                         │
        ┌────────┴────────┐                                ▼
     HIT│                 │MISS                  ┌───────────────────┐
        ▼                 ▼                      │ Cache Invalidation│
 ┌─────────────┐   ┌─────────────┐               │ cache.del(...)    │
 │ Return from │   │ Query Mongo │               └───────────────────┘
 │ RAM (<1 ms) │   │ DB (Disk)   │                         │
 └─────────────┘   └──────┬──────┘                         ▼
                          │                        Evict 'all_tasks'
                          ▼                        & 'task_:id' from
                   ┌─────────────┐                 in-memory cache!
                   │ Populate    │
                   │ node-cache  │
                   │ (TTL: 60s)  │
                   └─────────────┘
```

---

## 📊 Empirical Response Time Comparison (3 Sample Readings)

The following empirical measurements were recorded by sampling consecutive `GET /tasks` requests with caching enabled vs bypassed:

| Sample Reading | Uncached (Direct MongoDB Query) | Cached (In-Memory `node-cache`) | Absolute Latency Reduction | Performance Improvement |
| :---: | :---: | :---: | :---: | :---: |
| **Sample #1** | `24.85 ms` | `0.48 ms` | `-24.37 ms` | **51.8x faster** |
| **Sample #2** | `18.62 ms` | `0.32 ms` | `-18.30 ms` | **58.2x faster** |
| **Sample #3** | `21.14 ms` | `0.29 ms` | `-20.85 ms` | **72.9x faster** |
| **Average** | **`21.54 ms`** | **`0.36 ms`** | **`-21.18 ms`** | **🚀 ~59.8x Speedup (98.3% Latency Drop)** |

---

## ⚙️ Key Implementation Highlights

### 1. Dedicated Cache Instance (`backend/utils/cache.js`)
Configured with standard **TTL of 60 seconds** and automatic expired key cleanup:
```javascript
const NodeCache = require('node-cache');

const cache = new NodeCache({
  stdTTL: 60,       // 60-second time-to-live
  checkperiod: 120, // background sweep every 2 minutes
  useClones: false  // reference return for maximum performance
});
```

### 2. Cache-Aside Read Pattern (`backend/controllers/taskController.js`)
```javascript
// Check in-memory cache first
const cachedTasks = cache.get('all_tasks');
if (cachedTasks) {
  recordHit('all_tasks');
  res.set('X-Cache', 'HIT');
  return res.status(200).json({ success: true, data: cachedTasks, source: 'cache' });
}

// Cache MISS: Query Database and store
recordMiss('all_tasks');
const tasks = await Task.find().sort({ createdAt: -1 });
cache.set('all_tasks', tasks);
res.set('X-Cache', 'MISS');
res.status(200).json({ success: true, data: tasks, source: 'database' });
```

### 3. Strict Write Invalidation (`POST`, `PUT`, `DELETE`)
Ensures that data mutations immediately purge stale records from RAM:
```javascript
// Invalidate cache on CREATE (POST /tasks)
cache.del('all_tasks');

// Invalidate on UPDATE & DELETE (PUT / DELETE /tasks/:id)
cache.del(['all_tasks', `task_${id}`]);
```

### 4. Supplementary Endpoints
- `GET /tasks/:id`: Caches individual tasks under isolated keys (`task_${id}`).
- `GET /tasks/cache/stats`: Exposes real-time hit/miss counts, hit ratio, and active key list.
- `GET /tasks/cache/benchmark`: Runs live 3-sample latency test comparing disk vs RAM access.
- `POST /tasks/cache/clear`: Administrative manual cache eviction.

---

## 💡 Answers to Key Questions / Analysis

### 1. Why must the cache be invalidated on every write operation, and what would happen if it were not?
- **Why Invalidation is Required:** When a task is created, updated, or deleted, the underlying MongoDB state changes. If the in-memory cache were not invalidated, subsequent `GET /tasks` requests would continue serving outdated records from RAM until the TTL expired.
- **Consequences of Stale Data:** Users would observe phantom tasks that were already deleted, fail to see newly created tasks, and see old values after saving edits, destroying data consistency.

### 2. What is a reasonable TTL (time-to-live) for cached data in a task management context, and what trade-off does TTL length represent?
- **Reasonable TTL:** Between **30 to 120 seconds** (this practical uses **60 seconds**).
- **The Trade-Off:**
  - *Shorter TTL (e.g., 5-15s):* Maximizes freshness and minimizes window of stale data in distributed setups, but incurs higher database load due to frequent cache misses.
  - *Longer TTL (e.g., 5-10 min):* Maximizes database offloading and throughput, but increases the risk of serving stale data if an invalidation trigger is missed or across unsynchronized nodes.

### 3. Why is in-memory caching (`node-cache`) not suitable for a multi-server/multi-instance deployment?
- `node-cache` stores items exclusively in the private heap memory of the specific Node.js process. In a scaled deployment behind a load balancer (e.g., 3 backend containers or server instances):
  1. A user writes a task to Instance A (which invalidates Instance A's cache).
  2. The next read hits Instance B, which still holds the old data in its local memory!
- **Production Solution:** Distributed in-memory caching systems like **Redis** or **Memcached**, where all backend instances share a centralized, shared cache cluster.

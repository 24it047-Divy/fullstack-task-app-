import React, { useState, useEffect } from 'react';
import { Database, Zap, RefreshCw, Trash2, Clock, CheckCircle2, AlertTriangle, Layers, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { getCacheStats, clearServerCache, runCacheBenchmark } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function CacheMonitor() {
  const [stats, setStats] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [runningBenchmark, setRunningBenchmark] = useState(false);
  const [clearing, setClearing] = useState(false);
  const { showToast } = useToast();

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const res = await getCacheStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load cache stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setClearing(true);
      const res = await clearServerCache();
      if (res.success) {
        showToast('In-memory cache flushed successfully', 'info');
        await loadStats();
      }
    } catch (err) {
      showToast('Failed to flush cache', 'error');
    } finally {
      setClearing(false);
    }
  };

  const handleRunBenchmark = async () => {
    try {
      setRunningBenchmark(true);
      const res = await runCacheBenchmark();
      if (res.success) {
        setBenchmark(res.benchmarkResults);
        showToast(`Benchmark complete: ${res.benchmarkResults.averages.speedupMultiplier}`, 'success');
        await loadStats();
      }
    } catch (err) {
      showToast('Failed to execute benchmark', 'error');
    } finally {
      setRunningBenchmark(false);
    }
  };

  useEffect(() => {
    loadStats();
    // Auto-refresh stats every 5 seconds
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analytics-page-container">
      {/* Header Card */}
      <div className="page-header-card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-dev font-mono">In-Memory Caching</span>
              <span className="badge badge-emerald font-mono">TTL: 60s</span>
              <span className="badge badge-purple font-mono">node-cache</span>
            </div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="text-amber-400" size={24} /> In-Memory Caching & Query Optimization
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Sub-millisecond API response caching for <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">GET /tasks</code> with automatic write-through invalidation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadStats}
              disabled={loadingStats}
              className="btn btn-secondary flex items-center gap-2 text-xs"
              title="Refresh cache metrics"
            >
              <RefreshCw size={14} className={loadingStats ? 'animate-spin' : ''} /> Refresh Stats
            </button>
            <button
              onClick={handleClearCache}
              disabled={clearing}
              className="btn btn-secondary flex items-center gap-2 text-xs border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
              title="Flush all keys from memory"
            >
              <Trash2 size={14} /> Flush Cache
            </button>
          </div>
        </div>

        {/* Architecture flow */}
        <div className="mt-6 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Activity size={14} className="text-indigo-400" /> Cache Invalidation Architecture
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <div className="font-semibold text-emerald-400 mb-1">1. Read Pattern (Cache-Aside)</div>
              <div>Checks <code className="text-slate-300">all_tasks</code> key. On HIT, returns from RAM in &lt;1ms. On MISS, queries MongoDB and sets cache (TTL 60s).</div>
            </div>
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <div className="font-semibold text-amber-400 mb-1">2. Write Invalidation</div>
              <div>Any POST, PUT, or DELETE immediately purges <code className="text-slate-300">cache.del('all_tasks')</code> to prevent stale dirty reads.</div>
            </div>
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <div className="font-semibold text-indigo-400 mb-1">3. Granular Key Eviction</div>
              <div>Single-item endpoints (<code className="text-slate-300">task_:id</code>) are cached separately and evicted selectively on update/delete.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
        <div className="card stat-card">
          <span className="text-xs text-slate-400 uppercase font-semibold">Cache Hits</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{stats?.hits ?? 0}</div>
          <span className="text-[11px] text-slate-400">Served from RAM</span>
        </div>

        <div className="card stat-card">
          <span className="text-xs text-slate-400 uppercase font-semibold">Cache Misses</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{stats?.misses ?? 0}</div>
          <span className="text-[11px] text-slate-400">MongoDB lookups</span>
        </div>

        <div className="card stat-card">
          <span className="text-xs text-slate-400 uppercase font-semibold">Hit Ratio</span>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{stats?.hitRatio ?? '0.0%'}</div>
          <span className="text-[11px] text-slate-400">Efficiency score</span>
        </div>

        <div className="card stat-card">
          <span className="text-xs text-slate-400 uppercase font-semibold">Active Keys</span>
          <div className="text-2xl font-bold text-sky-400 mt-1">{stats?.keyCount ?? 0}</div>
          <span className="text-[11px] text-slate-400 font-mono truncate">{stats?.activeKeys?.join(', ') || 'empty'}</span>
        </div>

        <div className="card stat-card">
          <span className="text-xs text-slate-400 uppercase font-semibold">Write Invalidations</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">{stats?.invalidations ?? 0}</div>
          <span className="text-[11px] text-slate-400">Cache purges on writes</span>
        </div>
      </div>

      {/* Benchmark Section (Empirical Response Time Comparison) */}
      <div className="card mt-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="text-indigo-400" size={18} /> Empirical Response Time Benchmark (Cached vs Uncached)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated 3-sample empirical test comparing direct MongoDB disk queries against in-memory node-cache.
            </p>
          </div>
          <button
            onClick={handleRunBenchmark}
            disabled={runningBenchmark}
            className="btn btn-primary flex items-center gap-2 text-xs"
          >
            <Zap size={14} className={runningBenchmark ? 'animate-bounce text-amber-300' : ''} />
            {runningBenchmark ? 'Executing Benchmark...' : 'Run 3-Sample Benchmark'}
          </button>
        </div>

        {benchmark ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Uncached Readings Table */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Database size={14} /> Uncached Readings (Direct MongoDB Query)
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-semibold">
                    Avg: {benchmark.averages.uncachedAverageMs} ms
                  </span>
                </div>
                <div className="space-y-2">
                  {benchmark.uncachedReadings.map(r => (
                    <div key={r.sample} className="flex items-center justify-between p-2 rounded bg-slate-950/70 text-xs font-mono">
                      <span className="text-slate-400">Sample #{r.sample}</span>
                      <span className="text-amber-300 font-bold">{r.responseTimeMs} ms</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cached Readings Table */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Zap size={14} /> Cached Readings (In-Memory node-cache)
                  </span>
                  <span className="text-xs font-mono text-emerald-300 font-semibold">
                    Avg: {benchmark.averages.cachedAverageMs} ms
                  </span>
                </div>
                <div className="space-y-2">
                  {benchmark.cachedReadings.map(r => (
                    <div key={r.sample} className="flex items-center justify-between p-2 rounded bg-slate-950/70 text-xs font-mono">
                      <span className="text-slate-400">Sample #{r.sample}</span>
                      <span className="text-emerald-400 font-bold">{r.responseTimeMs} ms</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Benchmark Summary Badge */}
            <div className="mt-4 p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-lg flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-slate-300">
                Latency Reduction: <strong className="text-indigo-300">{benchmark.averages.latencyReductionMs} ms</strong> ({benchmark.averages.percentageImprovement})
              </span>
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-bold font-mono">
                🚀 {benchmark.averages.speedupMultiplier}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            Click <strong>"Run 3-Sample Benchmark"</strong> to execute live latency test against the database and memory.
          </div>
        )}
      </div>

      {/* Recent Cache Events Log */}
      <div className="card mt-6">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Activity size={16} className="text-slate-400" /> Recent Cache Activity Log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">Event Type</th>
                <th className="py-2 px-3">Cache Key(s)</th>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {stats?.recentEvents && stats.recentEvents.length > 0 ? (
                stats.recentEvents.map((evt, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evt.type === 'HIT'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : evt.type === 'MISS'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {evt.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-300">{Array.isArray(evt.keys) ? evt.keys.join(', ') : evt.key}</td>
                    <td className="py-2 px-3 text-slate-500 text-[11px]">{new Date(evt.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2 px-3 text-slate-400">
                      {evt.type === 'HIT' ? 'Memory Return (Fast)' : evt.type === 'MISS' ? 'Populated to Cache' : 'Evicted on Write'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-slate-500">
                    No cache events recorded yet. Navigate tasks or run benchmark to populate events.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


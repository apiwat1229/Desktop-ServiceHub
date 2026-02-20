<template>
  <div class="p-6 max-w-screen-2xl mx-auto space-y-8">
    <!-- Consolidated System Health Card -->
    <Card class="border-none shadow-md bg-white/80 backdrop-blur-sm overflow-hidden relative"> <!-- Added relative for absolute positioning of controls if needed, or we just put them in the layout -->
      
      <!-- Top Right Controls (Version & Refresh) - Positioned absolutely or flexed -->
      <div class="absolute top-4 right-4 flex items-center gap-3 z-10">
        <span class="text-[10px] font-black font-mono text-slate-300/80 tracking-widest uppercase">v{{ appVersion }}</span>
        <Button variant="ghost" size="icon" @click="fetchStatus" :disabled="loading" class="h-8 w-8 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
          <RefreshCw :class="['w-4 h-4', loading && 'animate-spin']" />
          <span class="sr-only">{{ t('admin.systemStatus.refresh') }}</span>
        </Button>
      </div>

      <div class="flex flex-col md:flex-row">
        <!-- Status Section (Left) -->
        <div 
          class="p-8 md:w-1/3 flex flex-col justify-center items-center text-center space-y-4 border-b md:border-b-0 md:border-r border-slate-100 relative"
          :class="status === 'ok' ? 'bg-emerald-50/30' : 'bg-rose-50/30'"
        >
          <div
            class="flex h-20 w-20 items-center justify-center rounded-full shadow-sm transition-all duration-500"
            :class="status === 'ok' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'"
          >
            <CheckCircle2 v-if="status === 'ok'" class="h-10 w-10" />
            <AlertTriangle v-else class="h-10 w-10" />
          </div>
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-slate-900">
              {{
                status === 'ok'
                  ? t('admin.systemStatus.allSystemsOperational')
                  : t('admin.systemStatus.systemIssues')
              }}
            </h2>
            <p class="text-slate-500 font-medium">
              {{
                status === 'ok'
                  ? 'All services are functioning normally.'
                  : 'Some systems are experiencing performance degradation.'
              }}
            </p>
          </div>
        </div>

        <!-- Metrics Grid (Right) -->
        <div class="p-8 md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-12 md:pt-8"> <!-- Added padding top to avoid overlap with controls on mobile if stacked, or adjust as needed -->
            <!-- Uptime -->
            <div class="space-y-2 text-center md:text-left">
                <div class="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
                    <Timer class="h-4 w-4" />
                    {{ t('admin.systemStatus.uptime') }}
                </div>
                <div class="text-3xl font-black text-slate-900 tracking-tight">
                    {{
                    typeof uptime === 'string'
                        ? uptime
                        : uptime
                        ? formatUptimeShort(uptime as number)
                        : '-'
                    }}
                </div>
                 <p class="text-xs text-emerald-600 font-bold bg-emerald-50 inline-block px-2 py-1 rounded-full">
                    Updated just now
                 </p>
            </div>

            <!-- Response Time -->
            <div class="space-y-2 text-center md:text-left">
                <div class="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
                    <Zap class="h-4 w-4" />
                    {{ t('admin.systemStatus.responseTime') }}
                </div>
                <div class="text-3xl font-black text-slate-900 tracking-tight flex items-baseline justify-center md:justify-start gap-1">
                    {{ responseTime ? responseTime.toFixed(0) : '-' }}
                    <span class="text-base font-medium text-slate-400">ms</span>
                </div>
                <p :class="['text-xs font-bold px-2 py-1 rounded-full inline-block', getLatencyColor(responseTime).replace('text-', 'bg-').replace('600', '100') + ' ' + getLatencyColor(responseTime)]">
                    {{ getLatencyStatus(responseTime) }}
                </p>
            </div>

            <!-- Last Checked -->
            <div class="space-y-2 text-center md:text-left">
                <div class="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
                    <Clock class="h-4 w-4" />
                    {{ t('admin.systemStatus.lastChecked') }}
                </div>
                <div class="text-3xl font-black text-slate-900 tracking-tight">
                    {{ lastChecked ? formatTimeRaw(lastChecked) : '-' }}
                </div>
                <p class="text-xs text-slate-400 font-medium">
                    Next check in {{ pollInterval / 1000 }}s
                </p>
            </div>
        </div>
      </div>
    </Card>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- System Services -->
      <Card class="bg-white shadow-sm border-slate-200 col-span-1">
        <CardHeader>
          <CardTitle class="text-lg font-semibold flex items-center gap-2">
            <Server class="w-5 h-5 text-slate-400" />
            {{ t('admin.systemStatus.systemServices') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <!-- API Server -->
            <div class="flex items-center justify-between p-4 rounded-lg border bg-slate-50/50">
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-2.5 h-2.5 rounded-full',
                    status === 'ok' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500',
                  ]"
                ></div>
                <div class="font-medium text-slate-700">API Gateway</div>
              </div>
              <div class="flex items-center gap-4">
                <span
                  class="text-sm font-medium"
                  :class="status === 'ok' ? 'text-emerald-600' : 'text-rose-600'"
                >
                  {{ status === 'ok' ? 'Operational' : 'Issues' }}
                </span>
              </div>
            </div>

            <!-- Database -->
            <div class="flex items-center justify-between p-4 rounded-lg border bg-slate-50/50">
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-2.5 h-2.5 rounded-full',
                    details?.database?.status === 'up' || status === 'ok'
                      ? 'bg-emerald-500'
                      : 'bg-rose-500',
                  ]"
                ></div>
                <div class="font-medium text-slate-700">Database Connection</div>
              </div>
              <div class="flex items-center gap-4">
                <span
                  class="text-sm font-medium"
                  :class="
                    details?.database?.status === 'up' || status === 'ok'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  "
                >
                  {{
                    details?.database?.status === 'up' || status === 'ok'
                      ? 'Operational'
                      : 'Degraded'
                  }}
                </span>
              </div>
            </div>

            <!-- Redis -->
            <div class="flex items-center justify-between p-4 rounded-lg border bg-slate-50/50">
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-2.5 h-2.5 rounded-full',
                    details?.redis?.status === 'up' || status === 'ok'
                      ? 'bg-emerald-500'
                      : 'bg-rose-500',
                  ]"
                ></div>
                <div class="font-medium text-slate-700">Redis Cache</div>
              </div>
              <div class="flex items-center gap-4">
                <span
                  class="text-sm font-medium"
                  :class="
                    details?.redis?.status === 'up' || status === 'ok'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  "
                >
                  {{
                    details?.redis?.status === 'up' || status === 'ok' ? 'Operational' : 'Degraded'
                  }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Checks -->
      <Card class="bg-white shadow-sm border-slate-200 col-span-1">
        <CardHeader>
          <CardTitle class="text-lg font-semibold flex items-center gap-2">
            <History class="w-5 h-5 text-slate-400" />
            {{ t('admin.systemStatus.recentChecks') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="rounded-md border overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-slate-500">
                <tr class="border-b">
                  <th class="h-10 px-4 text-left font-medium">
                    {{ t('admin.systemStatus.status') }}
                  </th>
                  <th class="h-10 px-4 text-left font-medium">Time</th>
                  <th class="h-10 px-4 text-right font-medium">
                    {{ t('admin.systemStatus.latency') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(check, i) in history"
                  :key="i"
                  class="border-b last:border-0 hover:bg-slate-50/50"
                >
                  <td class="p-4">
                    <div class="flex items-center gap-2">
                      <CheckCircle2 v-if="check.status === 'ok'" class="w-4 h-4 text-emerald-500" />
                      <AlertTriangle v-else class="w-4 h-4 text-rose-500" />
                      <span
                        class="font-medium"
                        :class="check.status === 'ok' ? 'text-emerald-700' : 'text-rose-700'"
                      >
                        {{ check.status === 'ok' ? 'OK' : 'Error' }}
                      </span>
                    </div>
                  </td>
                  <td class="p-4 text-slate-600">
                    {{ formatTimeRaw(check.timestamp) }}
                  </td>
                  <td class="p-4 text-right font-mono text-slate-600">
                    {{ check.latency.toFixed(0) }} ms
                  </td>
                </tr>
                <tr v-if="history.length === 0">
                  <td colspan="3" class="p-8 text-center text-muted-foreground">
                    No data available yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Platform Info Section -->
    <div class="space-y-8">
      <Card class="border-none shadow-2xl shadow-black/5 rounded-[10px] overflow-hidden">
        <CardHeader class="bg-primary text-primary-foreground py-10 px-10 relative overflow-hidden">
          <div class="relative z-10 space-y-2">
            <Badge variant="secondary" class="bg-white/20 text-white border-none rounded-lg text-[10px] font-black uppercase tracking-widest px-3 py-1">BUILD INFO</Badge>
            <CardTitle class="text-3xl font-black tracking-tight">YTRC Service Hub</CardTitle>
            <CardDescription class="text-primary-foreground/70 font-bold uppercase tracking-widest text-[10px]">Paperless Repair & Service Management Architecture</CardDescription>
          </div>
          <!-- Abstract Background -->
          <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute right-20 top-0 w-20 h-20 bg-black/5 rounded-full blur-xl"></div>
        </CardHeader>
        <CardContent class="p-10 space-y-10">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="info in [
              { label: 'Platform Version', value: 'V1.1.12', icon: Globe, color: 'text-blue-500' },
              { label: 'System Engine', value: 'Nexus v4.0', icon: Database, color: 'text-amber-500' },
              { label: 'Security Level', value: 'RSA 4096', icon: Shield, color: 'text-emerald-500' },
              { label: 'Deploy ID', value: 'YTRC-8821', icon: Fingerprint, color: 'text-indigo-500' }
            ]" :key="info.label" class="p-6 rounded-[10px] bg-muted/30 border border-border/40 hover:border-primary/20 hover:bg-muted/50 transition-all group">
              <component :is="info.icon" :class="['w-5 h-5 mb-4 group-hover:scale-110 transition-transform', info.color]" />
              <span class="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest block mb-1">{{ info.label }}</span>
              <p class="text-lg font-black tracking-tight">{{ info.value }}</p>
            </div>
          </div>

          <div class="p-8 rounded-[10px] bg-gradient-to-br from-muted/50 to-muted/20 border border-border/40 space-y-4">
            <h4 class="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Shield class="w-4 h-4 text-primary" />
              Legal & Compliance
            </h4>
            <p class="text-sm font-medium text-muted-foreground leading-relaxed">
              Licensed to <strong>YTRC CENTER</strong>. All rights reserved. 
              This platform is optimized for industrial service management and high-concurrency repair ticketing. 
              Redistribution or unauthorized access is strictly prohibited under the system service agreement.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Database,
    Fingerprint,
    Globe,
    History,
    RefreshCw,
    Server,
    Shield,
    Timer,
    Zap
} from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const appVersion = __APP_VERSION__;

interface HealthCheck {
  status: 'ok' | 'error';
  timestamp: Date;
  latency: number;
}

const status = ref<'ok' | 'error' | null>(null);
const uptime = ref<number | string | null>(null);
const lastChecked = ref<Date | null>(null);
const responseTime = ref<number | null>(null);
const loading = ref(false);
const history = ref<HealthCheck[]>([]);
const details = ref<any>(null);

const pollInterval = 10000;
let timer: ReturnType<typeof setInterval> | null = null;

const fetchStatus = async () => {
  loading.value = true;
  const start = performance.now();
  let currentStatus: 'ok' | 'error' = 'error';

  try {
    const res = await fetch('https://app.ytrc.co.th/api/health');
    const end = performance.now();
    const duration = end - start;
    responseTime.value = duration;

    if (res.ok) {
      const data = await res.json();

      // Support both NestJS Terminus style (lowercase) and Custom BE style (Capitalized)
      const rawStatus = data.status || data.Status || '';
      const isOk =
        typeof rawStatus === 'string'
          ? rawStatus === 'ok' ||
            rawStatus.toLowerCase().includes('running') ||
            rawStatus.includes('✅')
          : false;

      currentStatus = isOk ? 'ok' : 'error';
      const rawUptime = data.uptime || data.Uptime || null;
      if (typeof rawUptime === 'string') {
        // Strip out seconds part if it exists (e.g., ": 39 Second" -> "")
        uptime.value = rawUptime.replace(/ : \d+ Second/g, '').replace(/ : Minute/g, ' Minute');
      } else {
        uptime.value = rawUptime;
      }

      // Map details from standardized or custom fields
      const redisRaw = data.redisStatus || data['Redis Status'] || '';
      const isRedisOk =
        typeof redisRaw === 'string' &&
        (redisRaw.toLowerCase().includes('running') || redisRaw.toLowerCase().includes('up'));

      details.value = data.details || {
        database: { status: isOk ? 'up' : 'down' },
        redis: { status: isRedisOk ? 'up' : 'down' },
      };

      lastChecked.value = new Date();
    } else {
      // Even if not ok, might have partial data
      try {
        const data = await res.json();
        details.value = data.details || null;
      } catch (e) {
        details.value = null;
      }
    }
  } catch (error) {
    console.error('Failed to fetch status:', error);
  } finally {
    status.value = currentStatus;
    if (responseTime.value !== null) {
      addToHistory(currentStatus, new Date(), responseTime.value);
    }
    loading.value = false;
  }
};

const addToHistory = (status: 'ok' | 'error', timestamp: Date, latency: number) => {
  history.value.unshift({ status, timestamp, latency });
  if (history.value.length > 5) history.value.pop();
};

const formatUptimeShort = (seconds: number) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  parts.push(`${m}m`);

  return parts.join(' ');
};

const formatTimeRaw = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const getLatencyColor = (ms: number | null) => {
  if (!ms) return 'text-slate-500';
  if (ms < 200) return 'text-emerald-600';
  if (ms < 500) return 'text-amber-600';
  return 'text-rose-600';
};

const getLatencyStatus = (ms: number | null) => {
  if (!ms) return 'Unknown';
  if (ms < 200) return 'Excellent';
  if (ms < 500) return 'Good';
  return 'Slow';
};

onMounted(() => {
  fetchStatus();
  timer = setInterval(fetchStatus, pollInterval);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

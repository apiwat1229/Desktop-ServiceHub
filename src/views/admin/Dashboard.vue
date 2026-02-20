<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { approvalsApi } from '@/services/approvals';
import { bookingsApi } from '@/services/bookings';
import { itTicketsApi, type ITTicket } from '@/services/it-tickets';
import { notificationsApi } from '@/services/notifications';
import { socketService } from '@/services/socket';
import { usersApi } from '@/services/users';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import {
    Activity,
    ArrowUpRight,
    BookOpen,
    Calendar,
    CheckCircle2,
    ClipboardList,
    Clock,
    Monitor,
    Package,
    Plus,
    ThumbsDown,
    ThumbsUp,
    Ticket,
    TrendingUp,
    User,
    Zap
} from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

// State
const stats = ref({
  bookingsToday: 0,
  pendingApprovals: 0,
  unreadNotifications: 0,
  totalUsers: 0,
});

const recentApprovals = ref<any[]>([]);
const onlineUsers = ref<any[]>([]);
const onlineCount = ref(0);
const showOnlineUsersList = ref(false);
const isLoading = ref(true);
const isRefreshing = ref(false);

// IT Helpdesk
const tickets = ref<ITTicket[]>([]);

const ticketStats = computed(() => {
  if (!tickets.value.length) return { total: 0, openCount: 0, inProgressCount: 0, resolved: 0, avgResponse: '0.00', bestResponse: '0.00' };
  const filtered = tickets.value.filter((t: ITTicket) => t.status !== 'Cancelled');
  const openCount = filtered.filter((t: ITTicket) => t.status === 'Open').length;
  const inProgressCount = filtered.filter((t: ITTicket) => t.status === 'In Progress').length;
  const resolvedTickets = filtered.filter((t: ITTicket) => t.status === 'Resolved' || t.status === 'Closed');
  let totalMs = 0, minMs = Infinity;
  resolvedTickets.forEach((t: ITTicket) => {
    const diff = (t.resolvedAt ? new Date(t.resolvedAt) : new Date(t.updatedAt)).getTime() - new Date(t.createdAt).getTime();
    totalMs += diff;
    if (diff < minMs) minMs = diff;
  });
  return {
    total: filtered.length,
    openCount,
    inProgressCount,
    resolved: resolvedTickets.length,
    avgResponse: resolvedTickets.length ? (totalMs / resolvedTickets.length / 3600000).toFixed(2) : '0.00',
    bestResponse: minMs !== Infinity ? (minMs / 3600000).toFixed(2) : '0.00',
  };
});

// ── Analytics Computed ────────────────────────────────────────
const satisfactionStats = computed(() => {
  const rated = tickets.value.filter((t: ITTicket) => t.rating != null);
  if (!rated.length) return { total: 0, positive: 0, neutral: 0, negative: 0, positivePercent: 0, neutralPercent: 0, negativePercent: 0 };
  const positive = rated.filter((t: ITTicket) => (t.rating || 0) >= 4).length;
  const neutral  = rated.filter((t: ITTicket) => (t.rating || 0) === 3).length;
  const negative = rated.filter((t: ITTicket) => (t.rating || 0) <= 2).length;
  return {
    total: rated.length,
    positive, neutral, negative,
    positivePercent: Math.round((positive / rated.length) * 100),
    neutralPercent:  Math.round((neutral  / rated.length) * 100),
    negativePercent: Math.round((negative / rated.length) * 100),
  };
});

const replyTimeStats = computed(() => {
  const resolved = tickets.value.filter((t: ITTicket) => t.resolvedAt);
  const bucket = (t: ITTicket) => {
    const h = (new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime()) / 3600000;
    return h;
  };
  const lt1h  = resolved.filter(t => bucket(t) <= 1).length;
  const h1to8 = resolved.filter(t => bucket(t) > 1  && bucket(t) <= 8).length;
  const h8to24= resolved.filter(t => bucket(t) > 8  && bucket(t) <= 24).length;
  const gt24h = resolved.filter(t => bucket(t) > 24).length;
  const noReply = tickets.value.filter((t: ITTicket) => !t.resolvedAt).length;
  const total = tickets.value.length || 1;
  return { lt1h, h1to8, h8to24, gt24h, noReply, total };
});

const replyTimePieGradient = computed(() => {
  const { lt1h, h1to8, h8to24, gt24h, total } = replyTimeStats.value;
  const deg = (n: number) => (n / total) * 360;
  const d1 = deg(lt1h);
  const d2 = d1 + deg(h1to8);
  const d3 = d2 + deg(h8to24);
  const d4 = d3 + deg(gt24h);
  return `conic-gradient(#0D9488 0deg ${d1}deg, #F59E0B ${d1}deg ${d2}deg, #8B5CF6 ${d2}deg ${d3}deg, #F43F5E ${d3}deg ${d4}deg, #FB923C ${d4}deg 360deg)`;
});

const categoryStats = computed(() => {
  const counts: Record<string, number> = {};
  tickets.value.forEach((t: ITTicket) => {
    if (t.category) counts[t.category] = (counts[t.category] || 0) + 1;
  });
  const total = tickets.value.length || 1;
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count, percent: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
});

const agentStats = computed(() => {
  const counts: Record<string, { name: string; count: number }> = {};
  tickets.value
    .filter((t: ITTicket) => t.status === 'Resolved' || t.status === 'Closed')
    .forEach((t: ITTicket) => {
      if (t.assignee) {
        const id = t.assigneeId || t.assignee.id;
        if (!counts[id]) counts[id] = { name: t.assignee.displayName, count: 0 };
        counts[id].count++;
      }
    });
  return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
});

const recentTicketsList = computed(() => {
  return [...tickets.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

const categoryColors = [
  '#0D9488', '#3B82F6', '#F59E0B', '#8B5CF6', '#F43F5E', '#FB923C'
];

// Live clock
const currentTime = ref(new Date());
let clockInterval: ReturnType<typeof setInterval> | null = null;

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
});

const formattedDate = computed(() => {
  return format(new Date(), 'EEEE, do MMMM yyyy');
});

const formattedTime = computed(() => {
  return format(currentTime.value, 'HH:mm:ss');
});

const fetchDashboardData = async () => {
  if (isRefreshing.value) return;
  isLoading.value = true;
  isRefreshing.value = true;
  try {
    const today = new Date();
    const [bookingsData, approvalsRes, notificationsRes, usersData, ticketsData] = await Promise.all([
      bookingsApi.getAll({ date: titleDate(today) }),
      approvalsApi.getAll({ status: 'PENDING' }),
      notificationsApi.getAll(),
      usersApi.getAll(),
      itTicketsApi.getAll(),
    ]);

    stats.value.bookingsToday = Array.isArray(bookingsData) ? bookingsData.length : 0;
    stats.value.pendingApprovals = Array.isArray(approvalsRes.data) ? approvalsRes.data.length : 0;
    stats.value.unreadNotifications = Array.isArray(notificationsRes.data)
      ? notificationsRes.data.filter((n: any) => !n.isRead).length
      : 0;
    stats.value.totalUsers = Array.isArray(usersData) ? usersData.length : 0;
    tickets.value = Array.isArray(ticketsData) ? ticketsData : [];

    const allApprovals = await approvalsApi.getAll();
    recentApprovals.value = Array.isArray(allApprovals.data)
      ? allApprovals.data
          .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
          .slice(0, 5)
      : [];
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
};

const titleDate = (date: Date) => date.toISOString().split('T')[0];
const formatTime = (dateStr: string) => format(new Date(dateStr), 'HH:mm');
const formatDateStr = (dateStr: string) => format(new Date(dateStr), 'dd-MMM-yyyy');

onMounted(() => {
  fetchDashboardData();
  clockInterval = setInterval(() => { currentTime.value = new Date(); }, 1000);
  socketService.on('presence:update', (data: any) => {
    onlineUsers.value = data.users || [];
    onlineCount.value = data.count || 0;
  });
  socketService.connect();
});

onUnmounted(() => {
  socketService.off('presence:update');
  if (clockInterval) clearInterval(clockInterval);
});
</script>

<template>
  <div class="min-h-full p-6 md:p-8 space-y-8 animate-in fade-in duration-700">
    <!-- Unified Hero + Stats Card -->
    <div class="bg-white dark:bg-card rounded-[14px] shadow-lg shadow-black/5 border border-border/30 overflow-hidden">
      <div class="flex items-stretch">

        <!-- Left: Greeting -->
        <div class="shrink-0 px-4 py-4 space-y-0.5 flex flex-col items-end text-right">
          <h1 class="text-2xl font-black tracking-tight text-foreground leading-tight whitespace-nowrap">
            {{ greeting }}, {{ authStore.user?.firstName || 'Admin' }}
          </h1>
          <div class="flex items-center gap-3 text-muted-foreground font-medium text-xs">
            <div class="flex items-center gap-1.5 leading-none">
              <Calendar class="w-3 h-3" />
              <span>{{ formattedDate }}</span>
            </div>
            <div class="h-1 w-1 rounded-full bg-border"></div>
            <div class="flex items-center gap-1.5 leading-none">
              <Clock class="w-3 h-3 text-emerald-500" />
              <span>{{ formattedTime }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Quick Actions -->
        <div class="shrink-0 ml-auto grid grid-cols-4 divide-x divide-border/30">

          <!-- New Repair Ticket -->
          <button
            class="group flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-primary/[0.03] transition-colors duration-200 text-left"
            @click="router.push('/admin/helpdesk/tickets?action=new')"
          >
            <div class="shrink-0 w-9 h-9 rounded-[10px] bg-primary/10 flex items-center justify-center group-hover:scale-105 group-hover:bg-primary/20 transition-all duration-200">
              <Plus class="w-4 h-4 text-primary" />
            </div>
            <div class="min-w-0">
              <p class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/70 leading-none mb-1">New Ticket</p>
              <div class="text-xs font-bold text-foreground leading-tight">Repair / Issue</div>
            </div>
          </button>

          <!-- Request Equipment -->
          <button
            class="group flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-500/[0.03] transition-colors duration-200 text-left"
            @click="router.push('/admin/helpdesk/asset-requests?action=new')"
          >
            <div class="shrink-0 w-9 h-9 rounded-[10px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-105 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all duration-200">
              <Monitor class="w-4 h-4 text-slate-500" />
            </div>
            <div class="min-w-0">
              <p class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/70 leading-none mb-1">Equipment</p>
              <div class="text-xs font-bold text-foreground leading-tight">Request Asset</div>
            </div>
          </button>

          <!-- IT Inventory -->
          <button
            class="group flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-500/[0.03] transition-colors duration-200 text-left"
            @click="router.push('/admin/helpdesk/inventory')"
          >
            <div class="shrink-0 w-9 h-9 rounded-[10px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-105 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all duration-200">
              <Package class="w-4 h-4 text-slate-500" />
            </div>
            <div class="min-w-0">
              <p class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/70 leading-none mb-1">Inventory</p>
              <div class="text-xs font-bold text-foreground leading-tight">IT Assets</div>
            </div>
          </button>

          <!-- Help Documents -->
          <button
            class="group flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-500/[0.03] transition-colors duration-200 text-left"
            @click="router.push('/admin/helpdesk/kb')"
          >
            <div class="shrink-0 w-9 h-9 rounded-[10px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-105 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all duration-200">
              <BookOpen class="w-4 h-4 text-slate-500" />
            </div>
            <div class="min-w-0">
              <p class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/70 leading-none mb-1">Documents</p>
              <div class="text-xs font-bold text-foreground leading-tight">Manuals & Guides</div>
            </div>
          </button>

        </div>
      </div>
    </div>



    <!-- IT Helpdesk Summary -->
    <div class="space-y-4">

      <!-- Section Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
          <h2 class="text-sm font-bold uppercase tracking-widest text-foreground/70">IT Helpdesk Overview</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          class="text-xs font-bold text-primary gap-1.5 h-7 px-2 hover:bg-primary/5 rounded-[8px]"
          @click="router.push('/admin/helpdesk/overview')"
        >
          View All <ArrowUpRight class="w-3 h-3" />
        </Button>
      </div>

      <!-- Stats + Quick Actions + Performance -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- Left: 4 Stat Mini-Cards (2x2 grid) -->
        <div class="lg:col-span-1 grid grid-cols-2 gap-3">

          <!-- Total Tickets -->
          <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm px-4 py-3.5 flex flex-col gap-1 hover:shadow-md transition-shadow cursor-default">
            <div class="flex items-center justify-between">
              <p class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/70">Total Tickets</p>
              <div class="w-7 h-7 rounded-[8px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Ticket class="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-black tracking-tight text-foreground">{{ ticketStats.total }}</span>
              <span class="text-[0.6rem] font-bold text-muted-foreground/60 uppercase">logged</span>
            </div>
          </div>

          <!-- Active Tasks -->
          <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm px-4 py-3.5 flex flex-col gap-1 hover:shadow-md transition-shadow cursor-pointer"
               @click="router.push('/admin/helpdesk/tickets')">
            <div class="flex items-center justify-between">
              <p class="text-[0.6rem] font-bold uppercase tracking-widest text-blue-500/80">Active Tasks</p>
              <div class="w-7 h-7 rounded-[8px] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Clock class="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-black tracking-tight text-blue-600">{{ ticketStats.openCount + ticketStats.inProgressCount }}</span>
              <span class="text-[0.6rem] font-bold text-blue-500/60 uppercase flex items-center gap-0.5">pending <ArrowUpRight class="w-2.5 h-2.5" /></span>
            </div>
          </div>

          <!-- Resolved -->
          <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm px-4 py-3.5 flex flex-col gap-1 hover:shadow-md transition-shadow cursor-default">
            <div class="flex items-center justify-between">
              <p class="text-[0.6rem] font-bold uppercase tracking-widest text-emerald-600/80">Resolved</p>
              <div class="w-7 h-7 rounded-[8px] bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-black tracking-tight text-emerald-600">{{ ticketStats.resolved }}</span>
              <span class="text-[0.6rem] font-bold text-emerald-500/60 uppercase">fixed</span>
            </div>
          </div>

          <!-- Avg Response -->
          <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm px-4 py-3.5 flex flex-col gap-1 hover:shadow-md transition-shadow cursor-default">
            <div class="flex items-center justify-between">
              <p class="text-[0.6rem] font-bold uppercase tracking-widest text-primary/70">Best SLA</p>
              <div class="w-7 h-7 rounded-[8px] bg-primary/10 flex items-center justify-center">
                <Zap class="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-black tracking-tight text-primary">{{ ticketStats.bestResponse }}</span>
              <span class="text-[0.6rem] font-bold text-primary/60 uppercase">hrs fastest</span>
            </div>
          </div>
        </div>

        <!-- Middle: Quick Actions -->
        <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm overflow-hidden">
          <div class="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <ClipboardList class="w-4 h-4 text-primary" />
            <span class="text-xs font-bold uppercase tracking-widest text-foreground/70">Quick Actions</span>
          </div>
          <div class="p-3 grid grid-cols-2 gap-2">
            <button
              class="group flex items-center gap-3 p-3 rounded-[10px] border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
              @click="router.push('/admin/helpdesk/tickets?action=new')"
            >
              <div class="w-8 h-8 rounded-[8px] bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                <Plus class="w-4 h-4 text-primary" />
              </div>
              <div>
                <div class="text-xs font-bold leading-tight">New Repair Ticket</div>
                <div class="text-[0.6rem] text-muted-foreground leading-tight mt-0.5">Report issues</div>
              </div>
            </button>

            <button
              class="group flex items-center gap-3 p-3 rounded-[10px] border border-border/40 hover:border-border hover:bg-muted/40 transition-all text-left"
              @click="router.push('/admin/helpdesk/asset-requests?action=new')"
            >
              <div class="w-8 h-8 rounded-[8px] bg-muted group-hover:bg-muted/80 flex items-center justify-center shrink-0 transition-colors">
                <Monitor class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div class="text-xs font-bold leading-tight">Request Equipment</div>
                <div class="text-[0.6rem] text-muted-foreground leading-tight mt-0.5">Hardware / Software</div>
              </div>
            </button>

            <button
              class="group flex items-center gap-3 p-3 rounded-[10px] border border-border/40 hover:border-border hover:bg-muted/40 transition-all text-left"
              @click="router.push('/admin/helpdesk/inventory')"
            >
              <div class="w-8 h-8 rounded-[8px] bg-muted group-hover:bg-muted/80 flex items-center justify-center shrink-0 transition-colors">
                <Package class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div class="text-xs font-bold leading-tight">IT Inventory</div>
                <div class="text-[0.6rem] text-muted-foreground leading-tight mt-0.5">Asset stock</div>
              </div>
            </button>

            <button
              class="group flex items-center gap-3 p-3 rounded-[10px] border border-border/40 hover:border-border hover:bg-muted/40 transition-all text-left"
              @click="router.push('/admin/helpdesk/kb')"
            >
              <div class="w-8 h-8 rounded-[8px] bg-muted group-hover:bg-muted/80 flex items-center justify-center shrink-0 transition-colors">
                <BookOpen class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div class="text-xs font-bold leading-tight">Help Documents</div>
                <div class="text-[0.6rem] text-muted-foreground leading-tight mt-0.5">Manuals & Guides</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Right: Service Performance -->
        <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm overflow-hidden">
          <div class="px-4 py-3 border-b border-border/30 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <TrendingUp class="w-4 h-4 text-primary" />
              <span class="text-xs font-bold uppercase tracking-widest text-foreground/70">Service Performance</span>
            </div>
            <div class="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-200/50 dark:border-emerald-500/20">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span class="text-[0.6rem] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Operating</span>
            </div>
          </div>
          <div class="divide-y divide-border/30">
            <div class="px-4 py-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                <div>
                  <div class="text-xs font-semibold text-foreground">Avg. Resolution Time</div>
                  <div class="text-[0.6rem] text-muted-foreground mt-0.5">Performance across all categories</div>
                </div>
              </div>
              <span class="text-base font-black text-foreground tabular-nums">{{ ticketStats.avgResponse }}<span class="text-xs font-bold text-muted-foreground ml-0.5">h</span></span>
            </div>
            <div class="px-4 py-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                <div>
                  <div class="text-xs font-semibold text-foreground">Active Inquiries</div>
                  <div class="text-[0.6rem] text-muted-foreground mt-0.5">Tickets waiting for IT action</div>
                </div>
              </div>
              <span class="text-base font-black text-foreground tabular-nums">{{ ticketStats.openCount }}</span>
            </div>
            <div class="px-4 py-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-violet-500 shrink-0"></div>
                <div>
                  <div class="text-xs font-semibold text-foreground">In Progress</div>
                  <div class="text-[0.6rem] text-muted-foreground mt-0.5">Currently being worked on</div>
                </div>
              </div>
              <span class="text-base font-black text-foreground tabular-nums">{{ ticketStats.inProgressCount }}</span>
            </div>
            <div class="px-4 py-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-indigo-400 shrink-0"></div>
                <div>
                  <div class="text-xs font-semibold text-foreground">Monthly Tickets</div>
                  <div class="text-[0.6rem] text-muted-foreground mt-0.5">Current period activity</div>
                </div>
              </div>
              <span class="text-sm font-black text-indigo-600">+{{ ticketStats.total }} total</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Main Content Area -->
    <div>
      <!-- Recent Activity Table -->
      <Card class="border-none shadow-2xl shadow-black/5 rounded-[14px] overflow-hidden">
        <CardHeader class="bg-card py-5 px-8 border-b border-border/30">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <CardTitle class="text-base font-black tracking-tight flex items-center gap-2">
                <TrendingUp class="w-4 h-4 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">Latest system-wide actions and approvals</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              class="text-xs font-bold text-primary gap-1.5 h-7 px-2 hover:bg-primary/5 rounded-[8px]"
              @click="router.push('/approvals')"
            >
              View All <ArrowUpRight class="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent class="p-0">
          <!-- Table Header -->
          <div class="grid grid-cols-[3rem_1fr_160px_95px_135px_150px_120px] items-center px-6 py-2.5 bg-muted/40 border-b border-border/40">
            <span class="text-[0.6rem] font-black uppercase tracking-widest text-muted-foreground/60">#</span>
            <span class="text-[0.6rem] font-black uppercase tracking-widest text-muted-foreground/60">Requester</span>
            <span class="text-[0.6rem] font-black uppercase tracking-widest text-muted-foreground/60">Action</span>
            <span class="text-[0.6rem] font-black uppercase tracking-widest text-muted-foreground/60">Priority</span>
            <span class="text-[0.6rem] font-black uppercase tracking-widest text-muted-foreground/60">Status</span>
            <span class="text-[0.6rem] font-black uppercase tracking-widest text-muted-foreground/60">Acted By</span>
            <span class="text-[0.6rem] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Time</span>
          </div>

          <!-- Rows -->
          <div
            v-for="(item, idx) in recentApprovals"
            :key="item.id"
            class="group grid grid-cols-[3rem_1fr_160px_95px_135px_150px_120px] items-center px-6 py-3.5 border-b border-border/30 hover:bg-primary/[0.02] transition-colors duration-150 cursor-pointer"
            @click="router.push(`/approvals/${item.id}`)"
          >
            <!-- # Badge -->
            <div>
              <span
                class="inline-flex items-center justify-center w-6 h-6 rounded-full text-[0.65rem] font-black"
                :class="[
                  idx % 5 === 0 ? 'bg-primary/10 text-primary' :
                  idx % 5 === 1 ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                  idx % 5 === 2 ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                  idx % 5 === 3 ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400' :
                                  'bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400'
                ]"
              >{{ idx + 1 }}</span>
            </div>

            <!-- Requester -->
            <div class="flex items-center gap-2.5 min-w-0">
              <Avatar class="w-8 h-8 rounded-[10px] border border-border/40 shadow-sm shrink-0">
                <AvatarFallback class="text-[10px] bg-primary/5 text-primary font-black rounded-[10px]">
                  {{ item.requester?.displayName?.charAt(0) || 'U' }}
                </AvatarFallback>
              </Avatar>
              <div class="min-w-0">
                <div class="text-sm font-bold text-foreground truncate leading-tight">{{ item.requester?.displayName || '—' }}</div>
                <div class="text-[0.6rem] font-bold text-muted-foreground/50 uppercase tracking-widest leading-tight mt-0.5">{{ item.sourceApp || 'System' }}</div>
              </div>
            </div>

            <!-- Action -->
            <div class="flex items-center gap-2 min-w-0">
              <span
                class="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-[5px] text-[0.55rem] font-black uppercase tracking-widest"
                :class="
                  item.actionType === 'CREATE' ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' :
                  item.actionType === 'DELETE' ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400' :
                  item.actionType === 'EDIT'   ? 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400' :
                                                  'bg-muted text-muted-foreground'
                "
              >{{ item.actionType }}</span>
              <span class="text-xs font-bold text-foreground/70 truncate">{{ item.entityType }}</span>
            </div>

            <!-- Priority -->
            <div>
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[0.6rem] font-black uppercase tracking-widest"
                :class="
                  item.priority === 'HIGH'   ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400' :
                  item.priority === 'MEDIUM' ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                                               'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                "
              >
                <span class="w-1.5 h-1.5 rounded-full"
                  :class="
                    item.priority === 'HIGH'   ? 'bg-rose-500' :
                    item.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-slate-400'"
                ></span>
                {{ item.priority || 'LOW' }}
              </span>
            </div>

            <!-- Status Pill -->
            <div>
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest border"
                :class="
                  item.status === 'APPROVED'
                    ? 'border-emerald-300 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                    : item.status === 'PENDING'
                    ? 'border-amber-300 dark:border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
                    : 'border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10'
                "
              >
                <span class="w-1.5 h-1.5 rounded-full"
                  :class="
                    item.status === 'APPROVED' ? 'bg-emerald-500' :
                    item.status === 'PENDING'  ? 'bg-amber-500'  : 'bg-rose-500'"
                ></span>
                {{ item.status }}
              </span>
            </div>

            <!-- Acted By -->
            <div>
              <div v-if="item.approver" class="flex items-center gap-2 min-w-0">
                <Avatar class="w-6 h-6 rounded-[7px] border border-border/40 shadow-sm shrink-0">
                  <AvatarFallback class="text-[9px] bg-muted text-muted-foreground font-black rounded-[7px]">
                    {{ item.approver?.displayName?.charAt(0) || '?' }}
                  </AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <div class="text-xs font-bold text-foreground/70 truncate leading-tight">{{ item.approver?.displayName }}</div>
                  <div v-if="item.actedAt" class="text-[0.55rem] font-bold text-muted-foreground/40 uppercase tracking-widest">{{ formatTime(item.actedAt) }}</div>
                </div>
              </div>
              <span v-else class="text-[0.7rem] text-muted-foreground/30 font-bold">—</span>
            </div>

            <!-- Time -->
            <div class="text-right">
              <div class="text-xs font-black text-foreground">{{ formatTime(item.submittedAt) }}</div>
              <div class="text-[0.6rem] font-bold text-muted-foreground/50 uppercase tracking-wider mt-0.5">{{ formatDateStr(item.submittedAt) }}</div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="recentApprovals.length === 0" class="flex flex-col items-center gap-3 py-24 opacity-20">
            <Activity class="w-12 h-12" />
            <p class="text-sm font-black uppercase tracking-widest">No Recent Activity Recorded</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ── Analytics Section ────────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Customer Satisfaction -->
      <Card class="border-none shadow-2xl shadow-black/5 rounded-[10px] overflow-hidden">
        <CardHeader class="px-6 pt-5 pb-3 flex flex-row items-start justify-between">
          <div>
            <CardTitle class="text-base font-black tracking-tight flex items-center gap-2">
              <ThumbsUp class="w-4 h-4 text-primary" />
              Customer Satisfaction
            </CardTitle>
            <CardDescription class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50 mt-0.5">Based on ticket ratings</CardDescription>
          </div>
        </CardHeader>
        <CardContent class="px-6 pb-5">
          <!-- Total Responses -->
          <div class="mb-4">
            <p class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/60">Responses Received</p>
            <p class="text-2xl font-black tracking-tight text-foreground mt-0.5">{{ satisfactionStats.total }} <span class="text-sm font-bold text-muted-foreground">Tickets Rated</span></p>
          </div>
          <!-- 3 stat grid -->
          <div class="grid grid-cols-3 gap-3">
            <!-- Positive -->
            <div class="p-3 rounded-[10px] bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[0.6rem] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">Positive</span>
                <div class="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center">
                  <ThumbsUp class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
              <p class="text-xl font-black text-teal-700 dark:text-teal-300">{{ satisfactionStats.positivePercent }}%</p>
              <div class="mt-2 h-1 rounded-full bg-teal-100 dark:bg-teal-500/20 overflow-hidden">
                <div class="h-full rounded-full bg-teal-500 transition-all duration-700" :style="{ width: satisfactionStats.positivePercent + '%' }"></div>
              </div>
            </div>
            <!-- Neutral -->
            <div class="p-3 rounded-[10px] bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[0.6rem] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Neutral</span>
                <div class="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                  <ThumbsUp class="w-3.5 h-3.5 text-amber-500" />
                </div>
              </div>
              <p class="text-xl font-black text-amber-700 dark:text-amber-300">{{ satisfactionStats.neutralPercent }}%</p>
              <div class="mt-2 h-1 rounded-full bg-amber-100 dark:bg-amber-500/20 overflow-hidden">
                <div class="h-full rounded-full bg-amber-500 transition-all duration-700" :style="{ width: satisfactionStats.neutralPercent + '%' }"></div>
              </div>
            </div>
            <!-- Negative -->
            <div class="p-3 rounded-[10px] bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[0.6rem] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400">Negative</span>
                <div class="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
                  <ThumbsDown class="w-3.5 h-3.5 text-rose-500" />
                </div>
              </div>
              <p class="text-xl font-black text-rose-700 dark:text-rose-300">{{ satisfactionStats.negativePercent }}%</p>
              <div class="mt-2 h-1 rounded-full bg-rose-100 dark:bg-rose-500/20 overflow-hidden">
                <div class="h-full rounded-full bg-rose-500 transition-all duration-700" :style="{ width: satisfactionStats.negativePercent + '%' }"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Ticket by First Reply Time -->
      <Card class="border-none shadow-2xl shadow-black/5 rounded-[10px] overflow-hidden">
        <CardHeader class="px-6 pt-5 pb-3">
          <CardTitle class="text-base font-black tracking-tight flex items-center gap-2">
            <Clock class="w-4 h-4 text-primary" />
            Ticket By Resolution Time
          </CardTitle>
          <CardDescription class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50 mt-0.5">Distribution of resolution time ranges</CardDescription>
        </CardHeader>
        <CardContent class="px-6 pb-5">
          <div class="flex items-center gap-6">
            <!-- Pie Chart (CSS conic-gradient) -->
            <div class="relative shrink-0">
              <div
                class="w-36 h-36 rounded-full"
                :style="{ background: replyTimePieGradient }"
              ></div>
              <div class="absolute inset-[22%] rounded-full bg-card shadow-inner"></div>
            </div>
            <!-- Legend -->
            <div class="flex-1 space-y-2.5">
              <div
                v-for="(item, i) in [
                  { label: '0–1 Hours',  color: '#0D9488', count: replyTimeStats.lt1h },
                  { label: '1–8 Hours',  color: '#F59E0B', count: replyTimeStats.h1to8 },
                  { label: '8–24 Hours', color: '#8B5CF6', count: replyTimeStats.h8to24 },
                  { label: '> 24 Hours', color: '#F43F5E', count: replyTimeStats.gt24h },
                  { label: 'No Reply',   color: '#FB923C', count: replyTimeStats.noReply },
                ]"
                :key="i"
                class="flex items-center gap-2"
              >
                <span class="w-2.5 h-2.5 rounded-sm shrink-0" :style="{ backgroundColor: item.color }"></span>
                <span class="flex-1 text-xs font-bold text-foreground/70">{{ item.label }}</span>
                <span class="text-xs font-black text-foreground">{{ item.count }}</span>
                <span class="text-[0.6rem] font-bold text-muted-foreground/50 w-10 text-right">
                  {{ replyTimeStats.total ? Math.round((item.count / replyTimeStats.total) * 100) : 0 }}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Ticket by Category -->
      <Card class="border-none shadow-2xl shadow-black/5 rounded-[10px] overflow-hidden">
        <CardHeader class="px-6 pt-5 pb-3">
          <CardTitle class="text-base font-black tracking-tight flex items-center gap-2">
            <ClipboardList class="w-4 h-4 text-primary" />
            Ticket by Category
          </CardTitle>
          <CardDescription class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50 mt-0.5">Volume breakdown by ticket category</CardDescription>
        </CardHeader>
        <CardContent class="px-6 pb-5 space-y-3">
          <div v-if="!categoryStats.length" class="text-center py-8 text-muted-foreground/30 text-xs font-bold uppercase tracking-widest">No data</div>
          <div v-for="(item, i) in categoryStats" :key="item.name" class="space-y-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-sm" :style="{ backgroundColor: categoryColors[i % categoryColors.length] }"></span>
                <span class="text-xs font-bold text-foreground">{{ item.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-black text-foreground">{{ item.count }}</span>
                <span class="text-[0.6rem] font-bold text-muted-foreground/50 w-8 text-right">{{ item.percent }}%</span>
              </div>
            </div>
            <div class="h-2 rounded-full bg-muted overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700"
                :style="{ width: item.percent + '%', backgroundColor: categoryColors[i % categoryColors.length] }"
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Tickets Solved By Agent -->
      <Card class="border-none shadow-2xl shadow-black/5 rounded-[10px] overflow-hidden">
        <CardHeader class="px-6 pt-5 pb-3">
          <CardTitle class="text-base font-black tracking-tight flex items-center gap-2">
            <User class="w-4 h-4 text-primary" />
            Tickets Solved By Agent
          </CardTitle>
          <CardDescription class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50 mt-0.5">Top resolvers this period</CardDescription>
        </CardHeader>
        <CardContent class="px-6 pb-5">
          <div v-if="!agentStats.length" class="text-center py-8 text-muted-foreground/30 text-xs font-bold uppercase tracking-widest">No resolved tickets</div>
          <div v-for="(agent, i) in agentStats" :key="i" class="flex items-center gap-3 py-3 border-b border-border/30 last:border-0">
            <Avatar class="w-10 h-10 rounded-[10px] border border-border/40 shadow-sm shrink-0">
              <AvatarFallback class="text-xs bg-primary/5 text-primary font-black rounded-[10px]">{{ agent.name?.charAt(0) || '?' }}</AvatarFallback>
            </Avatar>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-foreground truncate">{{ agent.name || 'Unknown' }}</p>
              <p class="text-[0.6rem] font-bold text-muted-foreground/50 uppercase tracking-widest">IT Support Agent</p>
            </div>
            <div class="text-right shrink-0">
              <span class="text-sm font-black text-foreground">{{ agent.count }}</span>
              <span class="text-[0.6rem] font-bold text-muted-foreground/60 ml-1">Tickets</span>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>

    <!-- Recent Tickets (full width) -->
    <Card class="border-none shadow-2xl shadow-black/5 rounded-[10px] overflow-hidden">
      <CardHeader class="px-6 pt-5 pb-3 flex flex-row items-start justify-between">
        <div>
          <CardTitle class="text-base font-black tracking-tight flex items-center gap-2">
            <Ticket class="w-4 h-4 text-primary" />
            Recent Tickets
          </CardTitle>
          <CardDescription class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50 mt-0.5">Latest IT helpdesk submissions</CardDescription>
        </div>
        <Button variant="ghost" size="sm" class="text-xs font-bold text-primary gap-1.5 h-7 px-2 hover:bg-primary/5 rounded-[8px]" @click="router.push('/admin/helpdesk/tickets')">
          View All <ArrowUpRight class="w-3 h-3" />
        </Button>
      </CardHeader>
      <CardContent class="px-6 pb-5 space-y-0">
        <div v-if="!recentTicketsList.length" class="text-center py-8 text-muted-foreground/30 text-xs font-bold uppercase tracking-widest">No tickets</div>
        <div
          v-for="ticket in recentTicketsList"
          :key="ticket.id"
          class="group flex items-center gap-4 py-3.5 border-b border-border/30 last:border-0 hover:bg-primary/[0.02] transition-colors duration-150 cursor-pointer rounded-[8px] -mx-2 px-2"
          @click="router.push(`/admin/helpdesk/tickets/${ticket.id}`)"
        >
          <!-- Time -->
          <div class="shrink-0 w-14 text-right">
            <span class="text-sm font-black text-primary/80">{{ formatTime(ticket.createdAt) }}</span>
          </div>
          <!-- Color bar based on status -->
          <div
            class="shrink-0 w-1 h-10 rounded-full"
            :class="
              ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-teal-500' :
              ticket.status === 'In Progress' ? 'bg-blue-400' : 'bg-amber-400'
            "
          ></div>
          <!-- Title + requester -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-foreground truncate leading-tight">{{ ticket.title }}</p>
            <p class="text-[0.6rem] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">by {{ ticket.requester?.displayName || '—' }}</p>
          </div>
          <!-- Status badge -->
          <span
            class="shrink-0 inline-flex items-center px-3 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest"
            :class="
              ticket.status === 'Resolved' || ticket.status === 'Closed'
                ? 'bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300'
                : ticket.status === 'In Progress'
                ? 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300'
                : 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300'
            "
          >{{ ticket.status }}</span>
        </div>
      </CardContent>
    </Card>

    <!-- Online Users Dialog -->
    <Dialog v-model:open="showOnlineUsersList">
      <DialogContent class="sm:max-w-[425px] rounded-[10px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader class="p-8 pt-10 bg-primary text-primary-foreground">
          <DialogTitle class="text-2xl font-black tracking-tight">Active Controllers</DialogTitle>
          <DialogDescription class="text-primary-foreground/70 text-[10px] uppercase font-bold tracking-widest">
            List of users currently interacting with the system core
          </DialogDescription>
        </DialogHeader>
        <div class="p-4 bg-background">
          <div v-if="onlineUsers.length === 0" class="text-center py-12 text-muted-foreground font-bold uppercase tracking-widest text-xs opacity-30">
            No active nodes found
          </div>
          <div class="space-y-3 max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
            <div
              v-for="user in onlineUsers"
              :key="user.id"
              class="flex items-center gap-4 p-3 rounded-[10px] bg-muted/30 border border-transparent hover:border-border/40 transition-all duration-300"
            >
              <Avatar class="w-10 h-10 rounded-[10px] border-2 border-primary/10 shadow-sm">
                <AvatarFallback class="bg-primary/5 text-primary font-black text-xs">
                  {{ user.displayName?.charAt(0) || 'U' }}
                </AvatarFallback>
              </Avatar>
              <div class="flex flex-col gap-0.5">
                <span class="text-sm font-black tracking-tight">{{ user.displayName }}</span>
                <span class="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest overflow-hidden text-ellipsis">{{ user.email }}</span>
              </div>
              <Badge
                variant="outline"
                class="ml-auto text-[8px] h-5 px-2 bg-emerald-500/10 text-emerald-600 border-none font-black uppercase tracking-widest"
              >
                ACTIVE
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  </div>
</template>

<style scoped>
.tracking-tight {
  letter-spacing: -0.04em;
}
.tracking-widest {
  letter-spacing: 0.15em;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
</style>

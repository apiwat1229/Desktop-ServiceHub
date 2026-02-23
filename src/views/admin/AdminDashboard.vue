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
    ArrowUpRight,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    Monitor,
    Package,
    Plus,
    Ticket,
    TrendingUp
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

const recentTicketsList = computed(() => {
  return [...tickets.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

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

  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
};

const titleDate = (date: Date) => date.toISOString().split('T')[0];
const formatTime = (dateStr: string) => format(new Date(dateStr), 'HH:mm');

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

      <!-- Stats + Performance -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Left: 4 Stat Mini-Cards (2x2 grid) -->
        <div class="grid grid-cols-2 gap-4 lg:gap-5">

          <!-- Total Tickets -->
          <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm p-5 sm:p-6 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-default">
            <div class="flex items-center justify-between">
              <p class="text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Total Tickets</p>
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-[8px] sm:rounded-[10px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Ticket class="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
              </div>
            </div>
            <div class="flex items-baseline gap-1 mt-1 sm:mt-2">
              <span class="text-3xl sm:text-4xl font-black tracking-tighter text-foreground">{{ ticketStats.total }}</span>
              <span class="text-[0.65rem] sm:text-[0.7rem] font-bold text-muted-foreground/60 uppercase">logged</span>
            </div>
          </div>

          <!-- Active Tasks -->
          <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm p-5 sm:p-6 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer group"
               @click="router.push('/admin/helpdesk/tickets')">
            <div class="flex items-center justify-between">
              <p class="text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest text-blue-500/80 group-hover:text-blue-600 transition-colors">Active Tasks</p>
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-[8px] sm:rounded-[10px] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                <Clock class="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
            </div>
            <div class="flex items-baseline gap-1 mt-1 sm:mt-2">
              <span class="text-3xl sm:text-4xl font-black tracking-tighter text-blue-600">{{ ticketStats.openCount + ticketStats.inProgressCount }}</span>
              <span class="text-[0.65rem] sm:text-[0.7rem] font-bold text-blue-500/60 uppercase flex items-center gap-0.5">pending <ArrowUpRight class="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /></span>
            </div>
          </div>

          <!-- Resolved -->
          <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm p-5 sm:p-6 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-default">
            <div class="flex items-center justify-between">
              <p class="text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest text-emerald-600/80">Resolved</p>
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-[8px] sm:rounded-[10px] bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              </div>
            </div>
            <div class="flex items-baseline gap-1 mt-1 sm:mt-2">
              <span class="text-3xl sm:text-4xl font-black tracking-tighter text-emerald-600">{{ ticketStats.resolved }}</span>
              <span class="text-[0.65rem] sm:text-[0.7rem] font-bold text-emerald-500/60 uppercase">fixed</span>
            </div>
          </div>

          <!-- Best SLA -->
          <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm p-5 sm:p-6 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-default">
            <div class="flex items-center justify-between">
              <p class="text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest text-primary/80">Best SLA</p>
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-[8px] sm:rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0">
                <Zap class="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
            </div>
            <div class="flex items-baseline gap-1 mt-1 sm:mt-2">
              <span class="text-3xl sm:text-4xl font-black tracking-tighter text-primary">{{ ticketStats.bestResponse }}</span>
              <span class="text-[0.65rem] sm:text-[0.7rem] font-bold text-primary/60 uppercase">hrs fastest</span>
            </div>
          </div>
        </div>

        <!-- Right: Service Performance -->
        <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm overflow-hidden flex flex-col">
          <div class="px-5 sm:px-6 py-4 border-b border-border/30 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div class="flex items-center gap-2">
              <TrendingUp class="w-5 h-5 text-primary" />
              <span class="text-xs sm:text-sm font-black uppercase tracking-widest text-foreground/80">Service Performance</span>
            </div>
            <div class="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-200/50 dark:border-emerald-500/20">
              <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span class="text-[0.65rem] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Operating</span>
            </div>
          </div>
          <div class="divide-y divide-border/30 flex-1 flex flex-col justify-center">
            <div class="px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between hover:bg-muted/30 transition-colors flex-1">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
                <div>
                  <div class="text-sm font-bold text-foreground">Avg. Resolution Time</div>
                  <div class="text-xs text-muted-foreground mt-0.5">Performance across all categories</div>
                </div>
              </div>
              <span class="text-xl sm:text-2xl font-black tracking-tighter text-foreground tabular-nums">{{ ticketStats.avgResponse }}<span class="text-xs font-bold text-muted-foreground ml-1">h</span></span>
            </div>
            <div class="px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between hover:bg-muted/30 transition-colors flex-1">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></div>
                <div>
                  <div class="text-sm font-bold text-foreground">Active Inquiries</div>
                  <div class="text-xs text-muted-foreground mt-0.5">Tickets waiting for IT action</div>
                </div>
              </div>
              <span class="text-xl sm:text-2xl font-black tracking-tighter text-foreground tabular-nums">{{ ticketStats.openCount }}</span>
            </div>
            <div class="px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between hover:bg-muted/30 transition-colors flex-1">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0"></div>
                <div>
                  <div class="text-sm font-bold text-foreground">In Progress</div>
                  <div class="text-xs text-muted-foreground mt-0.5">Currently being worked on</div>
                </div>
              </div>
              <span class="text-xl sm:text-2xl font-black tracking-tighter text-foreground tabular-nums">{{ ticketStats.inProgressCount }}</span>
            </div>
            <div class="px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between hover:bg-muted/30 transition-colors flex-1 bg-indigo-50/30 dark:bg-indigo-900/10">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></div>
                <div>
                  <div class="text-sm font-bold text-foreground">Monthly Tickets</div>
                  <div class="text-xs text-muted-foreground mt-0.5">Current period activity</div>
                </div>
              </div>
              <span class="text-lg sm:text-xl font-black tracking-tighter text-indigo-600">+{{ ticketStats.total }} total</span>
            </div>
          </div>
        </div>

      </div>
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

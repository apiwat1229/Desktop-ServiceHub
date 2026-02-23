<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { itTicketsApi, type ITTicket } from '@/services/it-tickets';
import { socketService } from '@/services/socket';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import {
    ArrowRight,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    LayoutDashboard,
    Monitor,
    PackageSearch,
    Plus,
    Ticket
} from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

// State
const tickets = ref<ITTicket[]>([]);
const isLoading = ref(true);
const isRefreshing = ref(false);

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
    const ticketsData = await itTicketsApi.getAll();
    // Filter tickets to only show those requested by the current user
    if (Array.isArray(ticketsData) && authStore.user?.id) {
        tickets.value = ticketsData.filter(t => t.requesterId === authStore.user?.id);
    } else {
        tickets.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
};

const formatTime = (dateStr: string) => format(new Date(dateStr), 'HH:mm');

onMounted(() => {
  fetchDashboardData();
  clockInterval = setInterval(() => { currentTime.value = new Date(); }, 1000);
  
  // Real-time updates for user's own tickets
  socketService.on("ticket:created", fetchDashboardData);
  socketService.on("ticket:updated", fetchDashboardData);
  socketService.on("ticket:deleted", fetchDashboardData);
});

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval);
  socketService.off("ticket:created", fetchDashboardData);
  socketService.off("ticket:updated");
  socketService.off("ticket:deleted");
});

// Computed Stats for the User
const userStats = computed(() => {
  const total = tickets.value.length;
  const resolved = tickets.value.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
  // Active means anything not resolved, closed, or cancelled
  const active = tickets.value.filter(t => t.status !== 'Resolved' && t.status !== 'Closed' && t.status !== 'Cancelled').length;
  
  // Group by status for the chart
  const open = tickets.value.filter(t => t.status === 'Open' || t.status === 'Pending').length;
  const inProgress = tickets.value.filter(t => t.status === 'In Progress').length;

  return {
      total,
      resolved,
      active,
      open,
      inProgress
  };
});

const recentTicketsList = computed(() => {
  return [...tickets.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});
</script>

<template>
  <div class="min-h-full p-6 md:p-8 space-y-8 animate-in fade-in duration-700">
    <!-- User Hero Section -->
    <div class="bg-white dark:bg-card rounded-[14px] shadow-lg shadow-black/5 border border-border/30 overflow-hidden relative">
      <!-- Background Pattern -->
      <div class="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
      
      <div class="flex flex-col md:flex-row items-stretch">
        <!-- Left: Greeting -->
        <div class="shrink-0 px-8 py-6 md:py-8 space-y-1.5 flex flex-col justify-center relative z-10 w-full md:w-auto">
          <h1 class="text-3xl font-black tracking-tight text-foreground leading-tight whitespace-nowrap">
            {{ greeting }}, {{ authStore.user?.firstName || authStore.user?.username || 'User' }}
          </h1>
          <div class="flex items-center gap-3 text-muted-foreground font-medium text-sm">
            <div class="flex items-center gap-1.5 leading-none">
              <Calendar class="w-4 h-4" />
              <span>{{ formattedDate }}</span>
            </div>
            <div class="h-1 w-1 rounded-full bg-border"></div>
            <div class="flex items-center gap-1.5 leading-none">
              <Clock class="w-4 h-4 text-primary" />
              <span class="tabular-nums">{{ formattedTime }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Important Links (Desktop) -->
        <div class="md:ml-auto grid grid-cols-2 sm:grid-cols-4 divide-y md:divide-y-0 sm:divide-x divide-border/30 w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 border-border/30 bg-slate-50/50">
          <!-- New Ticket -->
          <button
            class="group flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-primary/[0.03] transition-colors duration-200"
            @click="router.push('/admin/helpdesk/tickets?action=new')"
          >
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-sm mb-2">
              <Plus class="w-5 h-5 text-primary" />
            </div>
            <span class="text-xs font-black uppercase tracking-widest text-foreground text-center line-clamp-1">New Ticket</span>
            <span class="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Report Issue</span>
          </button>

          <!-- Request Asset -->
          <button
            class="group flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-slate-500/[0.03] transition-colors duration-200"
            @click="router.push('/admin/helpdesk/asset-requests?action=new')"
          >
            <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all duration-300 shadow-sm mb-2">
              <Monitor class="w-5 h-5 text-slate-600" />
            </div>
            <span class="text-xs font-black uppercase tracking-widest text-foreground text-center line-clamp-1">Need Gear</span>
            <span class="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Request Asset</span>
          </button>

          <!-- My Assets -->
          <button
            class="group flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-slate-500/[0.03] transition-colors duration-200"
            @click="router.push('/profile')"
          >
            <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all duration-300 shadow-sm mb-2">
              <PackageSearch class="w-5 h-5 text-slate-600" />
            </div>
            <span class="text-xs font-black uppercase tracking-widest text-foreground text-center line-clamp-1">My Devices</span>
            <span class="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">View Inventory</span>
          </button>

          <!-- Manuals -->
          <button
            class="group flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-slate-500/[0.03] transition-colors duration-200"
            @click="router.push('/admin/helpdesk/kb')"
          >
            <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all duration-300 shadow-sm mb-2">
              <BookOpen class="w-5 h-5 text-slate-600" />
            </div>
            <span class="text-xs font-black uppercase tracking-widest text-foreground text-center line-clamp-1">Manuals</span>
            <span class="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">IT Guides</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Personal Stats (2/3 width) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center gap-2">
          <div class="w-1 h-5 rounded-full bg-primary"></div>
          <h2 class="text-sm font-black uppercase tracking-widest text-foreground/80">My Service Desk</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Total Submitted -->
          <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm p-5 flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer" @click="router.push('/admin/helpdesk/tickets')">
            <div class="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity transform -translate-y-4 translate-x-4">
                <Ticket class="w-24 h-24" />
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-[8px] bg-slate-100 flex items-center justify-center">
                <Ticket class="w-4 h-4 text-slate-600" />
              </div>
              <p class="text-xs font-black uppercase tracking-widest text-muted-foreground">My Requests</p>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-4xl font-black tracking-tighter text-foreground">{{ userStats.total }}</span>
              <span class="text-xs font-bold text-muted-foreground uppercase">tickets</span>
            </div>
          </div>

          <!-- Active Issues -->
          <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm p-5 flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer" @click="router.push('/admin/helpdesk/tickets')">
            <div class="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity transform -translate-y-4 translate-x-4">
                <Clock class="w-24 h-24 text-blue-500" />
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-[8px] bg-blue-50 flex items-center justify-center">
                <Clock class="w-4 h-4 text-blue-500" />
              </div>
              <p class="text-xs font-black uppercase tracking-widest text-blue-600/80">Active Issues</p>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-4xl font-black tracking-tighter text-blue-600">{{ userStats.active }}</span>
              <span class="text-xs font-bold text-blue-500/60 uppercase">pending</span>
            </div>
          </div>

          <!-- Resolved -->
          <div class="bg-white dark:bg-card rounded-[12px] border border-border/30 shadow-sm p-5 flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer" @click="router.push('/admin/helpdesk/tickets')">
             <div class="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity transform -translate-y-4 translate-x-4">
                <CheckCircle2 class="w-24 h-24 text-emerald-500" />
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-[8px] bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 class="w-4 h-4 text-emerald-500" />
              </div>
              <p class="text-xs font-black uppercase tracking-widest text-emerald-600/80">Resolved</p>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-4xl font-black tracking-tighter text-emerald-600">{{ userStats.resolved }}</span>
              <span class="text-xs font-bold text-emerald-500/60 uppercase">completed</span>
            </div>
          </div>
        </div>
        
        <!-- Recent Tickets List -->
        <Card class="border-none shadow-xl shadow-black/5 rounded-[12px] overflow-hidden">
          <CardHeader class="px-6 py-4 flex flex-row items-center justify-between border-b border-border/30 bg-slate-50/50">
            <div>
              <CardTitle class="text-sm font-black tracking-widest uppercase flex items-center gap-2">
                <LayoutDashboard class="w-4 h-4 text-primary" />
                Latest Submissions
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" class="text-xs font-black tracking-widest uppercase text-primary hover:bg-primary/10 rounded-full px-4 h-8" @click="router.push('/admin/helpdesk/tickets')">
              View All <ArrowRight class="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </CardHeader>
          <CardContent class="p-0">
            <div v-if="!recentTicketsList.length" class="text-center py-10">
                <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Ticket class="w-8 h-8 text-slate-300" />
                </div>
                <p class="text-sm font-bold text-slate-400">You haven't submitted any tickets yet.</p>
                <Button variant="outline" class="mt-4 text-xs font-black uppercase tracking-widest" @click="router.push('/admin/helpdesk/tickets?action=new')">Create First Ticket</Button>
            </div>
            <div v-else class="divide-y divide-border/30">
              <div
                v-for="ticket in recentTicketsList"
                :key="ticket.id"
                class="group flex items-center gap-4 px-6 py-4 hover:bg-primary/[0.02] transition-colors duration-200 cursor-pointer"
                @click="router.push(`/admin/helpdesk/tickets/${ticket.id}`)"
              >
                <!-- Color bar based on status -->
                <div
                  class="shrink-0 w-1.5 h-10 rounded-full shadow-sm"
                  :class="
                    ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-emerald-400' :
                    ticket.status === 'In Progress' ? 'bg-blue-400' : 'bg-amber-400'
                  "
                ></div>
                
                <!-- Ticket Info -->
                <div class="flex-1 min-w-0 pr-4">
                  <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">{{ ticket.ticketNo }}</span>
                      <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span class="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider">{{ format(new Date(ticket.createdAt), 'dd MMM yyyy') }}</span>
                  </div>
                  <p class="text-sm font-black text-slate-800 truncate leading-snug group-hover:text-primary transition-colors">{{ ticket.title }}</p>
                </div>

                <!-- Status badge -->
                <span
                  class="shrink-0 inline-flex items-center px-3 py-1.5 rounded-[8px] text-[0.65rem] font-black uppercase tracking-widest shadow-sm border"
                  :class="
                    ticket.status === 'Resolved' || ticket.status === 'Closed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : ticket.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  "
                >{{ ticket.status }}</span>
                
                <div class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight class="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Quick Status & Info (1/3 width) -->
      <div class="space-y-6">
        <div class="flex items-center gap-2">
          <div class="w-1 h-5 rounded-full bg-slate-800"></div>
          <h2 class="text-sm font-black uppercase tracking-widest text-foreground/80">Request Status</h2>
        </div>

        <Card class="border-none shadow-lg shadow-black/5 rounded-[12px] overflow-hidden bg-slate-800 text-white">
          <CardHeader class="px-6 py-5 pb-0">
             <CardTitle class="text-xs font-black tracking-widest uppercase text-slate-300">Current Distribution</CardTitle>
          </CardHeader>
          <CardContent class="px-6 py-5">
              <div class="space-y-4">
                  <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                           <div class="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                           <span class="text-sm font-bold text-slate-200">Waiting for IT</span>
                      </div>
                      <span class="text-xl font-black">{{ userStats.open }}</span>
                  </div>
                  <div class="w-full h-px bg-slate-700"></div>
                  <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                           <div class="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
                           <span class="text-sm font-bold text-slate-200">In Progress</span>
                      </div>
                      <span class="text-xl font-black">{{ userStats.inProgress }}</span>
                  </div>
                  <div class="w-full h-px bg-slate-700"></div>
                   <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                           <div class="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                           <span class="text-sm font-bold text-slate-200">Successfully Resolved</span>
                      </div>
                      <span class="text-xl font-black">{{ userStats.resolved }}</span>
                  </div>
              </div>
          </CardContent>
        </Card>

        <Card class="border border-primary/20 bg-primary/5 shadow-none rounded-[12px] overflow-hidden">
             <CardContent class="p-5 flex gap-4">
                 <div class="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                     <BookOpen class="w-5 h-5 text-primary" />
                 </div>
                 <div>
                     <h3 class="text-sm font-black text-slate-800 mb-1">Need help?</h3>
                     <p class="text-[0.7rem] font-medium text-slate-600 leading-relaxed mb-3">Check our knowledge base for quick solutions before submitting a ticket.</p>
                     <Button size="sm" variant="outline" class="h-7 text-[0.65rem] font-black uppercase tracking-widest border-primary/30 text-primary hover:bg-primary hover:text-white" @click="router.push('/admin/helpdesk/kb')">Browse Guides</Button>
                 </div>
             </CardContent>
        </Card>
      </div>

    </div>
  </div>
</template>

<style scoped>
.tracking-tight {
  letter-spacing: -0.04em;
}
.tracking-widest {
  letter-spacing: 0.15em;
}
.tracking-wider {
    letter-spacing: 0.05em;
}
</style>

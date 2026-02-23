<script setup lang="ts">
import { ColumnDef } from '@tanstack/vue-table';
import { format, formatDistanceToNowStrict, intervalToDuration } from 'date-fns';
import { Activity, ArrowUpDown, Calendar, Clock, Eye, FileText, Hash, Info, Plus, Search, Star, Type } from 'lucide-vue-next';
import { computed, h, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { toast } from 'vue-sonner';

import NewTicketForm from '@/components/helpdesk/NewTicketForm.vue';
import TicketDetailModal from '@/components/helpdesk/TicketDetailModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DataTable from '@/components/ui/data-table/DataTable.vue';
import DateRangePicker from '@/components/ui/date-range-picker.vue';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import { itTicketsApi, type ITTicket } from '@/services/it-tickets';
import { socketService } from '@/services/socket';
import { getLocalTimeZone, today } from '@internationalized/date';

const { t } = useI18n();
const route = useRoute();
// const router = useRouter();

const tickets = ref<ITTicket[]>([]);
const loadingTickets = ref(false);
const searchQuery = ref('');
const isTicketModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const selectedTicket = ref<ITTicket | null>(null);
const detailViewMode = ref<'management' | 'paper-only'>('management');

// Date Range
const dateRange = ref<any>({
  start: today(getLocalTimeZone()).subtract({ months: 3 }),
  end: today(getLocalTimeZone()),
});

// Status Filter
const statusFilter = ref<string>('ALL');
const statuses = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Cancelled'];

const loadTickets = async () => {
  loadingTickets.value = true;
  try {
    tickets.value = await itTicketsApi.getAll();
  } catch (error) {
    console.error('Failed to load tickets:', error);
    toast.error('Failed to load tickets');
  } finally {
    loadingTickets.value = false;
  }
};

const handleTicketClick = (ticket: ITTicket, mode: 'management' | 'paper-only' = 'management') => {
  selectedTicket.value = ticket;
  detailViewMode.value = mode;
  isDetailModalOpen.value = true;
};

const onTicketUpdated = (updatedTicket: ITTicket) => {
  const index = tickets.value.findIndex((t) => t.id === updatedTicket.id);
  if (index !== -1) {
    tickets.value[index] = updatedTicket;
  }
  selectedTicket.value = updatedTicket;
};

const handleTicketSuccess = () => {
  isTicketModalOpen.value = false;
  loadTickets();
  toast.success('Ticket submitted successfully');
};

const formatTicketDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  const formatted = format(date, 'dd MMM yyyy, HH:mm');
  const now = new Date();
  const duration = intervalToDuration({ start: date, end: now });

  let timeAgo = '';
  if (duration.years) timeAgo = formatDistanceToNowStrict(date, { addSuffix: true });
  else if (duration.months) timeAgo = formatDistanceToNowStrict(date, { addSuffix: true });
  else if (duration.days) timeAgo = `${duration.days}d ago`;
  else if (duration.hours) timeAgo = `${duration.hours}h ago`;
  else timeAgo = `${duration.minutes ?? 0}m ago`;

  return `${formatted} (${timeAgo})`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-blue-100 text-blue-800';
    case 'In Progress': return 'bg-yellow-100 text-yellow-800';
    case 'Pending': return 'bg-orange-100 text-orange-800';
    case 'Resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Closed': return 'bg-gray-100 text-gray-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const formatDurationValue = (ms: number) => {
  if (ms <= 0) return "—";
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
};


const columns: ColumnDef<ITTicket>[] = [
  {
    accessorKey: 'ticketNo',
    header: ({ column }) => {
        return h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            class: 'p-0 hover:bg-transparent font-bold flex items-center gap-2'
        }, () => [
            h(Hash, { class: 'w-3.5 h-3.5 text-primary/60' }),
            'Ticket No', 
            h(ArrowUpDown, { class: 'ml-1 h-3.5 w-3.5 opacity-50' })
        ])
    },
    cell: ({ row }) => h('div', { class: 'font-mono font-bold' }, row.getValue('ticketNo')),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
        return h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            class: 'p-0 hover:bg-transparent font-bold flex items-center gap-2'
        }, () => [
            h(Type, { class: 'w-3.5 h-3.5 text-primary/60' }),
            'Title', 
            h(ArrowUpDown, { class: 'ml-1 h-3.5 w-3.5 opacity-50' })
        ])
    },
    cell: ({ row }) => h('div', { class: 'font-medium max-w-[300px] truncate' }, row.getValue('title')),
  },
  {
    id: 'duration',
    accessorFn: (row) => {
        if (!row.resolvedAt) return 0;
        return new Date(row.resolvedAt).getTime() - new Date(row.createdAt).getTime();
    },
    header: ({ column }) => {
        return h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            class: 'p-0 hover:bg-transparent font-bold flex items-center justify-center gap-2 w-full'
        }, () => [
            h(Clock, { class: 'w-3.5 h-3.5 text-primary/60' }),
            'Duration', 
            h(ArrowUpDown, { class: 'ml-1 h-3.5 w-3.5 opacity-50' })
        ])
    },
    cell: ({ row }) => {
        const ms = row.getValue('duration') as number;
        const duration = formatDurationValue(ms);
        
        // Color coding: Over 3h = Red, 2.5h-3h = Yellow, Under 2.5h = Green
        let colorClass = 'bg-slate-50 text-slate-400 border-slate-100';
        if (ms > 10800000) { // 3 hours in ms
            colorClass = 'bg-rose-50 text-rose-600 border-rose-200';
        } else if (ms > 9000000) { // 2.5 hours in ms
            colorClass = 'bg-amber-50 text-amber-600 border-amber-200';
        } else if (ms > 0) {
            colorClass = 'bg-emerald-50 text-emerald-600 border-emerald-200';
        }

        return h('div', { class: 'text-center' }, [
            h('span', { class: `inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-xs font-black uppercase tracking-wider border transition-all ${colorClass}` }, duration)
        ]);
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
        return h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            class: 'p-0 hover:bg-transparent font-bold flex items-center gap-2'
        }, () => [
            h(Calendar, { class: 'w-3.5 h-3.5 text-primary/60' }),
            'Opened', 
            h(ArrowUpDown, { class: 'ml-1 h-3.5 w-3.5 opacity-50' })
        ])
    },
    cell: ({ row }) => {
        return h('div', { class: 'text-xs text-muted-foreground text-left tabular-nums whitespace-nowrap' }, formatTicketDate(row.getValue('createdAt')));
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => {
        return h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            class: 'p-0 hover:bg-transparent font-bold flex items-center gap-2'
        }, () => [
            h(Star, { class: 'w-3.5 h-3.5 text-primary/60' }),
            'Rating', 
            h(ArrowUpDown, { class: 'ml-1 h-3.5 w-3.5 opacity-50' })
        ])
    },
    cell: ({ row }) => {
        const rating = row.original.rating || 0;
        return h('div', { class: 'flex items-center justify-start gap-0.5' }, 
            Array.from({ length: 5 }).map((_, i) => 
                h(Star, { 
                    class: `w-3.5 h-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-50'}` 
                })
            )
        );
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
        return h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            class: 'p-0 hover:bg-transparent font-bold flex items-center justify-center gap-2 w-full'
        }, () => [
            h(Info, { class: 'w-3.5 h-3.5 text-primary/60' }),
            t('common.status'), 
            h(ArrowUpDown, { class: 'ml-1 h-3.5 w-3.5 opacity-50' })
        ])
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return h('div', { class: 'text-center' }, [
          h(Badge, { 
              class: `px-2.5 py-0.5 rounded-[6px] text-[0.65rem] font-black uppercase tracking-widest ${getStatusColor(status)}`, 
              variant: 'secondary' 
          }, () => status)
      ]);
    },
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Action'),
    cell: ({ row }) => {
      const ticket = row.original;
      return h('div', { class: 'flex items-center justify-center gap-2' }, [
        h(Button, {
          variant: 'outline',
          size: 'sm',
          class: 'h-8 px-3 text-[0.65rem] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm rounded-[6px]',
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            handleTicketClick(ticket, 'paper-only');
          }
        }, () => [h(Eye, { class: 'w-3.5 h-3.5 mr-2' }), 'View']),
        h(Button, {
          variant: 'default',
          size: 'sm',
          class: 'h-8 px-3 text-[0.65rem] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm shadow-emerald-200/50 rounded-[6px] border-none flex items-center',
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            handleTicketClick(ticket, 'management');
          }
        }, () => [h(Activity, { class: 'w-3.5 h-3.5 mr-2' }), 'Follow Up'])
      ]);
    },
  },
];

const filteredTickets = computed(() => {
  let filtered = tickets.value;

  if (statusFilter.value && statusFilter.value !== 'ALL') {
    filtered = filtered.filter(t => t.status === statusFilter.value);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(t => 
      t.ticketNo.toLowerCase().includes(q) || 
      t.title.toLowerCase().includes(q) ||
      (t.requester?.displayName || '').toLowerCase().includes(q)
    );
  }

  if (dateRange.value?.start && dateRange.value?.end) {
    try {
      const start = (dateRange.value.start as any).toDate(getLocalTimeZone());
      const end = (dateRange.value.end as any).toDate(getLocalTimeZone());
      end.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(t => {
          const d = new Date(t.createdAt);
          return d >= start && d <= end;
      });
    } catch (e) {
      console.error('Date filtering error:', e);
    }
  }

  return filtered;
});

onMounted(() => {
  loadTickets();
  
  // Join the IT helpdesk room for department-wide real-time updates
  socketService.joinRoom('it-helpdesk');

  socketService.on('ticket:created', () => {
    console.log('[Socket] New ticket created, reloading...');
    loadTickets();
  });

  socketService.on('ticket:updated', (updatedTicket: ITTicket) => {
    console.log('[Socket] Ticket updated:', updatedTicket.ticketNo);
    onTicketUpdated(updatedTicket);
  });

  socketService.on('ticket:deleted', (id: string) => {
    console.log('[Socket] Ticket deleted:', id);
    tickets.value = tickets.value.filter(t => t.id !== id);
  });

  socketService.on('ticket:commented', ({ ticketId }: { ticketId: string }) => {
    console.log('[Socket] New comment on ticket:', ticketId);
    // Optionally reload or find and update just that ticket
    loadTickets();
  });
  
  if (route.query.action === 'new') {
      isTicketModalOpen.value = true;
  }
});

onUnmounted(() => {
  socketService.off('ticket:created');
  socketService.off('ticket:updated');
  socketService.off('ticket:deleted');
  socketService.off('ticket:commented');
});
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold flex items-center gap-2">
            <FileText class="w-5 h-5 text-primary" />
            {{ t('services.itHelp.tabs.tickets') }}
        </h3>
        <p class="text-sm text-muted-foreground">Manage and track support requests</p>
      </div>
      <div class="flex items-center gap-3">
         <Select v-model="statusFilter">
            <SelectTrigger class="w-[150px] h-9">
                <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem v-for="status in statuses" :key="status" :value="status">{{ status }}</SelectItem>
            </SelectContent>
         </Select>

         <DateRangePicker v-model="dateRange" class="w-[280px]" />

         <div class="relative">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
              v-model="searchQuery"
              placeholder="Search tickets..."
              class="pl-9 h-9 w-[200px] lg:w-[300px]"
            />
         </div>
         
         <Button size="sm" class="gap-2 h-9 font-bold" @click="isTicketModalOpen = true">
            <Plus class="w-4 h-4" />
            {{ t('services.itHelp.ticket.newBtn') }}
         </Button>
      </div>
    </div>

    <Card>
      <CardContent class="p-0">
        <div v-if="loadingTickets" class="p-8 space-y-8 animate-in fade-in duration-700">
           <!-- Modern Branded Loading -->
           <div class="flex flex-col items-center justify-center py-16 space-y-6">
              <div class="relative group">
                 <!-- Modern Glow Effect -->
                 <div class="absolute -inset-4 bg-gradient-to-r from-primary/30 to-cyan-400/30 rounded-[2.5rem] blur-2xl animate-pulse group-hover:blur-3xl transition-all duration-700"></div>
                 
                 <!-- Glassmorphism Container -->
                 <div class="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/20 dark:border-slate-800/50 flex items-center justify-center overflow-hidden">
                    <!-- Modern Stylized SVG Logo -->
                    <svg viewBox="0 0 100 100" class="w-16 h-16 animate-[spin_10s_linear_infinite]">
                        <defs>
                            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#3b82f6" />
                                <stop offset="100%" stop-color="#06b6d4" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        <!-- Stylized Hexagon/Bolt Shape -->
                        <path d="M50 5 L85 25 L85 65 L50 85 L15 65 L15 25 Z" fill="none" stroke="url(#logo-grad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" />
                        <path d="M50 30 L50 70 M30 50 L70 50" stroke="url(#logo-grad)" stroke-width="8" stroke-linecap="round" opacity="0.8" />
                        <circle cx="50" cy="50" r="12" fill="url(#logo-grad)" />
                    </svg>
                 </div>
              </div>

              <div class="flex flex-col items-center space-y-3">
                 <div class="text-xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-white dark:via-primary dark:to-white bg-clip-text text-transparent">
                    Service Hub
                 </div>
                 <div class="flex items-center gap-2">
                    <span class="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">Initialization</span>
                    <div class="flex gap-1">
                        <div class="w-1 h-1 rounded-full bg-primary/40 animate-bounce"></div>
                        <div class="w-1 h-1 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]"></div>
                        <div class="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                 </div>
              </div>
           </div>
           
           <!-- Refined Skeleton Table -->
           <div class="border rounded-2xl overflow-hidden bg-slate-50/30 dark:bg-slate-900/30 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 shadow-sm">
              <div class="bg-white/50 dark:bg-slate-900/50 border-b p-5 flex gap-12 items-center">
                 <Skeleton v-for="i in 5" :key="i" class="h-3.5 w-28 bg-slate-200/50 dark:bg-slate-800/50" />
              </div>
              <div class="p-4 space-y-5">
                 <div v-for="i in 4" :key="i" class="flex gap-6 items-center animate-pulse">
                    <Skeleton class="h-12 w-12 rounded-2xl bg-slate-200/40 dark:bg-slate-800/40" />
                    <div class="flex-1 space-y-3">
                       <Skeleton class="h-4 w-3/4 rounded-full bg-slate-200/40 dark:bg-slate-800/40" />
                       <Skeleton class="h-3 w-1/4 rounded-full bg-slate-200/30 dark:bg-slate-800/30" />
                    </div>
                    <div class="flex gap-2">
                        <Skeleton class="h-8 w-20 rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
                        <Skeleton class="h-8 w-8 rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
        <DataTable v-else :columns="columns" :data="filteredTickets" :initialPageSize="10" />
      </CardContent>
    </Card>

    <!-- New Ticket Modal -->
    <Dialog v-model:open="isTicketModalOpen">
      <DialogContent class="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ t('services.itHelp.ticket.newTitle') }}</DialogTitle>
          <DialogDescription>
            {{ t('services.itHelp.ticket.subtitle') }}
          </DialogDescription>
        </DialogHeader>
        <NewTicketForm @success="handleTicketSuccess" @cancel="isTicketModalOpen = false" />
      </DialogContent>
    </Dialog>

    <TicketDetailModal
      v-model:open="isDetailModalOpen"
      :ticket="selectedTicket"
      :viewMode="detailViewMode"
      @ticketUpdated="onTicketUpdated"
    />
  </div>
</template>

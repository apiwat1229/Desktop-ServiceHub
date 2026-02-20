<script setup lang="ts">
import { ColumnDef } from '@tanstack/vue-table';
import { format, formatDistanceToNowStrict, intervalToDuration } from 'date-fns';
import { ArrowUpDown, FileText, Plus, Search } from 'lucide-vue-next';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Spinner from '@/components/ui/spinner/Spinner.vue';

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
const dateRange = ref({
  start: today(getLocalTimeZone()).subtract({ months: 1 }),
  end: today(getLocalTimeZone()),
}) as any;

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
    case 'Resolved': return 'bg-green-100 text-green-800';
    case 'Closed': return 'bg-gray-100 text-gray-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const columns: ColumnDef<ITTicket>[] = [
  {
    accessorKey: 'ticketNo',
    header: ({ column }) => {
        return h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            class: 'p-0 hover:bg-transparent font-bold'
        }, () => ['Ticket No', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => h('div', { class: 'font-mono font-bold' }, row.getValue('ticketNo')),
  },
  {
    accessorKey: 'title',
    header: t('services.itHelp.columns.title'),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('title')),
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return h(Badge, { class: getStatusColor(status), variant: 'secondary' }, () => status);
    },
  },
  {
    accessorKey: 'priority',
    header: t('services.itHelp.columns.priority'),
    cell: ({ row }) => {
        const priority = row.getValue('priority') as string;
        let colorClass = 'bg-slate-100 text-slate-800';
        if (priority === 'High') colorClass = 'bg-orange-100 text-orange-800';
        if (priority === 'Critical') colorClass = 'bg-red-100 text-red-800';
        if (priority === 'Medium') colorClass = 'bg-blue-100 text-blue-800';
        return h(Badge, { class: colorClass, variant: 'outline' }, () => priority);
    }
  },
  {
      accessorKey: 'requester',
      header: 'Requester',
      cell: ({ row }) => {
          const requester = row.original.requester;
          return h('div', requester?.displayName || '-');
      }
  },
  {
    accessorKey: 'createdAt',
    header: t('common.date'),
    cell: ({ row }) => {
        return h('div', { class: 'text-xs text-muted-foreground' }, formatTicketDate(row.getValue('createdAt')));
    },
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const ticket = row.original;
      return h('div', { class: 'flex items-center gap-2' }, [
        h(Button, {
          variant: 'outline',
          size: 'sm',
          class: 'h-8 px-3 text-[0.65rem] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm rounded-[6px]',
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            handleTicketClick(ticket, 'paper-only');
          }
        }, () => 'View'),
        h(Button, {
          variant: 'default',
          size: 'sm',
          class: 'h-8 px-3 text-[0.65rem] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm shadow-emerald-200/50 rounded-[6px] border-none',
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            handleTicketClick(ticket, 'management');
          }
        }, () => 'Follow Up')
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
    const start = dateRange.value.start.toDate(getLocalTimeZone());
    const end = dateRange.value.end.toDate(getLocalTimeZone());
    end.setDate(end.getDate() + 1);
    
    filtered = filtered.filter(t => {
        const d = new Date(t.createdAt);
        return d >= start && d < end;
    });
  }

  return filtered;
});

onMounted(() => {
  loadTickets();
  socketService.on('ticket:created', loadTickets);
  socketService.on('ticket:updated', (updatedTicket: ITTicket) => onTicketUpdated(updatedTicket));
  socketService.on('ticket:deleted', loadTickets);
  
  if (route.query.action === 'new') {
      isTicketModalOpen.value = true;
  }
});

onUnmounted(() => {
  socketService.off('ticket:created', loadTickets);
  socketService.off('ticket:updated');
  socketService.off('ticket:deleted');
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
        <div v-if="loadingTickets" class="flex justify-center py-12">
           <Spinner class="h-8 w-8 text-primary" />
        </div>
        <DataTable v-else :columns="columns" :data="filteredTickets" />
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

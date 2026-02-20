<script setup lang="ts">
import { ColumnDef } from '@tanstack/vue-table';
import { format, formatDistanceToNowStrict, intervalToDuration } from 'date-fns';
import {
    ArrowUpDown,
    CheckCircle2,
    Clock,
    Monitor,
    Search
} from 'lucide-vue-next';
import { computed, h, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { toast } from 'vue-sonner';

import AssetRequestForm from '@/components/helpdesk/AssetRequestForm.vue';
import TicketDetailModal from '@/components/helpdesk/TicketDetailModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DataTable from '@/components/ui/data-table/DataTable.vue';
import DateRangePicker from '@/components/ui/date-range-picker.vue';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Spinner from '@/components/ui/spinner/Spinner.vue';

import { usePermissions } from '@/composables/usePermissions';
import { itTicketsApi, type ITTicket } from '@/services/it-tickets';
import { socketService } from '@/services/socket';
import { useAuthStore } from '@/stores/auth';
import { getLocalTimeZone, today } from '@internationalized/date';

const { t } = useI18n();
const { isAdmin } = usePermissions();
const authStore = useAuthStore();

const tickets = ref<ITTicket[]>([]);
const loadingTickets = ref(false);
const searchQuery = ref('');
const isAssetModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const selectedTicket = ref<ITTicket | null>(null);

// Date Range
const dateRange = ref({
  start: today(getLocalTimeZone()).subtract({ months: 1 }),
  end: today(getLocalTimeZone()),
}) as any;

const isITDepartment = computed(() => {
  if (isAdmin.value) return true;
  const userDept = authStore.user?.department;
  return userDept === 'Information Technology' || userDept === 'เทคโนโลยีสารสนเทศ (IT)';
});

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

const handleTicketClick = (ticket: ITTicket) => {
  selectedTicket.value = ticket;
  isDetailModalOpen.value = true;
};

const onTicketUpdated = (updatedTicket: ITTicket) => {
  const index = tickets.value.findIndex((t) => t.id === updatedTicket.id);
  if (index !== -1) {
    tickets.value[index] = updatedTicket;
  }
  selectedTicket.value = updatedTicket;
};


const handleAssetSuccess = () => {
  isAssetModalOpen.value = false;
  loadTickets();
  toast.success('Asset request submitted successfully');
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
    accessorKey: 'createdAt',
    header: t('common.date'),
    cell: ({ row }) => {
        return h('div', { class: 'text-xs text-muted-foreground' }, formatTicketDate(row.getValue('createdAt')));
    },
  },
   {
    id: 'actions',
    cell: ({ row }) => {
      return h(Button, {
        variant: 'ghost',
        size: 'sm',
        onClick: () => handleTicketClick(row.original)
      }, () => 'View');
    },
  },
];

const assetRequests = computed(() => {
  return tickets.value.filter((t) => t.isAssetRequest);
});

const assetStats = computed(() => {
  if (!assetRequests.value.length) {
    return {
      total: 0,
      open: 0,
      openCount: 0,
      inProgressCount: 0,
      resolved: 0,
      avgResponse: '0.00',
      bestResponse: '0.00',
    };
  }

  // Filter asset requests for the selected date range
  const filtered = assetRequests.value.filter((t) => {
    // Exclude Cancelled tickets first
    if (t.status === 'Cancelled') return false;

    if (!dateRange.value?.start || !dateRange.value?.end) return true;

    const ticketDate = new Date(t.createdAt);
    const start = dateRange.value.start.toDate(getLocalTimeZone());
    const end = dateRange.value.end.toDate(getLocalTimeZone());
    // Add 1 day to end date to include the full end day
    end.setDate(end.getDate() + 1);

    return ticketDate >= start && ticketDate < end;
  });

  const openCount = filtered.filter((t) => t.status === 'Open').length;
  const inProgressCount = filtered.filter((t) => t.status === 'In Progress').length;
  const resolvedTickets = filtered.filter((t) => t.status === 'Resolved' || t.status === 'Closed');

  return {
    total: filtered.length,
    openCount,
    inProgressCount,
    resolved: resolvedTickets.length,
  };
});

const filteredRequests = computed(() => {
  let filtered = assetRequests.value;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(t => 
      t.ticketNo.toLowerCase().includes(q) || 
      t.title.toLowerCase().includes(q)
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
  
  if (useRoute().query.action === 'new') {
      isAssetModalOpen.value = true;
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
     <!-- Assets Overview Stats (Always shown for IT Department) -->
     <div v-if="isITDepartment" class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-muted-foreground">Assets Overview</h3>
            <div class="flex items-center gap-3">
              <!-- Search Popover -->
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    size="icon"
                    class="h-9 w-9 text-muted-foreground hover:text-primary bg-white/50 hover:bg-white shadow-sm border-slate-200"
                  >
                    <Search class="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-80 p-2" align="start">
                  <div class="flex items-center gap-2">
                    <Search class="h-4 w-4 text-muted-foreground" />
                    <Input
                      v-model="searchQuery"
                      :placeholder="t('services.itHelp.searchPlaceholder')"
                      class="h-8 border-none focus-visible:ring-0 shadow-none"
                      auto-focus
                    />
                  </div>
                </PopoverContent>
              </Popover>

              <!-- Date Picker -->
              <DateRangePicker
                v-model="dateRange"
                class="h-9 w-[280px] justify-center text-foreground font-normal bg-white/50 hover:bg-white shadow-sm transition-all border-slate-200 text-xs"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
            <Card>
              <CardContent class="p-3 text-center">
                <p class="text-[0.7rem] font-medium text-muted-foreground uppercase tracking-tight">
                  Total
                </p>
                <h4 class="text-xl font-bold">{{ assetStats.total }}</h4>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="p-3 text-center">
                <p class="text-[0.7rem] font-medium text-blue-600 uppercase tracking-tight">Open</p>
                <h4 class="text-xl font-bold text-blue-600">{{ assetStats.openCount }}</h4>
              </CardContent>
            </Card>
            <Card class="border-l-4 border-l-primary overflow-hidden">
              <CardContent class="p-3 text-center">
                <p
                  class="text-[0.7rem] font-medium text-primary uppercase tracking-tight flex items-center justify-center gap-1"
                >
                  <Clock class="w-3 h-3" /> In Progress
                </p>
                <h4 class="text-xl font-bold">{{ assetStats.inProgressCount }}</h4>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="p-3 text-center bg-green-50/30">
                <p
                  class="text-[0.7rem] font-medium text-green-600 uppercase tracking-tight flex items-center justify-center gap-1"
                >
                  <CheckCircle2 class="w-3 h-3" /> Resolved
                </p>
                <h4 class="text-xl font-bold text-green-600">{{ assetStats.resolved }}</h4>
              </CardContent>
            </Card>
          </div>
     </div>
     
     <div v-if="!isITDepartment" class="flex justify-between items-center">
        <h3 class="text-lg font-semibold flex items-center gap-2">
            <Monitor class="w-5 h-5 text-primary" />
            My Asset Requests
        </h3>
        <Button size="sm" class="gap-2 h-9 font-bold" @click="isAssetModalOpen = true">
            <Monitor class="w-4 h-4" />
            Request Equipment
        </Button>
     </div>


    <Card>
      <CardContent class="p-0">
        <div v-if="loadingTickets" class="flex justify-center py-12">
           <Spinner class="h-8 w-8 text-primary" />
        </div>
        <DataTable v-else :columns="columns" :data="filteredRequests" />
      </CardContent>
    </Card>

    <!-- New Asset Request Modal -->
    <Dialog v-model:open="isAssetModalOpen">
      <DialogContent class="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Equipment</DialogTitle>
          <DialogDescription>
            Submit a request for new hardware or software.
          </DialogDescription>
        </DialogHeader>
        <AssetRequestForm @success="handleAssetSuccess" @cancel="isAssetModalOpen = false" />
      </DialogContent>
    </Dialog>

    <!-- Ticket Detail Modal -->
    <TicketDetailModal
      v-model:open="isDetailModalOpen"
      :ticket="selectedTicket"
      @ticketUpdated="onTicketUpdated"
    />
  </div>
</template>

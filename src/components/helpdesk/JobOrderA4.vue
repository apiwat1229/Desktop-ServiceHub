<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getAvatarUrl } from '@/lib/utils';
import type { ITTicket } from '@/services/it-tickets';
import { format } from 'date-fns';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  ticket: ITTicket | null;
  isEditable: boolean;
  canManage: boolean;
  availableAssignees: any[];
  resolutionDuration: string | null;
  getStatusColor: (status: string) => string;
}>();

const emit = defineEmits<{
  (e: 'update:ticket', ticket: ITTicket): void;
  (e: 'update:assignee', value: string): void;
  (e: 'update:priority', value: string): void;
  (e: 'update:status', value: string): void;
}>();

const localTicket = ref<ITTicket | null>(null);
const isEditingTitle = ref(false);

watch(() => props.ticket, (val) => {
  if (val) localTicket.value = { ...val };
}, { immediate: true });

const selectedAssignee = computed({
  get: () => props.ticket?.assigneeId || 'unassigned',
  set: (val) => emit('update:assignee', val)
});

const selectedPriority = computed({
  get: () => props.ticket?.priority || '',
  set: (val) => emit('update:priority', val)
});

const selectedStatus = computed({
  get: () => props.ticket?.status || '',
  set: (val) => emit('update:status', val)
});

const userInitials = (user?: any) => {
  if (!user || (!user.firstName && !user.displayName)) return 'U';
  const name = user.displayName || user.firstName;
  return name.charAt(0).toUpperCase();
};

const startEditingTitle = () => {
  if (props.canManage && props.isEditable) {
    isEditingTitle.value = true;
  }
};
</script>

<template>
  <div id="job-order-paper" class="mx-auto bg-white shadow-xl ring-1 ring-slate-200 w-full max-w-[800px] min-h-[1050px] p-10 print:shadow-none print:ring-0 print:m-0 flex flex-col space-y-6">
    
    <!-- Document Header -->
    <div class="flex justify-between items-start border-b-2 border-slate-900 pb-6">
      <div class="flex-1">
        <div class="flex items-center gap-5 mt-1">
          <div class="shrink-0 flex items-center">
            <img src="/logo-dark.png" alt="Company Logo" class="h-6 w-auto object-contain" />
          </div>
          <div class="flex flex-col">
            <h1 class="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">IT SERVICE JOB ORDER</h1>
            <p class="text-[0.55rem] font-bold text-slate-400 mt-1.5 uppercase tracking-[0.05em] leading-none">ServiceHub Management System - Infrastructure & Support</p>
          </div>
        </div>
      </div>
      <div class="text-right flex flex-col items-end">
        <div class="px-6 py-3 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center shadow-sm min-w-[140px]">
          <span class="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Ticket Number</span>
          <span class="text-2xl font-black text-slate-900 tracking-tighter leading-none">{{ localTicket?.ticketNo }}</span>
        </div>
      </div>
    </div>

    <!-- Section 1: Requester Information (Grid Form) -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        1. Requester Information / รายละเอียดผู้แจ้งซ่อม
      </div>
      <div class="grid grid-cols-2 text-[0.7rem] font-bold">
        <div class="p-3 border-r border-b border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Name / ชื่อผู้แจ้ง:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ localTicket?.requester?.displayName || localTicket?.requester?.username }}</span>
        </div>
        <div class="p-3 border-b border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Department-Location / แผนก-สถานที่:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ localTicket?.location || 'General' }}</span>
        </div>
        <div class="p-3 border-r border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Request Date / วันที่แจ้ง:</span>
          <span class="text-slate-900 text-sm font-black">
            {{ localTicket ? format(new Date(localTicket.createdAt), 'dd MMM yyyy, HH:mm') : '-' }}
          </span>
        </div>
        <div class="p-3 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Job Category / ประเภทงาน:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ localTicket?.category }}</span>
        </div>
      </div>
    </div>

    <!-- Section 2: Problem Details -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        2. Problem Description / รายละเอียดปัญหาและความต้องการ
      </div>
      <div class="p-5 space-y-4">
        <div class="flex flex-col gap-2 border-b border-slate-100 pb-4 print:pb-2 print:border-slate-300">
          <div class="flex items-baseline gap-2">
            <span class="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded print:bg-transparent print:p-0 print:text-slate-500 whitespace-nowrap">Subject:</span>
            <div class="flex-1">
               <DialogTitle v-if="!isEditingTitle" @click="startEditingTitle" class="text-sm font-medium text-slate-900 cursor-pointer hover:text-primary transition-colors uppercase leading-none print:text-black print:text-sm">
                 {{ localTicket?.title }}
               </DialogTitle>
               <Input v-else v-model="localTicket!.title" @blur="isEditingTitle = false" @keyup.enter="isEditingTitle = false" autoFocus class="text-sm font-medium h-auto px-0 py-0 border-transparent bg-transparent shadow-none focus-visible:ring-0 uppercase -mt-1 print:hidden" />
            </div>
          </div>
        </div>
        <div class="min-h-[120px] text-sm leading-relaxed text-slate-700 font-medium print:text-black print:min-h-0">
          <div v-if="canManage && isEditable" class="bg-slate-50 border border-dashed border-slate-200 rounded-lg print:border-none print:bg-transparent print:p-0">
            <Textarea 
              v-model="localTicket!.description"
              @update:modelValue="(val) => emit('update:ticket', { ...localTicket!, description: val } as ITTicket)"
              class="min-h-[120px] bg-transparent border-0 focus-visible:ring-0 resize-none text-[0.8rem] leading-relaxed p-4 font-medium text-slate-700 shadow-none border-b-0 print:hidden" 
            />
            <!-- Print-only description (remove border and bg in print logic) -->
            <div class="hidden print:block whitespace-pre-wrap font-medium text-slate-900">
               {{ localTicket?.description || 'No detailed description provided.' }}
            </div>
          </div>
          <div v-else class="whitespace-pre-wrap font-medium text-slate-900">
            {{ localTicket?.description || 'No detailed description provided.' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3: Technical & Resolution -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        3. Technician & Diagnosis / ส่วนของเจ้าหน้าที่และผลการตรวจสอบ
      </div>
      <div class="grid grid-cols-2 text-[0.7rem] font-bold">
        <div class="p-3 border-r border-b border-slate-900 flex flex-col gap-1.5">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Assignee / ผู้รับผิดชอบ:</span>
          <div class="flex items-center gap-2 text-slate-900 font-black uppercase text-sm">
            <Avatar class="w-5 h-5 shadow-sm ring-1 ring-slate-100 shrink-0">
               <AvatarImage :src="getAvatarUrl(availableAssignees.find(u => u.id === selectedAssignee)?.avatar)" />
               <AvatarFallback class="bg-primary/5 text-primary text-[0.5rem] font-bold">{{ userInitials(availableAssignees.find(u => u.id === selectedAssignee)) }}</AvatarFallback>
            </Avatar>
            <span>{{ availableAssignees.find(u => u.id === selectedAssignee)?.displayName || availableAssignees.find(u => u.id === selectedAssignee)?.username || 'Waiting for IT Assignment' }}</span>
          </div>
        </div>
        <div class="p-3 border-b border-slate-900 flex flex-col gap-1.5">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Ticket Urgency / ระดับความสำคัญ:</span>
          <div class="flex items-center gap-2 text-slate-900 font-black uppercase text-sm">
             <div :class="['w-1.5 h-1.5 rounded-full shrink-0', 
               selectedPriority === 'Critical' ? 'bg-rose-500' : 
               selectedPriority === 'High' ? 'bg-amber-500' : 
               selectedPriority === 'Medium' ? 'bg-blue-500' : 'bg-emerald-500']"></div>
             <span>{{ selectedPriority }} Priority</span>
          </div>
        </div>
        <div class="p-3 border-r border-slate-900 flex flex-col gap-3 min-h-[140px]">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Resolution Note / ผลการดำเนินการ:</span>
          <div class="min-h-[60px] text-sm text-slate-600 font-bold whitespace-pre-wrap">
            {{ (localTicket?.status === 'Resolved' || localTicket?.status === 'Closed') ? 'Technician has verified and completed the service request.' : 'Support in progress / Waiting for technical implementation.' }}
          </div>
        </div>
        <div class="p-3 flex flex-col gap-1.5">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Completion Target & Status:</span>
          <div class="flex items-center gap-3 mt-1.5">
             <div :class="['h-6 px-3 flex items-center justify-center rounded text-[0.65rem] font-black uppercase tracking-widest border border-current', getStatusColor(selectedStatus)]">
                {{ selectedStatus }}
             </div>
             <div class="text-[0.65rem] font-black text-slate-800 uppercase tabular-nums leading-none">
               {{ localTicket?.resolvedAt ? format(new Date(localTicket.resolvedAt), 'dd/MM/yyyy HH:mm') : '---' }}
             </div>
          </div>
          <div class="mt-auto border-t border-slate-100 pt-3 print:border-slate-200">
            <span class="text-slate-400 uppercase tracking-[0.05em] block mb-1">Total Effort:</span>
            <span class="text-slate-900 font-black uppercase tracking-tight">{{ resolutionDuration || 'Service Journey Running' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 4: Signatures -->
    <div class="mt-auto pt-8 border-t border-slate-100 print:border-slate-200">
      <div class="grid grid-cols-3 gap-10 text-center">
        <div class="space-y-12">
          <div class="border-b-2 border-slate-900 mx-2"></div>
          <div class="flex flex-col gap-1">
            <span class="text-[0.75rem] font-bold text-slate-900 uppercase tracking-wide">( {{ localTicket?.requester?.displayName || localTicket?.requester?.username }} )</span>
            <span class="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.1em]">Requester / ผู้แจ้งซ่อม</span>
          </div>
        </div>
        <div class="space-y-12">
          <div class="border-b-2 border-slate-900 mx-2"></div>
          <div class="flex flex-col gap-1">
            <span class="text-[0.75rem] font-bold text-slate-900 uppercase tracking-wide">( {{ localTicket?.assignee?.displayName || localTicket?.assignee?.username || 'Technician' }} )</span>
            <span class="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.1em]">IT Specialist / เจ้าหน้าที่</span>
          </div>
        </div>
        <div class="space-y-12">
          <div class="border-b-2 border-slate-900 mx-2"></div>
          <div class="flex flex-col gap-1">
            <span class="text-[0.75rem] font-bold text-slate-900 uppercase tracking-wide">( ..................................................... )</span>
            <span class="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.1em]">Approver / ผู้รับรอง</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Footer Decoration -->
    <div class="pt-6 mt-6 border-t flex justify-between items-end text-[0.6rem] font-bold text-slate-300 uppercase tracking-[0.2em] print:border-slate-200">
      <div class="flex flex-col gap-1">
         <span class="print:text-slate-400">&copy; {{ new Date().getFullYear() }} SERVICEHUB OFFICIAL DOCUMENT</span>
         <span class="print:text-slate-300">A4 STANDARD LAYOUT</span>
      </div>
      <div class="text-right text-slate-400 font-black print:text-slate-500">
        PRINTED ON JOB: {{ format(new Date(), 'dd-MMM-yyyy HH:mm') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  /* Set A4 page size and margins */
  @page {
    size: A4;
    margin: 20mm;
  }

  /* Force background colors and borders in print */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Ensure the paper content fills the printed area */
  #job-order-paper {
    width: 210mm !important;
    height: 297mm !important;
    max-width: none !important;
    margin: 0 auto !important;
    padding: 20mm !important; /* Standard A4 padding */
    box-shadow: none !important;
    border: none !important;
    min-height: 0 !important;
    overflow: visible !important;
  }

  /* Force solid black borders for the formal form structure */
  .border-slate-900 {
    border-color: #000 !important;
    border-width: 2px !important;
  }
  .bg-slate-900 {
    background-color: #000 !important;
  }
  .border-slate-100, .border-slate-200, .border-slate-300 {
    border-color: #ddd !important;
  }
  
  /* Ensure all text is truly black */
  .text-slate-900, .text-slate-800, .text-slate-700 {
    color: #000 !important;
  }
  .text-slate-400, .text-slate-500 {
    color: #555 !important;
  }
}

/* Custom shadow for the A4 simulation */
#job-order-paper {
  box-shadow: 0 10px 50px -12px rgba(0, 0, 0, 0.15);
}
</style>

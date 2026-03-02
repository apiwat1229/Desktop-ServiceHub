<script setup lang="ts">
import { ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Printer } from 'lucide-vue-next';
import CCTVReportA4 from './CCTVReportA4.vue';
import BackupReportA4 from './BackupReportA4.vue';
import PreventiveMaintenancePlanA4 from './PreventiveMaintenancePlanA4.vue';

const props = defineProps<{
  open: boolean;
  documentType: 'cctv' | 'backup' | 'preventive-maintenance' | null;
  data: any;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const isOpen = ref(props.open);

watch(() => props.open, (val) => {
  isOpen.value = val;
});

watch(isOpen, (val) => {
  emit('update:open', val);
});

const handlePrint = () => {
  window.print();
};

const getDocumentTitle = () => {
  if (props.title) return props.title;
  
  switch (props.documentType) {
    case 'cctv':
      return 'CCTV Result Check Report (FM-MIS-07)';
    case 'backup':
      return 'Backup Result Report';
    case 'preventive-maintenance':
      return 'Preventive Maintenance Plan (FM-MIS-03)';
    default:
      return 'Document';
  }
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-w-[900px] max-h-[95vh] overflow-y-auto p-0">
      <DialogHeader class="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
        <div class="flex items-center justify-between">
          <DialogTitle>{{ getDocumentTitle() }}</DialogTitle>
          <Button variant="outline" size="sm" @click="handlePrint" class="print:hidden">
            <Printer class="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </DialogHeader>
      
      <div class="p-6">
        <CCTVReportA4 v-if="documentType === 'cctv'" :record="data" />
        <BackupReportA4 v-else-if="documentType === 'backup'" :report="data" />
        <PreventiveMaintenancePlanA4 v-else-if="documentType === 'preventive-maintenance'" :plan="data" />
        <div v-else class="text-center text-muted-foreground py-12">
          No document selected
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #cctv-report-paper,
  #cctv-report-paper *,
  #backup-report-paper,
  #backup-report-paper *,
  #pm-plan-paper,
  #pm-plan-paper * {
    visibility: visible;
  }
  #cctv-report-paper,
  #backup-report-paper,
  #pm-plan-paper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>

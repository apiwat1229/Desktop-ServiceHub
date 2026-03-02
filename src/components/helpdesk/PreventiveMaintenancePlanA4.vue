<script setup lang="ts">
import { format } from 'date-fns';

const props = defineProps<{
  plan: any;
}>();

const formatDate = (date: Date | string) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd/MM/yyyy');
};
</script>

<template>
  <div id="pm-plan-paper" class="mx-auto bg-white shadow-xl ring-1 ring-slate-200 w-full max-w-[800px] min-h-[1050px] p-10 print:shadow-none print:ring-0 print:m-0 flex flex-col space-y-6">
    
    <!-- Document Header -->
    <div class="flex justify-between items-start border-b-2 border-slate-900 pb-6">
      <div class="flex-1">
        <div class="flex items-center gap-5 mt-1">
          <div class="shrink-0 flex items-center">
            <img src="/logo-dark.png" alt="Company Logo" class="h-6 w-auto object-contain" />
          </div>
          <div class="flex flex-col">
            <h1 class="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">PREVENTIVE MAINTENANCE PLAN</h1>
            <p class="text-[0.55rem] font-bold text-slate-400 mt-1.5 uppercase tracking-[0.05em] leading-none">Form FM-MIS-03 - With Actual Activity</p>
          </div>
        </div>
      </div>
      <div class="text-right flex flex-col items-end">
        <div class="px-6 py-3 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center shadow-sm min-w-[140px]">
          <span class="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Plan ID</span>
          <span class="text-2xl font-black text-slate-900 tracking-tighter leading-none">{{ plan?.planId || 'N/A' }}</span>
        </div>
      </div>
    </div>

    <!-- Section 1: Equipment Information -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        1. Equipment/System Information / ข้อมูลอุปกรณ์/ระบบ
      </div>
      <div class="grid grid-cols-2 text-[0.7rem] font-bold">
        <div class="p-3 border-r border-b border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Equipment/System / อุปกรณ์/ระบบ:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ plan?.equipment || 'N/A' }}</span>
        </div>
        <div class="p-3 border-b border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Frequency / ความถี่:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ plan?.frequency || 'N/A' }}</span>
        </div>
        <div class="p-3 border-r border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Priority / ลำดับความสำคัญ:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ plan?.priority || 'Medium' }}</span>
        </div>
        <div class="p-3 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Status / สถานะ:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ plan?.status || 'Active' }}</span>
        </div>
      </div>
    </div>

    <!-- Section 2: Schedule Information -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        2. Schedule Information / ข้อมูลกำหนดการ
      </div>
      <div class="grid grid-cols-2 text-[0.7rem] font-bold">
        <div class="p-3 border-r border-b border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Last Maintenance / การบำรุงรักษาล่าสุด:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ formatDate(plan?.lastMaintenance) }}</span>
        </div>
        <div class="p-3 border-b border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Next Scheduled / กำหนดการถัดไป:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ formatDate(plan?.nextScheduled) }}</span>
        </div>
        <div class="p-3 border-r border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Assigned Technician / ช่างที่รับผิดชอบ:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ plan?.assignee || 'Unassigned' }}</span>
        </div>
        <div class="p-3 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Estimated Duration / ระยะเวลาโดยประมาณ:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ plan?.duration || '2 Hours' }}</span>
        </div>
      </div>
    </div>

    <!-- Section 3: Description -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        3. Description / รายละเอียด
      </div>
      <div class="p-4">
        <div class="border border-slate-300 rounded p-3 bg-slate-50 min-h-[100px] text-sm text-slate-900">
          {{ plan?.description || 'No description provided' }}
        </div>
      </div>
    </div>

    <!-- Section 4: Maintenance Tasks -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        4. Maintenance Tasks / งานบำรุงรักษา
      </div>
      <div class="p-4">
        <div class="border border-slate-300 rounded p-3 bg-slate-50 min-h-[120px] text-sm text-slate-900 whitespace-pre-line">
          {{ plan?.tasks || 'No tasks specified' }}
        </div>
      </div>
    </div>

    <!-- Section 5: Required Tools/Parts -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        5. Required Tools/Parts / เครื่องมือ/อะไหล่ที่ต้องใช้
      </div>
      <div class="p-4">
        <div class="border border-slate-300 rounded p-3 bg-slate-50 min-h-[100px] text-sm text-slate-900 whitespace-pre-line">
          {{ plan?.requiredItems || 'No special tools required' }}
        </div>
      </div>
    </div>

    <!-- Section 6: Actual Activity Alert -->
    <div class="border border-slate-900">
      <div class="bg-blue-100 border-b border-slate-900 px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest text-blue-900">
        6. Actual Activity Form / แบบฟอร์มกิจกรรมจริง
      </div>
      <div class="p-4 bg-blue-50">
        <div class="flex items-start gap-3">
          <div class="text-blue-600 mt-0.5">ℹ️</div>
          <div class="flex-1">
            <p class="text-xs font-bold text-blue-900 mb-1">** Actual Preventive Maintenance form (FM-MIS-02) will be informed you later.</p>
            <p class="text-xs text-blue-700">แบบฟอร์มการบำรุงรักษาเชิงป้องกันจริง (FM-MIS-02) จะแจ้งให้ทราบในภายหลัง</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer: Signatures -->
    <div class="mt-auto pt-6">
      <div class="grid grid-cols-3 gap-6 text-center text-[0.7rem]">
        <div class="border-t-2 border-slate-900 pt-3">
          <p class="font-black text-slate-900 uppercase tracking-wider">Prepared By</p>
          <p class="text-slate-400 mt-1">ผู้จัดทำ</p>
          <div class="h-12"></div>
          <p class="text-slate-600">___________________</p>
          <p class="text-slate-400 text-[0.6rem] mt-1">Date / วันที่</p>
        </div>
        <div class="border-t-2 border-slate-900 pt-3">
          <p class="font-black text-slate-900 uppercase tracking-wider">Reviewed By</p>
          <p class="text-slate-400 mt-1">ผู้ตรวจทาน</p>
          <div class="h-12"></div>
          <p class="text-slate-600">___________________</p>
          <p class="text-slate-400 text-[0.6rem] mt-1">Date / วันที่</p>
        </div>
        <div class="border-t-2 border-slate-900 pt-3">
          <p class="font-black text-slate-900 uppercase tracking-wider">Approved By</p>
          <p class="text-slate-400 mt-1">ผู้อนุมัติ</p>
          <div class="h-12"></div>
          <p class="text-slate-600">___________________</p>
          <p class="text-slate-400 text-[0.6rem] mt-1">Date / วันที่</p>
        </div>
      </div>
    </div>

    <!-- Document Footer -->
    <div class="text-center text-[0.55rem] text-slate-400 pt-4 border-t border-slate-200">
      <p>FM-MIS-03 | Preventive Maintenance Plan with Actual Activity | Rev. 1.0</p>
      <p class="mt-1">ServiceHub Management System - IT Infrastructure Division</p>
    </div>
  </div>
</template>

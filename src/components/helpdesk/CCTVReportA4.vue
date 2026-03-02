<script setup lang="ts">
import { format } from 'date-fns';
import { computed } from 'vue';

const props = defineProps<{
  record: any;
}>();

const formatDate = (date: Date | string) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};
</script>

<template>
  <div id="cctv-report-paper" class="mx-auto bg-white shadow-xl ring-1 ring-slate-200 w-full max-w-[800px] min-h-[1050px] p-10 print:shadow-none print:ring-0 print:m-0 flex flex-col space-y-6">
    
    <!-- Document Header -->
    <div class="flex justify-between items-start border-b-2 border-slate-900 pb-6">
      <div class="flex-1">
        <div class="flex items-center gap-5 mt-1">
          <div class="shrink-0 flex items-center">
            <img src="/logo-dark.png" alt="Company Logo" class="h-6 w-auto object-contain" />
          </div>
          <div class="flex flex-col">
            <h1 class="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">CCTV RESULT CHECK REPORT</h1>
            <p class="text-[0.55rem] font-bold text-slate-400 mt-1.5 uppercase tracking-[0.05em] leading-none">Form FM-MIS-07 - CCTV Monitoring & Maintenance</p>
          </div>
        </div>
      </div>
      <div class="text-right flex flex-col items-end">
        <div class="px-6 py-3 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center shadow-sm min-w-[140px]">
          <span class="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Report ID</span>
          <span class="text-2xl font-black text-slate-900 tracking-tighter leading-none">{{ record?.reportId || 'N/A' }}</span>
        </div>
      </div>
    </div>

    <!-- Section 1: Basic Information -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        1. Basic Information / ข้อมูลพื้นฐาน
      </div>
      <div class="grid grid-cols-2 text-[0.7rem] font-bold">
        <div class="p-3 border-r border-b border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Location / สถานที่:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ record?.location || 'N/A' }}</span>
        </div>
        <div class="p-3 border-b border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Check Date / วันที่ตรวจสอบ:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ formatDate(record?.checkDate) }}</span>
        </div>
        <div class="p-3 border-r border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Status / สถานะ:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ record?.status || 'N/A' }}</span>
        </div>
        <div class="p-3 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Issues Found / ปัญหาที่พบ:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ record?.issues || 0 }} Issue(s)</span>
        </div>
      </div>
    </div>

    <!-- Section 2: CCTV Layout -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        2. CCTV Layout / แผนผังกล้อง CCTV
      </div>
      <div class="p-4">
        <div class="text-[0.7rem] font-bold mb-2">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Layout Status / สถานะแผนผัง:</span>
          <span class="text-slate-900 ml-2">{{ record?.layoutStatus || 'Normal' }}</span>
        </div>
        <div class="border border-slate-300 rounded p-4 bg-slate-50 min-h-[120px] flex items-center justify-center">
          <p class="text-slate-400 text-xs">Layout diagram area / พื้นที่แสดงแผนผัง</p>
        </div>
      </div>
    </div>

    <!-- Section 3: CCTV Monitor Screen -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        3. CCTV Monitor Screen / จอมอนิเตอร์ CCTV
      </div>
      <div class="p-4">
        <div class="text-[0.7rem] font-bold mb-2">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Monitor Status / สถานะจอมอนิเตอร์:</span>
          <span class="text-slate-900 ml-2">{{ record?.monitorStatus || 'All Working' }}</span>
        </div>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="border border-slate-300 rounded p-3 bg-white">
            <div class="font-bold text-slate-700">Monitor 1</div>
            <div class="text-slate-500">Status: Online</div>
          </div>
          <div class="border border-slate-300 rounded p-3 bg-white">
            <div class="font-bold text-slate-700">Monitor 2</div>
            <div class="text-slate-500">Status: Online</div>
          </div>
          <div class="border border-slate-300 rounded p-3 bg-white">
            <div class="font-bold text-slate-700">Monitor 3</div>
            <div class="text-slate-500">Status: Online</div>
          </div>
          <div class="border border-slate-300 rounded p-3 bg-white">
            <div class="font-bold text-slate-700">Monitor 4</div>
            <div class="text-slate-500">Status: Online</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 4: Issues & Remarks -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        4. Issues & Remarks / ปัญหาและข้อสังเกต
      </div>
      <div class="p-4">
        <div class="mb-3">
          <div class="text-[0.7rem] font-bold text-slate-400 uppercase tracking-[0.05em] mb-2">Issues Found / ปัญหาที่พบ:</div>
          <div class="border border-slate-300 rounded p-3 bg-slate-50 min-h-[80px] text-sm text-slate-900">
            {{ record?.issues || 'No issues found' }}
          </div>
        </div>
        <div>
          <div class="text-[0.7rem] font-bold text-slate-400 uppercase tracking-[0.05em] mb-2">Remarks / ข้อสังเกต:</div>
          <div class="border border-slate-300 rounded p-3 bg-slate-50 min-h-[80px] text-sm text-slate-900">
            {{ record?.remarks || 'N/A' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Section 5: Data Problem Alert -->
    <div class="border border-slate-900">
      <div class="bg-yellow-100 border-b border-slate-900 px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest text-yellow-900">
        5. Data Problem Form / แบบฟอร์มปัญหาข้อมูล
      </div>
      <div class="p-4 bg-yellow-50">
        <div class="flex items-start gap-3">
          <div class="text-yellow-600 mt-0.5">⚠️</div>
          <div class="flex-1">
            <p class="text-xs font-bold text-yellow-900 mb-1">** Data problem form (FM-MIS-08) will be informed you later.</p>
            <p class="text-xs text-yellow-700">แบบฟอร์มปัญหาข้อมูล (FM-MIS-08) จะแจ้งให้ทราบในภายหลัง</p>
            <div class="mt-2 flex items-center gap-2">
              <input type="checkbox" :checked="record?.dataProblemsReported" class="h-4 w-4" disabled />
              <span class="text-xs font-medium text-yellow-900">Data problem form has been filed</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer: Signatures -->
    <div class="mt-auto pt-6">
      <div class="grid grid-cols-3 gap-6 text-center text-[0.7rem]">
        <div class="border-t-2 border-slate-900 pt-3">
          <p class="font-black text-slate-900 uppercase tracking-wider">Checked By</p>
          <p class="text-slate-400 mt-1">ผู้ตรวจสอบ</p>
          <div class="h-12"></div>
          <p class="text-slate-600">___________________</p>
          <p class="text-slate-400 text-[0.6rem] mt-1">{{ formatDate(record?.checkDate) }}</p>
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
      <p>FM-MIS-07 | CCTV Result Check Report | Rev. 1.0</p>
      <p class="mt-1">ServiceHub Management System - IT Infrastructure Division</p>
    </div>
  </div>
</template>

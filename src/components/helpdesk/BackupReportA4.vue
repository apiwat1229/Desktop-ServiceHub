<script setup lang="ts">
import { format } from 'date-fns';

const props = defineProps<{
  report: any;
}>();

const formatDate = (date: Date | string) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};
</script>

<template>
  <div id="backup-report-paper" class="mx-auto bg-white shadow-xl ring-1 ring-slate-200 w-full max-w-[800px] min-h-[1050px] p-10 print:shadow-none print:ring-0 print:m-0 flex flex-col space-y-6">
    
    <!-- Document Header -->
    <div class="flex justify-between items-start border-b-2 border-slate-900 pb-6">
      <div class="flex-1">
        <div class="flex items-center gap-5 mt-1">
          <div class="shrink-0 flex items-center">
            <img src="/logo-dark.png" alt="Company Logo" class="h-6 w-auto object-contain" />
          </div>
          <div class="flex flex-col">
            <h1 class="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">BACKUP RESULT REPORT</h1>
            <p class="text-[0.55rem] font-bold text-slate-400 mt-1.5 uppercase tracking-[0.05em] leading-none">Backup Data Management - Result & Verification</p>
          </div>
        </div>
      </div>
      <div class="text-right flex flex-col items-end">
        <div class="px-6 py-3 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center shadow-sm min-w-[140px]">
          <span class="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Report ID</span>
          <span class="text-2xl font-black text-slate-900 tracking-tighter leading-none">{{ report?.reportId || 'N/A' }}</span>
        </div>
      </div>
    </div>

    <!-- Section 1: Backup Plan Information -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        1. Backup Plan Information / ข้อมูลแผน Backup
      </div>
      <div class="grid grid-cols-2 text-[0.7rem] font-bold">
        <div class="p-3 border-r border-b border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Plan Name / ชื่อแผน:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ report?.planName || 'N/A' }}</span>
        </div>
        <div class="p-3 border-b border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Backup Type / ประเภท:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ report?.type || 'Full Backup' }}</span>
        </div>
        <div class="p-3 border-r border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Start Time / เวลาเริ่ม:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ formatDate(report?.startTime) }}</span>
        </div>
        <div class="p-3 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">End Time / เวลาสิ้นสุด:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ formatDate(report?.endTime) }}</span>
        </div>
      </div>
    </div>

    <!-- Section 2: Backup Job Details -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        2. Backup Job Details / รายละเอียดงาน Backup
      </div>
      <div class="grid grid-cols-2 text-[0.7rem] font-bold">
        <div class="p-3 border-r border-b border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Duration / ระยะเวลา:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ report?.duration || 'N/A' }}</span>
        </div>
        <div class="p-3 border-b border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Data Size / ขนาดข้อมูล:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ report?.size || 'N/A' }}</span>
        </div>
        <div class="p-3 border-r border-slate-900 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Status / สถานะ:</span>
          <span class="text-slate-900 text-sm font-black uppercase" :class="report?.success ? 'text-green-600' : 'text-red-600'">
            {{ report?.success ? 'SUCCESS' : 'FAILED' }}
          </span>
        </div>
        <div class="p-3 flex flex-col gap-1">
          <span class="text-slate-400 uppercase tracking-[0.05em]">Files Backed Up / ไฟล์ที่สำรอง:</span>
          <span class="text-slate-900 text-sm font-black uppercase">{{ report?.filesCount || '0' }} Files</span>
        </div>
      </div>
    </div>

    <!-- Section 3: Backup Location -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        3. Backup Location / ที่เก็บข้อมูล Backup
      </div>
      <div class="p-4">
        <div class="grid grid-cols-2 gap-4 text-[0.7rem] font-bold mb-3">
          <div>
            <span class="text-slate-400 uppercase tracking-[0.05em]">Source Path / ต้นทาง:</span>
            <div class="text-slate-900 text-sm mt-1 font-mono bg-slate-50 p-2 rounded border border-slate-300">
              {{ report?.sourcePath || '/data/production' }}
            </div>
          </div>
          <div>
            <span class="text-slate-400 uppercase tracking-[0.05em]">Destination Path / ปลายทาง:</span>
            <div class="text-slate-900 text-sm mt-1 font-mono bg-slate-50 p-2 rounded border border-slate-300">
              {{ report?.destinationPath || '/backup/archive' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 4: Verification Results -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        4. Verification Results / ผลการตรวจสอบ
      </div>
      <div class="p-4">
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div class="border border-slate-300 rounded p-3 bg-green-50">
            <div class="text-xs text-slate-500 mb-1">Files Verified</div>
            <div class="text-2xl font-black text-green-600">{{ report?.verifiedFiles || '100%' }}</div>
          </div>
          <div class="border border-slate-300 rounded p-3 bg-blue-50">
            <div class="text-xs text-slate-500 mb-1">Checksum Match</div>
            <div class="text-2xl font-black text-blue-600">{{ report?.checksumMatch || 'Yes' }}</div>
          </div>
          <div class="border border-slate-300 rounded p-3 bg-purple-50">
            <div class="text-xs text-slate-500 mb-1">Integrity Check</div>
            <div class="text-2xl font-black text-purple-600">{{ report?.integrityCheck || 'Passed' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 5: Details & Remarks -->
    <div class="border border-slate-900">
      <div class="bg-slate-900 text-white px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest">
        5. Details & Remarks / รายละเอียดและข้อสังเกต
      </div>
      <div class="p-4">
        <div class="border border-slate-300 rounded p-3 bg-slate-50 min-h-[100px] text-sm text-slate-900">
          {{ report?.details || 'All data backed up successfully. No errors encountered.' }}
        </div>
      </div>
    </div>

    <!-- Section 6: Related Forms -->
    <div class="border border-slate-900">
      <div class="bg-blue-100 border-b border-slate-900 px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest text-blue-900">
        6. Related Forms / แบบฟอร์มที่เกี่ยวข้อง
      </div>
      <div class="p-4 bg-blue-50">
        <div class="space-y-2 text-xs">
          <div class="flex items-center gap-2">
            <input type="checkbox" checked class="h-4 w-4" disabled />
            <span class="font-medium text-blue-900">Backup Plan</span>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" checked class="h-4 w-4" disabled />
            <span class="font-medium text-blue-900">Backup Job</span>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" class="h-4 w-4" disabled />
            <span class="font-medium text-blue-900">Restoration Test Report</span>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" class="h-4 w-4" disabled />
            <span class="font-medium text-blue-900">Snapshot Schedule</span>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" class="h-4 w-4" disabled />
            <span class="font-medium text-blue-900">Maintenance Agreement of Server Machine</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer: Signatures -->
    <div class="mt-auto pt-6">
      <div class="grid grid-cols-3 gap-6 text-center text-[0.7rem]">
        <div class="border-t-2 border-slate-900 pt-3">
          <p class="font-black text-slate-900 uppercase tracking-wider">Executed By</p>
          <p class="text-slate-400 mt-1">ผู้ดำเนินการ</p>
          <div class="h-12"></div>
          <p class="text-slate-600">___________________</p>
          <p class="text-slate-400 text-[0.6rem] mt-1">{{ formatDate(report?.date) }}</p>
        </div>
        <div class="border-t-2 border-slate-900 pt-3">
          <p class="font-black text-slate-900 uppercase tracking-wider">Verified By</p>
          <p class="text-slate-400 mt-1">ผู้ตรวจสอบ</p>
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
      <p>Backup Result Report | Rev. 1.0</p>
      <p class="mt-1">ServiceHub Management System - IT Infrastructure Division</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { itTicketsApi } from '@/services/it-tickets';
import { FileText, RefreshCw, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

const ticketCount = ref(30);
const loading = ref(false);
const logs = ref<Array<{ message: string; type: string; time: string }>>([]);

const categories = [
  'Hardware > Computer > Slow Performance',
  'Hardware > Computer > Not Booting',
  'Hardware > Printer > Paper Jam',
  'Hardware > Printer > Not Printing',
  'Software > Application > Installation',
  'Software > Application > Error',
  'Software > Email > Cannot Send',
  'Software > Email > Cannot Receive',
  'Network > Internet > Slow Connection',
  'Network > Internet > No Connection',
  'Network > WiFi > Cannot Connect',
  'Access > Account > Password Reset',
  'Access > Account > Locked Account',
  'Access > Permissions > File Access',
];

const priorities = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
const locations = ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Meeting Room A', 'Meeting Room B', 'Office 101', 'Office 102'];

const titles = [
  'Computer running very slow',
  'Cannot access printer',
  'Email not working',
  'Internet connection issues',
  'Software installation needed',
  'Password reset request',
  'File access permission needed',
  'System error message',
  'Application crash',
  'Network drive not accessible',
  'VPN connection failed',
  'Monitor display issues',
  'Keyboard not working',
  'Mouse not responding',
  'Headset audio problems',
];

const descriptions = [
  'Need urgent assistance with this issue',
  'This has been happening since yesterday',
  'Multiple users are affected',
  'Cannot complete my work without this',
  'Please help as soon as possible',
  'This is blocking my daily tasks',
  'Tried restarting but still not working',
  'Getting error messages repeatedly',
  'Need this fixed before the meeting',
  'Critical for project deadline',
];

function log(message: string, type: string = 'info') {
  const time = new Date().toLocaleTimeString('th-TH');
  logs.value.push({ message, type, time });
  setTimeout(() => {
    const logDiv = document.getElementById('log-container');
    if (logDiv) logDiv.scrollTop = logDiv.scrollHeight;
  }, 10);
}

async function deleteAllTickets() {
  try {
    loading.value = true;
    log('🗑️ กำลังลบ Tickets ทั้งหมด...', 'warning');
    
    const tickets = await itTicketsApi.getAll();
    log(`พบ ${tickets.length} tickets`, 'info');
    
    let deleted = 0;
    for (const ticket of tickets) {
      try {
        await itTicketsApi.delete(ticket.id);
        deleted++;
        log(`✅ ลบแล้ว: ${ticket.ticketNo} - ${ticket.title}`, 'success');
      } catch (error) {
        log(`❌ ลบไม่สำเร็จ: ${ticket.ticketNo}`, 'error');
      }
    }
    
    log(`✅ ลบ ${deleted} tickets สำเร็จ`, 'success');
    toast.success(`ลบ ${deleted} tickets สำเร็จ`);
  } catch (error: any) {
    log(`❌ เกิดข้อผิดพลาด: ${error.message}`, 'error');
    toast.error('เกิดข้อผิดพลาดในการลบ tickets');
  } finally {
    loading.value = false;
  }
}

async function createTestTickets() {
  try {
    loading.value = true;
    const count = ticketCount.value;
    log(`📝 กำลังสร้าง ${count} test tickets...`, 'info');
    
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    let created = 0;
    const createdTickets = [];
    
    for (let i = 0; i < count; i++) {
      const randomTime = oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime());
      const createdAt = new Date(randomTime);
      
      const ticket = {
        title: titles[Math.floor(Math.random() * titles.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
      };
      
      let retries = 3;
      let success = false;
      
      while (retries > 0 && !success) {
        try {
          const data = await itTicketsApi.create(ticket as any);
          
          // Update createdAt after creation
          try {
            await itTicketsApi.update(data.id, { createdAt: createdAt.toISOString() } as any);
          } catch (updateError) {
            // Ignore update errors, ticket is already created
          }
          
          createdTickets.push(data);
          created++;
          log(`✅ สร้างแล้ว #${created}: ${data.ticketNo} - ${ticket.title} (${createdAt.toLocaleDateString('th-TH')})`, 'success');
          success = true;
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          retries--;
          if (retries > 0) {
            log(`⚠️ ลองใหม่ #${i + 1} (เหลือ ${retries} ครั้ง)...`, 'warning');
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
            log(`❌ สร้างไม่สำเร็จ #${i + 1}: ${errorMsg}`, 'error');
            console.error('Ticket creation error:', error.response?.data || error);
          }
        }
      }
    }
    
    log(`✅ สร้าง ${created} tickets สำเร็จ`, 'success');
    toast.success(`สร้าง ${created} tickets สำเร็จ`);
    
    // Update statuses
    log('🔄 กำลังอัพเดทสถานะ...', 'info');
    for (const ticket of createdTickets) {
      if (Math.random() > 0.3) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        try {
          await itTicketsApi.update(ticket.id, { status: randomStatus as any });
          log(`✅ อัพเดท ${ticket.ticketNo} เป็น ${randomStatus}`, 'success');
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          // Ignore update errors
        }
      }
    }
    
    log('✅ เสร็จสิ้นทั้งหมด!', 'success');
    toast.success('เสร็จสิ้นทั้งหมด!');
  } catch (error: any) {
    log(`❌ เกิดข้อผิดพลาด: ${error.message}`, 'error');
    toast.error('เกิดข้อผิดพลาดในการสร้าง tickets');
  } finally {
    loading.value = false;
  }
}

async function runFullProcess() {
  logs.value = [];
  await deleteAllTickets();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await createTestTickets();
}

function clearLogs() {
  logs.value = [];
}
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">🎫 จัดการ Test Tickets</CardTitle>
        <CardDescription>ลบ Tickets ทั้งหมดและสร้างข้อมูลทดสอบย้อนหลัง 1 เดือน</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="ticketCount">จำนวน Tickets ที่ต้องการสร้าง:</Label>
          <Input
            id="ticketCount"
            v-model.number="ticketCount"
            type="number"
            min="1"
            max="100"
            class="w-32"
            :disabled="loading"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <Button
            @click="deleteAllTickets"
            variant="destructive"
            :disabled="loading"
          >
            <Trash2 class="w-4 h-4 mr-2" />
            ลบ Tickets ทั้งหมด
          </Button>
          
          <Button
            @click="createTestTickets"
            variant="default"
            :disabled="loading"
          >
            <FileText class="w-4 h-4 mr-2" />
            สร้าง Test Tickets
          </Button>
          
          <Button
            @click="runFullProcess"
            variant="default"
            :disabled="loading"
          >
            <RefreshCw class="w-4 h-4 mr-2" />
            ลบและสร้างใหม่ทั้งหมด
          </Button>

          <Button
            @click="clearLogs"
            variant="outline"
            :disabled="loading"
          >
            ล้าง Logs
          </Button>
        </div>

        <div
          id="log-container"
          class="bg-slate-900 text-slate-100 p-4 rounded-lg max-h-96 overflow-y-auto font-mono text-sm space-y-1"
        >
          <div v-if="logs.length === 0" class="text-slate-400">
            พร้อมทำงาน... กดปุ่มด้านบนเพื่อเริ่มต้น
          </div>
          <div
            v-for="(entry, index) in logs"
            :key="index"
            :class="{
              'text-green-400': entry.type === 'success',
              'text-red-400': entry.type === 'error',
              'text-blue-400': entry.type === 'info',
              'text-yellow-400': entry.type === 'warning',
            }"
          >
            [{{ entry.time }}] {{ entry.message }}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

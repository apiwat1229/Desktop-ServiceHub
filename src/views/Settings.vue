<script setup lang="ts">
import RolesView from '@/views/admin/Roles.vue';
import SystemStatusView from '@/views/admin/SystemStatus.vue';
import UsersManagementView from '@/views/admin/UsersManagement.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();


const activeTab = computed(() => (route.query.tab as string) || 'roles');

</script>

<template>
  <div class="min-h-screen bg-background/50 p-6 md:p-8 space-y-8 animate-in fade-in duration-700 main-scroll-container">
    <div class="grid grid-cols-1 gap-8 items-start pt-4">
      <!-- Content Area -->
      <div class="w-full">
        <div class="animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div v-if="activeTab === 'roles'" class="space-y-6">
            <RolesView />
          </div>

          <div v-if="activeTab === 'users'" class="space-y-6">
            <UsersManagementView />
          </div>

          <div v-if="activeTab === 'system-status'" class="space-y-6">
            <SystemStatusView />
          </div>


        </div>
      </div>
    </div>

    <!-- Background Glass Decoration -->
    <div class="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] pointer-events-none opacity-50"></div>
    <div class="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
  </div>
</template>

<style scoped>
.tracking-tight {
  letter-spacing: -0.04em;
}
.tracking-widest {
  letter-spacing: 0.15em;
}

/* Hide scrollbar for Chrome, Safari and Opera */
:deep(.main-scroll-container)::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
:deep(.main-scroll-container) {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>

<script setup lang="ts">
import { useRoute } from 'vue-router';

// const authStore = useAuthStore();
const route = useRoute();
</script>

<template>
  <div class="flex flex-1 h-full overflow-hidden bg-transparent text-foreground font-sans">
    <!-- Main Content Area -->
    <main class="flex-1 overflow-x-hidden overflow-y-auto no-scrollbar p-4 lg:p-6">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <transition name="fade">
    <div v-if="confirmState.visible" class="fixed inset-0 z-[9999] flex items-center justify-center">
      <div class="fixed inset-0 bg-black/40" />

      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
        <h3 class="text-lg font-semibold mb-2">{{ confirmState.title || 'Confirm' }}</h3>
        <p class="text-sm text-slate-700 mb-4">{{ confirmState.message }}</p>

        <div class="flex justify-end gap-3">
          <button
            @click="confirmCancel"
            class="px-4 py-2 rounded-md border bg-white text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            @click="confirmAccept"
            class="px-4 py-2 rounded-md bg-primary text-white text-sm hover:bg-primary/90"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { confirmAccept, confirmCancel, confirmState } from '@/composables/useConfirm';
</script>

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

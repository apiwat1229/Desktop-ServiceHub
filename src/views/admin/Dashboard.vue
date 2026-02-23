<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
import AdminDashboard from './AdminDashboard.vue';
import UserDashboard from './UserDashboard.vue';

const authStore = useAuthStore();

// Determine if the user should see the admin view
// By default, assuming role is either 'ADMIN', 'IT', or 'USER'
const isAdminView = computed(() => {
  const role = authStore.user?.role;
  // If no role is clearly defined as 'USER', default to admin view or base it on specific roles
  // Here we explicitly check for 'ADMIN' or 'IT' to see the full dashboard,
  // or conversely, if the role is 'USER' they see the personalized one.
  return role !== 'USER'; 
});
</script>

<template>
  <AdminDashboard v-if="isAdminView" />
  <UserDashboard v-else />
</template>

<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import api from '@/services/api';
import { useThemeStore } from '@/stores/theme';
import { App } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar';
import { AlertCircle, RefreshCw } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GlobalBackground from './components/layout/GlobalBackground.vue';

useThemeStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const error = ref<string | null>(null);
const isRetrying = ref(false);

const checkHealth = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    // Simple health check to ensure API is reachable
    await api.get('/health', { timeout: 5000 });
    isLoading.value = false;
  } catch (err) {
    console.error('Health check failed:', err);
    error.value =
      'Cannot connect to server. Please check your internet connection or try again later.';
    isLoading.value = false;
  }
};

const handleRetry = async () => {
  isRetrying.value = true;
  await checkHealth();
  isRetrying.value = false;
};

const goBack = () => router.back();
const goForward = () => router.forward();
const reloadPage = () => window.location.reload();

onMounted(() => {
  checkHealth();
  // socketService managed in Navbar

  // Hide Status Bar and Navigation Bar (Immersive Mode) - Native Only
  const hideSystemBars = async () => {
    if ((window as any).Capacitor?.isNativePlatform()) {
      try {
        await Promise.all([StatusBar.hide(), NavigationBar.hide()]);
      } catch (err) {
        console.warn('System bars could not be hidden:', err);
      }
    }
  };
  hideSystemBars();

  // Handle Android Hardware Back Button (Swipe to Back)
  App.addListener('backButton', ({ canGoBack }) => {
    if (
      window.location.hash === '#/' ||
      window.location.pathname === '/' ||
      window.location.hash === '#/dashboard'
    ) {
      App.minimizeApp();
    } else {
      router.back();
    }
  });
});

onUnmounted(() => {
  // socketService managed in Navbar
  App.removeAllListeners();
});
</script>

<template>
  <GlobalBackground />
  <div class="relative z-10 flex flex-col h-screen text-foreground">
      <!-- Navbar always visible -->
      <Navbar />

      <div class="flex-1 overflow-hidden relative">
      <!-- Loading & Error States -->
      <div
        v-if="isLoading || error"
        class="initial-loader"
      >
        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300"
        >
           <div class="logo-container">
            <!-- Lucide Wrench Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logo-icon"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <div class="progress-container">
            <div class="progress-bar"></div>
          </div>
          <div class="loading-text">Service Hub</div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="flex flex-col items-center max-w-md text-center animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div class="rounded-2xl bg-white p-4 mb-6 shadow-lg border border-red-100">
            <AlertCircle class="h-10 w-10 text-destructive" />
          </div>
          <h2 class="text-xl font-bold mb-2 text-foreground">Connection Failed</h2>
          <p class="text-muted-foreground mb-8 text-sm">{{ error }}</p>
          <Button
            @click="handleRetry"
            :disabled="isRetrying"
            size="lg"
            class="h-12 px-8 text-sm font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isRetrying }" />
            {{ isRetrying ? 'Retrying...' : 'Retry Connection' }}
          </Button>
        </div>
      </div>

      <!-- Main App Content -->
      <router-view v-else />
    </div>
  </div>

  <Toaster
    position="top-center"
    :duration="5000"
    :expand="true"
    :visibleToasts="5"
    :close-button="true"
  />
</template>

<style>
/* Global Styles handled by style.css */

.initial-loader {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc; /* Lighter background */
  color: #1e293b;
  font-family: 'Bai Jamjuree', 'Inter', sans-serif;
  z-index: 9999;
}

.logo-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #ffffff;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.15), 0 8px 10px -6px rgba(59, 130, 246, 0.1);
  animation: bounce 2s infinite ease-in-out;
}

.logo-icon {
  width: 40px;
  height: 40px;
  color: #3b82f6;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.progress-container {
  width: 140px;
  height: 4px;
  background-color: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background-color: #3b82f6;
  border-radius: 99px;
  animation: indeterminate 1.5s infinite ease-in-out;
}

@keyframes indeterminate {
  0% { left: -30%; width: 30%; }
  50% { left: 100%; width: 30%; }
  100% { left: 100%; width: 30%; } 
}

.loading-text {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #64748b;
  text-transform: uppercase;
}
</style>

<script setup lang="ts">
import TicketDialog from '@/components/booking/TicketDialog.vue';
import AppearanceSettings from '@/components/settings/AppearanceSettings.vue';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar/index';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { usePermissions } from '@/composables/usePermissions';
import approvalsApi from '@/services/approvals';
import { bookingsApi } from '@/services/bookings';
import { notificationsApi } from '@/services/notifications';
import { socketService } from '@/services/socket';
import { useAuthStore } from '@/stores/auth';
import type { NotificationDto } from '@my-app/types';
import { formatDistanceToNow } from 'date-fns';
import {
    Bell,
    LogOut,
    Settings,
    User
} from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import NavigationMenubar from './NavigationMenubar.vue';

const authStore = useAuthStore();
const router = useRouter();
const showThemeSettings = ref(false);
const isTicketPreviewOpen = ref(false);
const previewTicket = ref<any>(null);
const isErrorDialogOpen = ref(false);
const errorDialogMessage = ref('');
const isCloseConfirmOpen = ref(false);
const isLogoutConfirmOpen = ref(false);

const { isAdmin, hasPermission } = usePermissions();

const props = defineProps<{}>();

const handleLogout = () => {
  isLogoutConfirmOpen.value = true;
};

const confirmLogout = () => {
  authStore.logout();
  router.push('/login');
  isLogoutConfirmOpen.value = false;
};

const userInitials = () => {
  if (!authStore.user?.firstName) return 'U';
  return `${authStore.user.firstName.charAt(0)}${authStore.user.lastName ? authStore.user.lastName.charAt(0) : ''}`;
};


// --- Notifications Logic ---
const unreadNotifications = ref<NotificationDto[]>([]);
const unreadCount = computed(() => unreadNotifications.value.length);

const route = useRoute(); // Added this line
const isGuestRoute = computed(() => route.meta.requiresGuest); // Added this line

const pendingApprovalCount = ref(0);
// let pollingInterval: NodeJS.Timeout;

const fetchPendingApprovals = async () => {
  if (!authStore.isAuthenticated) return;
  try {
    // Check if user has permission first to avoid unnecessary calls
    if (isAdmin.value || hasPermission('approvals:approve')) {
      const res = await approvalsApi.getAll({ status: 'PENDING' });
      // Assuming res.data is the array
      pendingApprovalCount.value = res.data?.length || 0;
    }
  } catch (error) {
    console.error('Failed to fetch pending approvals', error);
  }
};

const fetchUnreadNotifications = async () => {
  if (!authStore.isAuthenticated) return;
  try {
    const res = await notificationsApi.getUnread();
    unreadNotifications.value = res.data || [];
  } catch (error) {
    console.error('Failed to fetch unread notifications', error);
  }
};

const handleMarkAsRead = async (id: string) => {
  try {
    await notificationsApi.markAsRead(id);
    unreadNotifications.value = unreadNotifications.value.filter((n) => n.id !== id);
  } catch (error) {
    console.error('Failed to mark as read', error);
  }
};


// Window Controls
const handleMinimize = () => {
  (window as any).ipcRenderer?.window?.minimize();
};

const handleMaximize = () => {
  (window as any).ipcRenderer?.window?.maximize();
};

const handleClose = () => {
  isCloseConfirmOpen.value = true;
};

const confirmClose = () => {
  (window as any).ipcRenderer?.window?.close();
  isCloseConfirmOpen.value = false;
};

const handleNotificationClick = async (notification: NotificationDto) => {
  await handleMarkAsRead(notification.id);

  if (notification.actionUrl && notification.actionUrl.startsWith('/bookings')) {
    let bookingId = '';
    if (notification.actionUrl.includes('?code=')) {
      bookingId = notification.actionUrl.split('?code=')[1];
    } else {
      const parts = notification.actionUrl.split('/');
      bookingId = parts[parts.length - 1];
    }

    if (bookingId) {
      let booking;
      try {
        const isUuid = bookingId.length > 30;
        if (isUuid) {
          booking = await bookingsApi.getById(bookingId);
        } else {
          const bookings = await bookingsApi.getAll({ code: bookingId });
          if (bookings && bookings.length > 0) {
            booking = bookings[0];
          }
        }
      } catch (error) {
        console.warn('Failed to fetch booking preview:', error);
      }

      if (booking) {
        setTimeout(() => {
          previewTicket.value = {
            date: booking.date || booking.bookingDate,
            startTime: booking.startTime || booking.slot || booking.timeSlot,
            truckType: booking.truckType,
            truckRegister: booking.truckRegister || booking.truckLicensePlate,
            rubberType: booking.rubberType,
            supplierCode: booking.supplierCode || booking.supplier?.code,
            supplierName: booking.supplierName || booking.supplier?.name,
            bookingCode: booking.bookingCode,
            queueNo: booking.queueNo || booking.queueNumber,
            recorder:
              booking.recorder ||
              booking.createdBy?.displayName ||
              booking.createdBy?.username ||
              'System',
            status: booking.status,
            deletedAt: booking.deletedAt,
          };
          isTicketPreviewOpen.value = true;
        }, 100);
        return;
      } else {
        if (
          notification.title.toLowerCase().includes('cancel') ||
          notification.message.toLowerCase().includes('cancel')
        ) {
          setTimeout(() => {
            errorDialogMessage.value = 'Booking was cancelled and data is no longer available.';
            isErrorDialogOpen.value = true;
          }, 100);
          return;
        }
      }
    }
  }

  if (notification.actionUrl && !notification.actionUrl.startsWith('/bookings')) {
    router.push(notification.actionUrl);
  } else if (!notification.actionUrl) {
    router.push('/my-notifications');
  }
};

// Moved accessors to setup scope, init in onMounted below

// Ensure we join the room if user data loads late
// Logic moved to SocketService.connect() 'connect' listener to avoid race conditions
/* if (authStore.user?.id) {
    socketService.joinRoom(authStore.user.id);
  } */

const lastNotification = ref<{ title: string; message: string; time: number } | null>(null);
const instanceId = Math.random().toString(36).substring(7);

console.log(`[Navbar] Mounted instance: ${instanceId}`);

const handleNotificationSocket = (newNotification: any) => {
  console.log(`[Navbar ${instanceId}] Received socket notification:`, newNotification);

  // Frontend Deduplication Safeguard
  // Prevent duplicate notifications (same title/message) within 2 seconds, even if IDs differ
  const now = Date.now();
  if (lastNotification.value) {
    const isSameContent =
      lastNotification.value.title === newNotification.title &&
      lastNotification.value.message === newNotification.message;
    const isRecent = now - lastNotification.value.time < 2000; // 2000ms window

    if (isSameContent && isRecent) {
      console.warn('[Navbar] Duplicate notification suppressed:', newNotification.title);
      return;
    }
  }

  // Update last notification tracker
  lastNotification.value = {
    title: newNotification.title,
    message: newNotification.message,
    time: now,
  };

  // Add new notification to list
  if (!unreadNotifications.value.some((n) => n.id === newNotification.id)) {
    unreadNotifications.value.unshift(newNotification);

    // Show Toast with type-based styling
    const getToastStyles = (type: string) => {
      const styles = {
        SUCCESS: {
          textColor: 'text-green-600',
          iconColor: '!text-green-600',
          buttonBg: 'bg-green-600',
          buttonHover: 'hover:bg-green-700',
        },
        APPROVE: {
          textColor: 'text-teal-600',
          iconColor: '!text-teal-600',
          buttonBg: 'bg-teal-600',
          buttonHover: 'hover:bg-teal-700',
        },
        ERROR: {
          textColor: 'text-red-600',
          iconColor: '!text-red-600',
          buttonBg: 'bg-red-600',
          buttonHover: 'hover:bg-red-700',
        },
        WARNING: {
          textColor: 'text-yellow-600',
          iconColor: '!text-yellow-600',
          buttonBg: 'bg-yellow-600',
          buttonHover: 'hover:bg-yellow-700',
        },
        INFO: {
          textColor: 'text-blue-600',
          iconColor: '!text-blue-600',
          buttonBg: 'bg-blue-600',
          buttonHover: 'hover:bg-blue-700',
        },
        REQUEST: {
          textColor: 'text-purple-600',
          iconColor: '!text-purple-600',
          buttonBg: 'bg-purple-600',
          buttonHover: 'hover:bg-purple-700',
        },
      };
      return styles[type as keyof typeof styles] || styles.INFO;
    };

    const style = getToastStyles(newNotification.type);

    const toastOptions = {
      description: newNotification.message,
      duration: 5000, // 5 seconds
      unstyled: false, // Keep Sonner's base styling
      action: {
        label: 'View',
        onClick: () => handleNotificationClick(newNotification),
      },
      classNames: {
        toast: 'bg-white border-2 shadow-lg',
        title: `font-semibold ${style.textColor}`,
        description: 'text-gray-600',
        actionButton: `${style.buttonBg} ${style.buttonHover} text-white border-0 font-medium !important`,
        icon: `w-6 h-6 ${style.iconColor}`,
      },
    };

    switch (newNotification.type) {
      case 'SUCCESS':
      case 'APPROVE':
        toast.success(newNotification.title, toastOptions);
        break;
      case 'ERROR':
        toast.error(newNotification.title, toastOptions);
        break;
      case 'WARNING':
        toast.warning(newNotification.title, toastOptions);
        break;
      case 'INFO':
      case 'REQUEST':
      default:
        toast.info(newNotification.title, toastOptions);
        break;
    }
  }

  // Refresh pending approvals if notification relates to approvals
  if (
    newNotification.sourceApp === 'APPROVALS' ||
    newNotification.type === 'REQUEST' ||
    newNotification.type === 'APPROVE' ||
    newNotification.title.toLowerCase().includes('approval')
  ) {
    fetchPendingApprovals();
  }
};

onMounted(() => {
  fetchUnreadNotifications();
  fetchPendingApprovals();
  socketService.connect();
  socketService.on('notification', handleNotificationSocket);
  window.addEventListener('refresh-approvals-count', fetchPendingApprovals);
});

watch(
  () => authStore.user,
  (newUser: any) => {
    if (newUser?.id) {
      socketService.joinRoom(newUser.id);
    }
  }
);

onUnmounted(() => {
  // if (pollingInterval) clearInterval(pollingInterval);
  socketService.off('notification', handleNotificationSocket);
  window.removeEventListener('refresh-approvals-count', fetchPendingApprovals);
});
</script>

<template>
  <header
    class="h-[calc(3rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] border-b border-border bg-card/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50 draggable-region transition-all"
  >
    <div class="flex items-center gap-6 no-drag">

      <!-- Horizontal Navigation Menubar -->
      <div class="hidden md:flex items-center gap-4 no-drag" v-if="!isGuestRoute">
        <NavigationMenubar />
        <div class="h-4 w-[1px] bg-border/60 mx-2"></div>
        <NavbarBreadcrumb />
      </div>

    </div>

    <div class="flex items-center gap-2 no-drag">
      <!-- User Profile & Notifications -->
      <!-- User Profile & Notifications -->
      <Popover v-if="!isGuestRoute">
        <PopoverTrigger as-child>
          <Button variant="ghost" class="h-9 px-2 flex items-center gap-3 rounded-xl hover:bg-accent/50 transition-all no-drag relative group">
            <div class="hidden sm:flex flex-col items-end leading-none gap-0.5 text-right">
              <span class="text-xs font-bold text-foreground">
                {{ authStore.user?.firstName }} {{ authStore.user?.lastName?.charAt(0) }}.
              </span>
              <span class="text-[9px] font-medium text-muted-foreground">
                {{ authStore.user?.email }}
              </span>
            </div>
            <div class="relative">
              <Avatar class="h-8 w-8 rounded-full border border-border/40 shadow-sm shrink-0">
                <AvatarImage :src="authStore.userAvatarUrl" :alt="authStore.user?.username || ''" />
                <AvatarFallback class="rounded-full bg-primary/5 text-primary text-xs font-bold">{{ userInitials() }}</AvatarFallback>
              </Avatar>
              <!-- Consolidated Notification Badge -->
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[0.5rem] font-bold text-destructive-foreground animate-in zoom-in duration-300 ring-2 ring-background"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-80 sm:w-96 p-0 border-none shadow-2xl rounded-[10px]" align="end" side="bottom" :side-offset="8">
          
          <!-- User Info Header -->
          <div class="flex items-center gap-4 p-4">
            <div class="relative">
              <Avatar class="h-10 w-10 rounded-full border border-border shadow-sm">
                <AvatarImage :src="authStore.userAvatarUrl" :alt="authStore.user?.username || ''" />
                <AvatarFallback class="rounded-full bg-primary/10 text-primary text-sm font-bold">{{ userInitials() }}</AvatarFallback>
              </Avatar>
              <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-card"></div>
            </div>
            <div class="flex flex-col flex-1 min-w-0">
               <span class="text-sm font-bold text-foreground truncate">
                {{ authStore.user?.firstName }} {{ authStore.user?.lastName?.charAt(0) }}.
              </span>
              <span class="text-[10px] text-muted-foreground truncate">
                {{ authStore.user?.email }}
              </span>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                class="h-8 w-8 hover:bg-muted rounded-full" 
                @click="router.push('/profile')"
                title="Profile"
              >
                <User class="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                class="h-8 w-8 hover:bg-muted rounded-full" 
                @click="showThemeSettings = true"
                title="Theme Settings"
              >
                <Settings class="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                class="h-8 w-8 hover:bg-red-50 hover:text-red-600 rounded-full" 
                @click="handleLogout"
                title="Sign Out"
              >
                <LogOut class="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>

          <div class="px-4 pb-4 pt-2">
            <div class="bg-white dark:bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <!-- Recent Alerts Header -->
              <div class="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/20">
                <div class="flex items-center gap-2">
                    <Bell class="w-4 h-4 text-muted-foreground" />
                    <h4 class="text-xs font-bold uppercase tracking-widest text-muted-foreground">RECENT ALERTS</h4>
                </div>
                <div v-if="unreadCount > 0" class="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                    {{ unreadCount }}
                </div>
              </div>

              <!-- Alerts List -->
              <div class="divide-y divide-border/40 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <div v-if="unreadNotifications.length === 0" class="py-12 text-center text-muted-foreground">
                    <p class="text-xs">No new notifications</p>
                </div>
                
                <template v-else>
                    <div
                    v-for="notification in unreadNotifications"
                    :key="notification.id"
                    class="group flex flex-col gap-1 p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                    @click="handleNotificationClick(notification)"
                    >
                        <div class="flex items-center justify-between gap-2 mb-1">
                            <span class="text-sm font-bold text-foreground line-clamp-1 italic group-hover:text-primary transition-colors">
                            {{ notification.title }}
                            </span>
                            <span class="text-[10px] text-muted-foreground whitespace-nowrap">
                            {{ formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) }}
                            </span>
                        </div>
                        <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-light">
                            {{ notification.message }}
                        </p>
                    </div>
                </template>
              </div>

              <!-- View All Button -->
              <div class="p-2 bg-muted/20">
                <Button variant="ghost" class="w-full h-9 text-[11px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest" @click="router.push('/my-notifications')">
                    View All Notifications
                </Button>
              </div>
            </div>
          </div>

        </PopoverContent>
      </Popover>

      <!-- Window Controls -->
      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8"
          title="Minimize"
          @click="handleMinimize"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
          >
            <path
              d="M2.25 7.5H12.75"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8"
          title="Maximize"
          @click="handleMaximize"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5"
          >
            <path
              d="M2.5 2.5H12.5V12.5H2.5V2.5Z"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8 hover:bg-red-500 hover:text-white"
          title="Close"
          @click="handleClose"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
          >
            <path
              d="M3.75 3.75L11.25 11.25"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.25 3.75L3.75 11.25"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Button>
      </div>
    </div>
    <!-- Theme Settings Dialog -->
    <Dialog v-model:open="showThemeSettings">
      <DialogContent class="sm:max-w-[425px] max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <DialogHeader>
          <DialogTitle>Theme Settings</DialogTitle>
          <DialogDescription>Customize the appearance of the application.</DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <AppearanceSettings />
        </div>
      </DialogContent>
    </Dialog>

    <!-- Ticket Preview Dialog -->
    <TicketDialog v-model:open="isTicketPreviewOpen" :ticket="previewTicket" />

    <!-- Error/Info Dialog (For Missing Data) -->
    <AlertDialog v-model:open="isErrorDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Data Unavailable</AlertDialogTitle>
          <AlertDialogDescription>
            {{ errorDialogMessage }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction @click="isErrorDialogOpen = false">OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Close Confirmation Dialog -->
    <AlertDialog v-model:open="isCloseConfirmOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close Application?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to close the application? Any unsaved changes will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="confirmClose">Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <!-- Logout Confirmation Dialog -->
    <AlertDialog v-model:open="isLogoutConfirmOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign Out?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to sign out of the system?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="confirmLogout" class="bg-red-600 hover:bg-red-700 text-white">Sign Out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </header>
</template>

<style scoped>
/* Draggable window region */
.draggable-region {
  -webkit-app-region: drag;
  app-region: drag;
}

/* Make interactive elements clickable */
.no-drag,
.no-drag * {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}

@keyframes bell-ring {
  0%,
  100% {
    transform: rotate(0);
  }
  15% {
    transform: rotate(15deg);
  }
  30% {
    transform: rotate(-15deg);
  }
  45% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(5deg);
  }
  85% {
    transform: rotate(-5deg);
  }
}

.animate-bell-ring {
  animation: bell-ring 2s cubic-bezier(0.19, 1, 0.22, 1) infinite;
  transform-origin: top center;
}
</style>

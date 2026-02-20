<script setup lang="ts">
import JobOrderA4 from "@/components/helpdesk/JobOrderA4.vue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { usePermissions } from "@/composables/usePermissions";
import { useUsers } from "@/composables/useUsers";
import { getAvatarUrl } from "@/lib/utils";
import type { ITTicket, UpdateITTicketDto } from "@/services/it-tickets";
import { itTicketsApi } from "@/services/it-tickets";
import { socketService } from "@/services/socket";
import { useAuthStore } from "@/stores/auth";
import {
  format,
  formatDistanceToNowStrict,
  intervalToDuration,
} from "date-fns";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  AlertCircle,
  ArrowUpDown,
  FileText,
  History,
  Printer,
  X,
} from "lucide-vue-next";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { toast } from "vue-sonner";

const jobOrderRef = ref<any>(null);

const props = withDefaults(
  defineProps<{
    open: boolean;
    ticket: ITTicket | null;
    viewMode?: "management" | "paper-only";
  }>(),
  {
    viewMode: "management",
  },
);

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "ticketUpdated", ticket: ITTicket): void;
  (e: "close"): void;
}>();

const { users: allUsers } = useUsers();
const authStore = useAuthStore();
const { isAdmin } = usePermissions();

const loading = ref(false);
const localTicket = ref<ITTicket | null>(null);
const comment = ref("");

// Form states
const selectedStatus = ref("");
const selectedPriority = ref("");
const selectedAssignee = ref("");
const isDeleteDialogOpen = ref(false);
const isRejectDialogOpen = ref(false);
const isStatusConfirmDialogOpen = ref(false);

const createdDate = ref<string | null>(null);
const createdTime = ref("00:00");

const resolvedDate = ref<string | null>(null);
const resolvedTime = ref("00:00");

// Initialize local state when ticket changes
watch(
  () => props.ticket,
  (newTicket) => {
    if (newTicket) {
      localTicket.value = { ...newTicket };
      selectedStatus.value = newTicket.status;
      selectedPriority.value = newTicket.priority;
      selectedAssignee.value = newTicket.assigneeId || "unassigned";
      if (newTicket.resolvedAt) {
        const d = new Date(newTicket.resolvedAt);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        resolvedDate.value = `${year}-${month}-${day}`;
        resolvedTime.value = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      } else if (["Resolved", "Closed"].includes(newTicket.status)) {
        // Fallback to updatedAt if resolvedAt is missing but status is resolved/closed
        const d = new Date(newTicket.updatedAt);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        resolvedDate.value = `${year}-${month}-${day}`;
        resolvedTime.value = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      } else {
        resolvedDate.value = null;
        resolvedTime.value = "00:00";
      }

      if (newTicket.createdAt) {
        const d = new Date(newTicket.createdAt);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        createdDate.value = `${year}-${month}-${day}`;
        createdTime.value = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      }
    }
  },
  { immediate: true },
);

// Watch for status changes to set default resolved date
watch(selectedStatus, (newStatus) => {
  if (["Resolved", "Closed"].includes(newStatus) && !resolvedDate.value) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    resolvedDate.value = `${year}-${month}-${day}`;
    resolvedTime.value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  }
});

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-800";
    case "In Progress":
      return "bg-yellow-100 text-yellow-800";
    case "Approved":
      return "bg-purple-100 text-purple-800";
    case "Resolved":
      return "bg-green-100 text-green-800";
    case "Closed":
      return "bg-gray-100 text-gray-800";
    case "Pending":
      return "bg-orange-100 text-orange-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "outline";
  }
};

const formatDate = (date: string | Date | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  const formatted = format(d, "dd MMM yyyy, HH:mm");
  const now = new Date();
  const duration = intervalToDuration({ start: d, end: now });

  let timeAgo = "";
  if (duration.years)
    timeAgo = formatDistanceToNowStrict(d, { addSuffix: true });
  else if (duration.months)
    timeAgo = formatDistanceToNowStrict(d, { addSuffix: true });
  else if (duration.days) {
    timeAgo = `${duration.days}d ${duration.hours ?? 0}h ago`;
  } else if (duration.hours) {
    timeAgo = `${duration.hours}h ${duration.minutes ?? 0}m ago`;
  } else {
    timeAgo = `${duration.minutes ?? 0}m ago`;
  }

  return `${formatted} (${timeAgo})`;
};

const userInitials = (user?: any) => {
  if (!user || (!user.firstName && !user.displayName)) return "U";
  const name = user.displayName || user.firstName;
  return name.charAt(0).toUpperCase();
};

const resolutionDuration = computed(() => {
  if (!localTicket.value || !localTicket.value.resolvedAt) return null;
  const created = new Date(localTicket.value.createdAt);
  const resolved = new Date(localTicket.value.resolvedAt);

  const duration = intervalToDuration({ start: created, end: resolved });

  if (duration.years || duration.months) {
    return formatDistanceToNowStrict(created, { addSuffix: false });
  }

  let parts = [];
  if (duration.days) parts.push(`${duration.days}d`);
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes) parts.push(`${duration.minutes}m`);
  if (parts.length === 0) return "less than 1m";

  return parts.join(" ");
});

const refreshTicket = async () => {
  if (!props.ticket?.id) return;
  try {
    const fresh = await itTicketsApi.getById(props.ticket.id);
    if (fresh) {
      localTicket.value = fresh as any;
      selectedStatus.value = fresh.status;
      selectedPriority.value = fresh.priority;
      selectedAssignee.value = fresh.assigneeId || "unassigned";
      emit("ticketUpdated", fresh as any);
    }
  } catch (error) {
    console.error("Failed to refresh ticket:", error);
  }
};

onMounted(() => {
  socketService.on("ticket:updated", (updatedTicket: ITTicket) => {
    if (updatedTicket.id === props.ticket?.id) {
      refreshTicket();
    }
  });

  socketService.on("ticket:commented", ({ ticketId }: { ticketId: string }) => {
    if (ticketId === props.ticket?.id) {
      refreshTicket();
    }
  });
});

onUnmounted(() => {
  socketService.off("ticket:updated");
  socketService.off("ticket:commented");
});

const mergedTimeline = computed(() => {
  if (!localTicket.value) return [];

  const comments = (localTicket.value.comments || []).map((c) => ({
    ...c,
    timelineType: "comment",
  }));

  const activities = (localTicket.value.activities || []).map((a) => ({
    ...a,
    timelineType: "activity",
  }));

  return [...comments, ...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  ) as any[];
});

const saveChanges = async (confirmed = false) => {
  if (!localTicket.value) return;

  const isClosing = ["Resolved", "Closed"].includes(selectedStatus.value);
  const wasNotClosing = !["Resolved", "Closed"].includes(
    localTicket.value.status,
  );

  if (isClosing && wasNotClosing && !confirmed) {
    isStatusConfirmDialogOpen.value = true;
    return;
  }

  try {
    loading.value = true;
    const updateDto: UpdateITTicketDto = {};
    let hasChanges = false;

    if (selectedStatus.value !== localTicket.value.status) {
      updateDto.status = selectedStatus.value as any;
      hasChanges = true;
    }
    if (selectedPriority.value !== localTicket.value.priority) {
      updateDto.priority = selectedPriority.value as any;
      hasChanges = true;
    }

    const assigneeVal =
      selectedAssignee.value === "unassigned" ? null : selectedAssignee.value;
    if (assigneeVal !== localTicket.value.assigneeId) {
      (updateDto as any).assigneeId = assigneeVal;
      hasChanges = true;
    }

    if (["Resolved", "Closed"].includes(selectedStatus.value)) {
      // Check if we have a resolved date set in the UI
      if (resolvedDate.value) {
        const [year, month, day] = resolvedDate.value.split("-").map(Number);
        const [hours, minutes] = resolvedTime.value.split(":").map(Number);

        // Construct date using local time
        const newResolvedAtDate = new Date(
          year,
          month - 1,
          day,
          hours,
          minutes,
        );
        const newResolvedAt = newResolvedAtDate.toISOString();

        // ALWAYS update the resolvedAt if status is resolved/closed and we have a date
        // This fixes the issue where sometimes the date doesn't update if it thinks it's the same
        (updateDto as any).resolvedAt = newResolvedAt;
        hasChanges = true;
        console.log("[DEBUG] Setting resolvedAt:", newResolvedAt);
      }
    }

    // Handle createdAt update (Admin only)
    if (isAdmin.value && createdDate.value) {
      try {
        const [year, month, day] = createdDate.value.split("-").map(Number);
        let hours = 0,
          minutes = 0;

        if (createdTime.value) {
          const timeParts = createdTime.value.split(":").map(Number);
          if (timeParts.length >= 2) {
            hours = timeParts[0];
            minutes = timeParts[1];
          }
        }

        const newCreatedAtDate = new Date(year, month - 1, day, hours, minutes);
        const newCreatedAt = newCreatedAtDate.toISOString();

        console.log("[DEBUG] Admin updating createdAt:", {
          old: localTicket.value.createdAt,
          new: newCreatedAt,
          isDiff: newCreatedAt !== localTicket.value.createdAt,
        });

        if (newCreatedAt !== localTicket.value.createdAt) {
          (updateDto as any).createdAt = newCreatedAt;
          hasChanges = true;
        }
      } catch (err) {
        console.error("[DEBUG] Date processing error:", err);
      }
    }

    if (!hasChanges) {
      toast.info("No changes to save");
      loading.value = false;
      return;
    }

    console.log("[DEBUG] Sending updateDto:", updateDto);

    const updatedTicket = await itTicketsApi.update(
      props.ticket!.id,
      updateDto,
    );
    // console.log('[DEBUG] Received updatedTicket:', updatedTicket); // Removed debug log

    toast.success("Ticket updated successfully");
    emit("ticketUpdated", updatedTicket);

    if (comment.value.trim()) {
      await handlePostComment();
    }

    emit("update:open", false);
  } catch (error) {
    console.error(error);
    toast.error("Failed to update ticket");
  } finally {
    loading.value = false;
    isStatusConfirmDialogOpen.value = false;
  }
};

const availableAssignees = computed(() => {
  return allUsers.value || [];
});

const isOwner = computed(() => {
  if (!localTicket.value || !authStore.user) return false;
  // Check if requesterId matches current user or if admin
  return localTicket.value.requesterId === authStore.user.id || isAdmin.value;
});

// Removed unused isApprover logic

const isITDepartment = computed(() => {
  const userDept = authStore.user?.department;
  return (
    userDept === "IT" ||
    userDept === "Information Technology" ||
    userDept === "เทคโนโลยีสารสนเทศ (IT)"
  );
});

const isEditable = computed(() => {
  if (isAdmin.value) return true;
  if (!localTicket.value) return false;
  // IT Department can always edit
  if (isITDepartment.value) return true;
  return !["Approved", "Closed", "Resolved", "Cancelled"].includes(
    localTicket.value.status,
  );
});

const canManage = computed(() => {
  return isOwner.value || isITDepartment.value;
});

const rejectRequest = async () => {
  if (!localTicket.value) return;
  try {
    loading.value = true;
    const updated = await itTicketsApi.update(localTicket.value.id, {
      status: "Cancelled",
    });
    emit("ticketUpdated", updated);
    toast.success("Request Rejected (Cancelled)");
    isOpen.value = false;
  } catch (error) {
    console.error("Failed to reject request:", error);
    toast.error("Failed to reject request");
  } finally {
    loading.value = false;
    isRejectDialogOpen.value = false;
  }
};

const handleDelete = () => {
  isDeleteDialogOpen.value = true;
};

const confirmDelete = async () => {
  if (!localTicket.value) return;

  try {
    loading.value = true;
    await itTicketsApi.delete(localTicket.value.id);
    toast.success("Ticket deleted successfully");
    emit("ticketUpdated", localTicket.value); // Trigger refresh
    emit("close");
    isOpen.value = false;
  } catch (error) {
    console.error("Failed to delete ticket:", error);
    toast.error("Failed to delete ticket");
  } finally {
    loading.value = false;
    isDeleteDialogOpen.value = false;
  }
};

const handlePostComment = async () => {
  if (!localTicket.value || !comment.value.trim()) return;

  try {
    loading.value = true;
    const newComment = await itTicketsApi.addComment(
      localTicket.value.id,
      comment.value,
    );

    // Add to local list
    if (!localTicket.value.comments) {
      localTicket.value.comments = [];
    }
    localTicket.value.comments.unshift(newComment);

    comment.value = "";
    toast.success("Comment posted");
  } catch (error) {
    console.error("Failed to post comment:", error);
    toast.error("Failed to post comment");
  } finally {
    loading.value = false;
  }
};

const captureJobOrderElement = async () => {
  if (!jobOrderRef.value) return null;
  const element = jobOrderRef.value.$el || jobOrderRef.value;

  // Temporarily ensure the element is visible and has correct dimensions for capture
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;

  // Standard A4 width at 96 DPI is approx 794px
  element.style.width = "794px";
  element.style.maxWidth = "794px";

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 794,
      windowHeight: 1123,
    });

    // Restore original styles
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;

    return canvas.toDataURL("image/jpeg", 0.95);
  } catch (err) {
    // Restore original styles even on error
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
    throw err;
  }
};

const exportJobOrderPDF = async () => {
  if (!localTicket.value) return;
  const loadingToast = toast.loading("Generating Job Order PDF...");

  try {
    const imgData = await captureJobOrderElement();
    if (!imgData) throw new Error("Failed to capture element");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "MEDIUM");
    pdf.save(`JobOrder-${localTicket.value.ticketNo}.pdf`);

    toast.dismiss(loadingToast);
    toast.success("Job Order PDF generated successfully");
  } catch (err) {
    console.error("PDF Export Error:", err);
    toast.dismiss(loadingToast);
    toast.error("Failed to export Job Order");
  }
};

const handlePrint = async () => {
  if (!localTicket.value) return;
  const loadingToast = toast.loading("Preparing Print Document...");

  try {
    const imgData = await captureJobOrderElement();
    if (!imgData) throw new Error("Failed to capture element");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);

    // Create a Blob URL and open it for printing
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);

    // Open in a new hidden iframe to trigger print
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        // Clean up after small delay
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 1000);
      }, 200);
    };

    toast.dismiss(loadingToast);
  } catch (err) {
    console.error("Print Error:", err);
    toast.dismiss(loadingToast);
    toast.error("Failed to prepare document for printing");
  }
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      @openAutoFocus="(e) => e.preventDefault()"
      class="w-full p-0 gap-0 overflow-hidden border-none shadow-2xl flex flex-col transition-all duration-300 bg-white"
      :class="
        viewMode === 'paper-only'
          ? 'max-w-[850px] max-h-[98vh] rounded-2xl'
          : 'max-w-[950px] max-h-[95vh] rounded-2xl'
      "
    >
      <DialogDescription class="sr-only">
        Details for ticket {{ localTicket?.ticketNo }}
      </DialogDescription>

      <div
        v-if="viewMode === 'management'"
        class="px-6 py-4 bg-white border-b flex items-center justify-between shrink-0 print:hidden"
      >
        <div class="flex items-center gap-4">
          <h3
            class="text-base font-black text-slate-800 tracking-tight uppercase"
          >
            Ticket Case Details
          </h3>
        </div>
      </div>

      <div
        v-if="viewMode === 'paper-only'"
        class="px-6 py-3 bg-white border-b flex items-center justify-between shrink-0 print:hidden shadow-sm relative z-10"
      >
        <div class="flex items-center gap-6">
          <button
            @click="exportJobOrderPDF"
            class="flex flex-col items-center gap-1 group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-all shadow-sm"
            >
              <FileText class="w-4 h-4" />
            </div>
            <span
              class="text-[0.55rem] font-black uppercase tracking-widest text-indigo-600"
              >Generate PDF</span
            >
          </button>
          <button
            @click="handlePrint"
            class="flex flex-col items-center gap-1 group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-slate-100 transition-all shadow-sm"
            >
              <Printer class="w-4 h-4" />
            </div>
            <span
              class="text-[0.55rem] font-black uppercase tracking-widest text-slate-400"
              >Print</span
            >
          </button>
        </div>
        <button
          @click="isOpen = false"
          class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          title="Close"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Main A4 Form Content Area -->
      <div
        class="flex-1 min-h-0 overflow-y-auto p-6 print:p-0 scrollbar-hide"
        :class="
          viewMode === 'paper-only'
            ? 'bg-slate-50 flex flex-col items-center pt-4 pb-8'
            : 'bg-slate-100/50'
        "
      >
        <!-- Standard Wrapper for Paper-only mode (Original Scale) -->
        <div
          :class="
            viewMode === 'paper-only'
              ? 'relative pointer-events-none select-none'
              : 'relative'
          "
        >
          <!-- The Componentized A4 Paper Sheet -->
          <JobOrderA4
            ref="jobOrderRef"
            :ticket="localTicket"
            :isEditable="viewMode === 'paper-only' ? false : isEditable"
            :canManage="viewMode === 'paper-only' ? false : canManage"
            :availableAssignees="availableAssignees"
            :resolutionDuration="resolutionDuration"
            :getStatusColor="getStatusColor"
            @update:ticket="(val) => (localTicket = val)"
            @update:assignee="(val) => (selectedAssignee = val)"
            @update:priority="(val) => (selectedPriority = val)"
            @update:status="(val) => (selectedStatus = val)"
          />
        </div>

        <!-- Service History (Tab Area - Hidden in Print or Paper-only) -->
        <div
          v-if="viewMode === 'management'"
          class="max-w-[800px] mx-auto mt-8 px-10 print:hidden"
        >
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h4
                class="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3"
              >
                <History class="w-4 h-4" />
                System Audit & Activity Logs
              </h4>
              <span
                class="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest"
                >{{ mergedTimeline.length }} Events</span
              >
            </div>

            <!-- Enhanced Timeline Content -->
            <div class="space-y-4 pb-20">
              <!-- Comment Input -->
              <div
                v-if="isEditable"
                class="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
              >
                <div class="flex gap-4">
                  <Avatar
                    class="w-10 h-10 border-2 border-white shadow-sm ring-1 ring-slate-100 shrink-0"
                  >
                    <AvatarImage :src="getAvatarUrl(authStore.user?.avatar)" />
                    <AvatarFallback class="bg-primary/5 text-primary text-xs"
                      >ME</AvatarFallback
                    >
                  </Avatar>
                  <div class="flex-1">
                    <Textarea
                      placeholder="Add an internal note or progress update..."
                      v-model="comment"
                      class="min-h-[60px] bg-transparent border-0 focus-visible:ring-0 resize-none text-[0.8rem] font-bold p-0 shadow-none placeholder:text-slate-300"
                    />
                    <div
                      class="flex items-center justify-between mt-3 pt-3 border-t border-slate-50"
                    >
                      <span
                        class="text-[0.6rem] font-black text-slate-300 uppercase tracking-widest italic"
                        >Confidential Internal Remark</span
                      >
                      <Button
                        @click="handlePostComment"
                        :disabled="!comment.trim() || loading"
                        size="sm"
                        class="bg-slate-900 hover:bg-black text-white px-4 h-7 text-[0.65rem] font-black uppercase tracking-widest rounded-lg shadow-md transition-all active:scale-95"
                      >
                        Post Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- History Items -->
              <div
                v-for="item in mergedTimeline"
                :key="item.id"
                class="relative group"
              >
                <div
                  class="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div class="flex gap-4">
                    <div class="shrink-0">
                      <Avatar
                        class="w-10 h-10 border-2 border-white shadow-sm ring-1 ring-slate-100"
                      >
                        <AvatarImage :src="getAvatarUrl(item.user?.avatar)" />
                        <AvatarFallback
                          class="bg-slate-100 text-slate-400 text-xs"
                          >{{ userInitials(item.user) }}</AvatarFallback
                        >
                      </Avatar>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-1.5">
                        <span
                          class="text-[0.7rem] font-black text-slate-800 uppercase tracking-wide truncate pr-4"
                          >{{ item.user?.displayName || "System" }}</span
                        >
                        <span
                          class="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest shrink-0"
                          >{{ formatDate(item.createdAt) }}</span
                        >
                      </div>

                      <div
                        v-if="item.timelineType === 'comment'"
                        class="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100/50 italic"
                      >
                        "{{ item.content }}"
                      </div>

                      <div
                        v-else
                        class="flex flex-wrap items-center gap-1.5 text-[0.7rem] font-bold text-slate-500 py-1 uppercase"
                      >
                        <div
                          class="w-2 h-2 rounded-full bg-slate-300 mr-1"
                        ></div>
                        <span v-if="item.type === 'STATUS_CHANGE'">
                          From
                          <span
                            class="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600"
                            >{{ item.oldValue }}</span
                          >
                          »
                          <span
                            class="bg-primary/10 text-primary px-1.5 py-0.5 rounded"
                            >{{ item.newValue }}</span
                          >
                        </span>
                        <span v-else-if="item.type === 'ASSIGNMENT'">
                          Assigned to
                          <span class="text-primary">{{
                            item.newValue || "Unassigned"
                          }}</span>
                        </span>
                        <span v-else-if="item.type === 'TICKET_CREATED'"
                          >Case Initialized</span
                        >
                        <span v-else>{{ item.content || item.type }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="viewMode === 'management'"
        class="px-6 py-3 bg-white border-t flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0 relative shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] print:hidden"
      >
        <!-- Dashboard / Links -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-4">
            <button
              @click="exportJobOrderPDF"
              class="flex flex-col items-center gap-1 group"
            >
              <div
                class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-all shadow-sm"
              >
                <FileText class="w-4 h-4" />
              </div>
              <span
                class="text-[0.55rem] font-black uppercase tracking-widest text-indigo-600"
                >Generate PDF</span
              >
            </button>
            <button
              @click="handlePrint"
              class="flex flex-col items-center gap-1 group"
            >
              <div
                class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-slate-100 transition-all shadow-sm"
              >
                <Printer class="w-4 h-4" />
              </div>
              <span
                class="text-[0.55rem] font-black uppercase tracking-widest text-slate-400"
                >Print</span
              >
            </button>
            <button
              @click="saveChanges()"
              :disabled="loading"
              class="flex flex-col items-center gap-1 group"
            >
              <div
                class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-all shadow-sm"
              >
                <ArrowUpDown class="w-4 h-4" />
              </div>
              <span
                class="text-[0.55rem] font-black uppercase tracking-widest text-emerald-600"
                >{{ loading ? "Saving..." : "Update Status" }}</span
              >
            </button>
          </div>

          <div class="w-px h-10 bg-slate-100 hidden sm:block"></div>

          <div class="flex gap-4">
            <button
              @click="isOpen = false"
              class="text-[0.65rem] font-bold text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest"
            >
              History
            </button>
            <button
              @click="isOpen = false"
              class="text-[0.65rem] font-bold text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest"
            >
              Reschedule
            </button>
            <button
              v-if="canManage"
              @click="handleDelete"
              class="text-[0.65rem] font-bold text-rose-400 hover:text-rose-600 transition-all uppercase tracking-widest"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Right Side Info -->
        <div class="flex items-center gap-4">
          <div class="text-right hidden md:block">
            <div
              class="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-0.5"
            >
              Estimated Duration
            </div>
            <div class="text-base font-black text-slate-800 tracking-tighter">
              {{ resolutionDuration || "Pending Scan" }}
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmation Dialogs -->
      <AlertDialog v-model:open="isStatusConfirmDialogOpen">
        <AlertDialogContent class="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle
              class="text-xl font-black text-slate-800 tracking-tight"
              >Confirm Status Modification</AlertDialogTitle
            >
            <AlertDialogDescription
              class="text-sm font-medium text-slate-500 leading-relaxed"
            >
              You are about to modify the journey status to
              <span class="font-black text-primary">{{ selectedStatus }}</span
              >. This will update the flight logs and record the final
              resolution checkpoint.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter class="gap-2">
            <AlertDialogCancel
              @click="selectedStatus = localTicket?.status || ''"
              class="rounded-xl border-slate-200 font-bold uppercase text-xs tracking-widest"
              >Abort Change</AlertDialogCancel
            >
            <AlertDialogAction
              @click="saveChanges(true)"
              class="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-xs tracking-widest px-6"
              >Confirm Checkpoint</AlertDialogAction
            >
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DialogContent>
  </Dialog>

  <AlertDialog v-model:open="isDeleteDialogOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle
          >Are you sure you want to delete this ticket?</AlertDialogTitle
        >
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the ticket
          <strong>{{ localTicket?.ticketNo }}</strong> and all its comments.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          @click="confirmDelete"
          class="bg-red-600 hover:bg-red-700 focus:ring-red-600"
        >
          Delete Ticket
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  <AlertDialog v-model:open="isRejectDialogOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="flex items-center gap-2 text-red-600">
          <AlertCircle class="w-5 h-5" />
          Reject Asset Request
        </AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to reject this asset request? The status will be
          changed to
          <strong>Cancelled</strong>.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          @click="rejectRequest"
          class="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
        >
          Confirm Reject
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped>
@media print {
  /* Set A4 page size and margins */
  @page {
    size: A4;
    margin: 20mm;
  }

  /* Force background colors and borders in print */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Hide everything except the A4 Paper content */
  :deep(.dialog-overlay),
  :deep(.dialog-content-header),
  :deep(.dialog-content-footer),
  :deep(.print\:hidden),
  /* Aggressively hide the shadcn/ui Dialog close button */
  :deep(button[class*="absolute"][class*="right-4"]),
  :deep(.close-button),
  .print\:hidden {
    display: none !important;
  }

  /* Reset parent containers surgically */
  :deep(.dialog-content) {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
    display: block !important;
    position: static !important;
    width: auto !important;
    height: auto !important;
    max-width: none !important;
    max-height: none !important;
    transform: none !important;
  }

  :deep(.flex-1.min-h-0.overflow-y-auto) {
    overflow: visible !important;
    height: auto !important;
    min-height: 0 !important;
    padding: 0 !important;
    background: transparent !important;
  }

  /* Ensure the paper content is centered and visible */
  #job-order-paper {
    display: block !important;
    margin: 0 auto !important;
    overflow: visible !important;
  }

  /* Prevent body/html from being clipped */
  html,
  body {
    overflow: visible !important;
    height: auto !important;
    background: white !important;
  }

  /* Box borders might need to be darker for print */
  .border-slate-900 {
    border-color: #000 !important;
  }
  .bg-slate-900 {
    background-color: #000 !important;
  }
}

/* Custom shadow for the A4 simulation */
#job-order-paper {
  box-shadow: 0 10px 50px -12px rgba(0, 0, 0, 0.15);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>

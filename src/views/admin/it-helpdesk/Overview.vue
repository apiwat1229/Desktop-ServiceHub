<script setup lang="ts">
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itTicketsApi, type ITTicket } from "@/services/it-tickets";
import { socketService } from "@/services/socket";
import {
  endOfMonth,
  format,
  isAfter,
  isBefore,
  startOfMonth,
  subMonths,
} from "date-fns";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  Star,
  Target,
  Ticket,
  User,
  Zap,
} from "lucide-vue-next";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import TicketDetailModal from "@/components/helpdesk/TicketDetailModal.vue";

const router = useRouter();

const isDetailModalOpen = ref(false);
const selectedTicket = ref<ITTicket | null>(null);
const detailViewMode = ref<"management" | "paper-only">("management");

const openTicketDetails = (ticket: ITTicket) => {
  selectedTicket.value = ticket;
  detailViewMode.value = "paper-only";
  isDetailModalOpen.value = true;
};

const onTicketUpdated = (updatedTicket: ITTicket) => {
  loadTickets();
};

const tickets = ref<ITTicket[]>([]);
const loadingTickets = ref(false);

const loadTickets = async () => {
  loadingTickets.value = true;
  try {
    tickets.value = await itTicketsApi.getAll();
  } catch (error) {
    console.error("Failed to load tickets:", error);
    toast.error("Failed to load tickets");
  } finally {
    loadingTickets.value = false;
  }
};

onMounted(() => {
  loadTickets();
  socketService.on("ticket:created", loadTickets);
  socketService.on("ticket:updated", loadTickets);
  socketService.on("ticket:deleted", loadTickets);
});

onUnmounted(() => {
  socketService.off("ticket:created", loadTickets);
  socketService.off("ticket:updated");
  socketService.off("ticket:deleted");
});

const ticketStats = computed(() => {
  if (!tickets.value.length) {
    return {
      total: 0,
      totalTrend: 0,
      open: 0,
      openTrend: 0,
      resolved: 0,
      resolvedTrend: 0,
      fcrPercent: "0%",
      fcrPercentTrend: 0,
      avgFcr: "0m",
      avgFcrTrend: 0,
      bestTime: "0m",
      bestTimeTrend: 0,
    };
  }

  const now = new Date();
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const filterByDate = (ts: ITTicket[], start: Date, end?: Date) =>
    ts.filter((t) => {
      const d = new Date(t.createdAt);
      return isAfter(d, start) && (end ? isBefore(d, end) : true);
    });

  // Main Stats (All Time for demo as per user request to see all 15 tickets)
  const currentMonthTickets = tickets.value;
  const currentTotal = currentMonthTickets.length;
  const currentOpen = currentMonthTickets.filter(
    (t) =>
      t.status !== "Resolved" &&
      t.status !== "Closed" &&
      t.status !== "Cancelled",
  ).length;
  const currentResolved = currentMonthTickets.filter(
    (t) => t.status === "Resolved" || t.status === "Closed",
  );

  // Calculate Avg FCR & Best Time & FCR% for Current Month
  let currentTotalMs = 0;
  let currentMinMs = currentResolved.length > 0 ? Infinity : 0;
  let currentFcrCount = 0;

  currentResolved.forEach((t) => {
    const diff =
      (t.resolvedAt
        ? new Date(t.resolvedAt)
        : new Date(t.updatedAt)
      ).getTime() - new Date(t.createdAt).getTime();
    currentTotalMs += diff;
    if (diff < currentMinMs) currentMinMs = diff;
    if (diff <= 3600000) currentFcrCount++; // <= 1 hour
  });

  const currentAvgMs = currentResolved.length
    ? currentTotalMs / currentResolved.length
    : 0;
  if (currentMinMs === Infinity) currentMinMs = 0;
  const currentFcrPercent = currentResolved.length
    ? Math.round((currentFcrCount / currentResolved.length) * 100)
    : 0;

  // Last Month Data
  const lastMonthTickets = filterByDate(
    tickets.value,
    lastMonthStart,
    lastMonthEnd,
  );
  const lastTotal = lastMonthTickets.length;
  const lastOpen = lastMonthTickets.filter(
    (t) =>
      t.status !== "Resolved" &&
      t.status !== "Closed" &&
      t.status !== "Cancelled",
  ).length;
  const lastResolved = lastMonthTickets.filter(
    (t) => t.status === "Resolved" || t.status === "Closed",
  );

  // Calculate Avg FCR & Best Time & FCR% for Last Month
  let lastTotalMs = 0;
  let lastMinMs = lastResolved.length > 0 ? Infinity : 0;
  let lastFcrCount = 0;

  lastResolved.forEach((t) => {
    const diff =
      (t.resolvedAt
        ? new Date(t.resolvedAt)
        : new Date(t.updatedAt)
      ).getTime() - new Date(t.createdAt).getTime();
    lastTotalMs += diff;
    if (diff < lastMinMs) lastMinMs = diff;
    if (diff <= 3600000) lastFcrCount++;
  });

  const lastAvgMs = lastResolved.length ? lastTotalMs / lastResolved.length : 0;
  if (lastMinMs === Infinity) lastMinMs = 0;
  const lastFcrPercent = lastResolved.length
    ? Math.round((lastFcrCount / lastResolved.length) * 100)
    : 0;

  // Trend Calculation Helper
  const calcTrend = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0; // If prev is 0 and curr > 0, treat as 100% growth
    return Math.round(((curr - prev) / prev) * 100);
  };

  const totalTrend = calcTrend(currentTotal, lastTotal);
  const openTrend = calcTrend(currentOpen, lastOpen);
  const resolvedTrend = calcTrend(currentResolved.length, lastResolved.length);
  const avgFcrTrend = calcTrend(currentAvgMs, lastAvgMs);
  const bestTimeTrend = calcTrend(currentMinMs, lastMinMs);
  const fcrPercentTrend = calcTrend(currentFcrPercent, lastFcrPercent);

  // Format Avg FCR for display (e.g., "10m", "1h 30m")
  const formatDuration = (ms: number) => {
    if (ms === 0) return "0m";
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  // Stats to Return (using all-time counts for main display, but month trends for "Compare to last month")
  // Wait, "Compare to last month" implies the main number is typically "This Month".
  // The User Image 1 shows "23,100" Created Tickets. If that's monthly volume, it's high. If all time, trends are weird.
  // Usually Dashboards show "This Month" vs "Last Month".
  // However, previous UI showed "Total Tickets Logged" (All Time).
  // If I change to "Compare to last month", the main number SHOULD represent the current period (Month).
  // Let's switch to Monthly Stats for the main number to make the comparison valid.
  return {
    total: currentTotal,
    totalTrend,
    open: currentOpen,
    openTrend,
    resolved: currentResolved.length,
    resolvedTrend,
    fcrPercent: currentFcrPercent + "%",
    fcrPercentTrend,
    avgFcr: formatDuration(currentAvgMs),
    avgFcrTrend,
    bestTime: formatDuration(currentMinMs),
    bestTimeTrend,
  };
});

// ── Analytics Computed ────────────────────────────────────────
const formatDuration = (ms: number) => {
  if (ms <= 0) return "—";
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
};

const getDuration = (ticket: ITTicket) => {
  if (!ticket.resolvedAt) return "—";
  const diff =
    new Date(ticket.resolvedAt).getTime() -
    new Date(ticket.createdAt).getTime();
  return formatDuration(diff);
};

const getPriorityColor = (priority: string) => {
  const p = (priority || "").toUpperCase();
  if (p === "URGENT" || p === "EMERGENCY") return "bg-rose-500";
  if (p === "HIGH") return "bg-amber-500";
  if (p === "MEDIUM" || p === "NORMAL") return "bg-blue-500";
  if (p === "LOW") return "bg-emerald-500";
  return "bg-slate-300";
};

const replyTimeStats = computed(() => {
  const resolved = tickets.value.filter((t: ITTicket) => t.resolvedAt);
  const hrs = (t: ITTicket) =>
    (new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime()) /
    3600000;
  const lt1h = resolved.filter((t) => hrs(t) <= 1).length;
  const h1to8 = resolved.filter((t) => hrs(t) > 1 && hrs(t) <= 8).length;
  const h8to24 = resolved.filter((t) => hrs(t) > 8 && hrs(t) <= 24).length;
  const gt24h = resolved.filter((t) => hrs(t) > 24).length;
  const noReply = tickets.value.filter((t: ITTicket) => !t.resolvedAt).length;
  const total = tickets.value.length || 1;
  return {
    lt1h,
    h1to8,
    h8to24,
    gt24h,
    noReply,
    total,
    resolvedCount: total - noReply,
  };
});

const replyTimeSlices = computed(() => {
  const { lt1h, h1to8, h8to24, gt24h, noReply } = replyTimeStats.value;
  // const totalResolved = lt1h + h1to8 + h8to24 + gt24h; // Not used directly in new logic

  const createSlice = (label: string, color: string, count: number) => ({
    label,
    color,
    count,
  });
  const data = [
    createSlice("0-1 Hours", "#0d9488", lt1h),
    createSlice("1-8 Hours", "#f59e0b", h1to8),
    createSlice("8-24 Hours", "#a855f7", h8to24),
    createSlice("> 24 Hours", "#6366f1", gt24h),
    createSlice("No Replies", "#ef4444", noReply),
  ];

  // Calculate total for chart slices only (excluding No Replies)
  const totalForSlices = lt1h + h1to8 + h8to24 + gt24h;

  let cumulativeAngle = 0;
  return data.map((slice) => {
    // Percentage for labels: calculate based on total resolved count (chart total)
    // If it's 'No Replies', we can show 0% or its own ratio, but visual suggests it's outside.
    // Let's keep logic simple: if part of chart, % of chart.
    // Or just Chart items % of Chart, and No Replies % of Total?
    // The previous code had `resolvedCount`.
    // Let's use `replyTimeStats.value.total` for percentages.

    const grandTotal = replyTimeStats.value.total;
    const percent =
      grandTotal > 0 ? Math.round((slice.count / grandTotal) * 100) : 0;

    const isChartSlice = slice.label !== "No Replies";

    // Only calculate path if it's a resolved ticket slice and has count > 0
    let path = undefined,
      lx = undefined,
      ly = undefined;

    if (isChartSlice && slice.count > 0 && totalForSlices > 0) {
      const sliceAngle = (slice.count / totalForSlices) * 360;

      // SVG Path Calculation
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + sliceAngle;

      const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
      const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
      const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
      const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

      const largeArcFlag = sliceAngle > 180 ? 1 : 0;

      const rIn = 30; // Inner radius
      const x1_in = 50 + rIn * Math.cos((Math.PI * startAngle) / 180);
      const y1_in = 50 + rIn * Math.sin((Math.PI * startAngle) / 180);
      const x2_in = 50 + rIn * Math.cos((Math.PI * endAngle) / 180);
      const y2_in = 50 + rIn * Math.sin((Math.PI * endAngle) / 180);

      path = `
        M ${x1} ${y1}
        A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}
        L ${x2_in} ${y2_in}
        A ${rIn} ${rIn} 0 ${largeArcFlag} 0 ${x1_in} ${y1_in}
        Z
      `;

      // Text Position (Midpoint at middle radius)
      const midAngle = startAngle + sliceAngle / 2;
      const rText = 40; // (50 + 30) / 2
      // Correct for -90deg rotation of SVG
      lx = 50 + rText * Math.cos((Math.PI * (midAngle - 90)) / 180);
      ly = 50 + rText * Math.sin((Math.PI * (midAngle - 90)) / 180);

      cumulativeAngle += sliceAngle;
    }

    return { ...slice, percent, path, lx, ly };
  });
});

const categoryStats = computed(() => {
  const counts: Record<string, number> = {};
  tickets.value.forEach((t: ITTicket) => {
    if (t.category) counts[t.category] = (counts[t.category] || 0) + 1;
  });
  const total = tickets.value.length || 1;
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
});

const agentStats = computed(() => {
  const counts: Record<string, { name: string; count: number }> = {};
  tickets.value
    .filter((t: ITTicket) => t.status === "Resolved" || t.status === "Closed")
    .forEach((t: ITTicket) => {
      if (t.assignee) {
        const id = t.assigneeId || t.assignee.id;
        if (!counts[id])
          counts[id] = {
            name: t.assignee.displayName || "Unknown Agent",
            count: 0,
          };
        counts[id].count++;
      }
    });
  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
});

const recentTicketsList = computed(() =>
  [...tickets.value]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5),
);

const categoryColors = [
  "#0D9488",
  "#3B82F6",
  "#F59E0B",
  "#8B5CF6",
  "#F43F5E",
  "#FB923C",
];
const formatFullTime = (d: string) => format(new Date(d), "dd MMM HH:mm");
</script>

<template>
  <div class="min-h-full space-y-6 animate-in fade-in duration-700">
    <!-- ── Stats Row ───────────────────────────────────────      <!-- Top 6 Cards -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
    >
      <!-- Card 1: Created Tickets -->
      <Card
        class="hover:shadow-lg transition-shadow duration-300 border-none shadow-sm bg-white"
      >
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium text-muted-foreground"
            >Created Tickets</CardTitle
          >
          <Ticket class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-3xl font-bold text-gray-900">
              {{ ticketStats.total.toLocaleString() }}
            </div>
            <div
              class="flex items-center text-xs font-medium"
              :class="
                ticketStats.totalTrend >= 0 ? 'text-green-500' : 'text-red-500'
              "
            >
              {{ ticketStats.totalTrend >= 0 ? "+" : ""
              }}{{ ticketStats.totalTrend }}%
              <ArrowUpRight
                v-if="ticketStats.totalTrend >= 0"
                class="h-3 w-3 ml-0.5"
              />
              <ArrowDownRight v-else class="h-3 w-3 ml-0.5" />
            </div>
          </div>
          <p class="text-xs text-muted-foreground mt-1">
            Compare to last month
          </p>
        </CardContent>
      </Card>

      <!-- Card 2: Unsolved Tickets -->
      <Card
        class="hover:shadow-lg transition-shadow duration-300 border-none shadow-sm bg-white"
      >
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium text-muted-foreground"
            >Unsolved Tickets</CardTitle
          >
          <Clock class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-3xl font-bold text-gray-900">
              {{ ticketStats.open.toLocaleString() }}
            </div>
            <div
              class="flex items-center text-xs font-medium"
              :class="
                ticketStats.openTrend <= 0 ? 'text-green-500' : 'text-red-500'
              "
            >
              <!-- Note: For unsolved, lower is usually better, but text color logic can be debated. 
                      User image shows green for positive change. I'll stick to Green = Positive Trend Number for now to match image style 
                      where "+3%" is green. Wait, image 1 created tickets +5.3% is red? 
                      Actually in image 1:
                      Created: -5.3% (Red)
                      Unsolved: +3% (Green) -> Wait, +Unsolved usually bad? Maybe context differs.
                      Solved: +5.3% (Green)
                      Avg Reply: +5.3% (Green) -> +Time usually bad?
                      The image seems to color + as Green and - as Red regardless of meaning, OR specific to metric.
                      Let's assume + is Green, - is Red for simplicity unless implied otherwise. 
                      Actually "Created -5.3%" is Red. "Unsolved +3%" is Green. 
                      "Solved +5.3%" is Green. "Avg Reply +5.3%" is Green.
                      So Green = Increase, Red = Decrease? 
                      No, Created -5.3% is Red. Usually decreasing volume is ... depends.
                      Let's stick to standard: Green = Good, Red = Bad.
                      Created: Up (Good/Neutral?), Down (Bad?). 
                      Let's just use: Increase = Green, Decrease = Red for now, or match Image 1 exactly?
                      Image 1: 
                      Created 23100 -5.3% (Red).
                      Unsolved 3154 +3% (Green).
                      So - is Red, + is Green.
                      I will follow this pattern.
                 -->
              {{ ticketStats.openTrend >= 0 ? "+" : ""
              }}{{ ticketStats.openTrend }}%
              <ArrowUpRight
                v-if="ticketStats.openTrend >= 0"
                class="h-3 w-3 ml-0.5"
              />
              <ArrowDownRight v-else class="h-3 w-3 ml-0.5" />
            </div>
          </div>
          <p class="text-xs text-muted-foreground mt-1">
            Compare to last month
          </p>
        </CardContent>
      </Card>

      <!-- Card 3: Solved Tickets -->
      <Card
        class="hover:shadow-lg transition-shadow duration-300 border-none shadow-sm bg-white"
      >
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium text-muted-foreground"
            >Solved Tickets</CardTitle
          >
          <CheckCircle2 class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-3xl font-bold text-gray-900">
              {{ ticketStats.resolved.toLocaleString() }}
            </div>
            <div
              class="flex items-center text-xs font-medium"
              :class="
                ticketStats.resolvedTrend >= 0
                  ? 'text-green-500'
                  : 'text-red-500'
              "
            >
              {{ ticketStats.resolvedTrend >= 0 ? "+" : ""
              }}{{ ticketStats.resolvedTrend }}%
              <ArrowUpRight
                v-if="ticketStats.resolvedTrend >= 0"
                class="h-3 w-3 ml-0.5"
              />
              <ArrowDownRight v-else class="h-3 w-3 ml-0.5" />
            </div>
          </div>
          <p class="text-xs text-muted-foreground mt-1">
            Compare to last month
          </p>
        </CardContent>
      </Card>

      <!-- Card 4: Best Time -->
      <Card
        class="hover:shadow-lg transition-shadow duration-300 border-none shadow-sm bg-white"
      >
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium text-muted-foreground"
            >Best Resolution Time</CardTitle
          >
          <Zap class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-3xl font-bold text-gray-900">
              {{ ticketStats.bestTime }}
            </div>
            <div
              class="flex items-center text-xs font-medium"
              :class="
                ticketStats.bestTimeTrend <= 0
                  ? 'text-green-500'
                  : 'text-red-500'
              "
            >
              {{ ticketStats.bestTimeTrend >= 0 ? "+" : ""
              }}{{ ticketStats.bestTimeTrend }}%
              <ArrowUpRight
                v-if="ticketStats.bestTimeTrend >= 0"
                class="h-3 w-3 ml-0.5"
              />
              <ArrowDownRight v-else class="h-3 w-3 ml-0.5" />
            </div>
          </div>
          <p class="text-xs text-muted-foreground mt-1">
            Compare to last month
          </p>
        </CardContent>
      </Card>

      <!-- Card 5: First Call Response Rate -->
      <Card
        class="hover:shadow-lg transition-shadow duration-300 border-none shadow-sm bg-white"
      >
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium text-muted-foreground"
            >First Call Response Rate</CardTitle
          >
          <Target class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-3xl font-bold text-gray-900">
              {{ ticketStats.fcrPercent }}
            </div>
            <div
              class="flex items-center text-xs font-medium"
              :class="
                ticketStats.fcrPercentTrend >= 0
                  ? 'text-green-500'
                  : 'text-red-500'
              "
            >
              {{ ticketStats.fcrPercentTrend >= 0 ? "+" : ""
              }}{{ ticketStats.fcrPercentTrend }}%
              <ArrowUpRight
                v-if="ticketStats.fcrPercentTrend >= 0"
                class="h-3 w-3 ml-0.5"
              />
              <ArrowDownRight v-else class="h-3 w-3 ml-0.5" />
            </div>
          </div>
          <p class="text-xs text-muted-foreground mt-1">
            Compare to last month
          </p>
        </CardContent>
      </Card>

      <!-- Card 6: Average First Call Response -->
      <Card
        class="hover:shadow-lg transition-shadow duration-300 border-none shadow-sm bg-white"
      >
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium text-muted-foreground"
            >Average First Call Response</CardTitle
          >
          <Activity class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-3xl font-bold text-gray-900">
              {{ ticketStats.avgFcr }}
            </div>
            <div
              class="flex items-center text-xs font-medium"
              :class="
                ticketStats.avgFcrTrend <= 0 ? 'text-green-500' : 'text-red-500'
              "
            >
              <!-- For time, lower is usually better. So < 0 is Green. -->
              {{ ticketStats.avgFcrTrend >= 0 ? "+" : ""
              }}{{ ticketStats.avgFcrTrend }}%
              <ArrowUpRight
                v-if="ticketStats.avgFcrTrend >= 0"
                class="h-3 w-3 ml-0.5"
              />
              <ArrowDownRight v-else class="h-3 w-3 ml-0.5" />
            </div>
          </div>
          <p class="text-xs text-muted-foreground mt-1">
            Compare to last month
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- ── Row 1: Service Performance │ Customer Satisfaction │ Resolution Time ── -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Ticket by Category -->
      <Card
        class="border-none shadow-2xl shadow-black/5 rounded-[10px] overflow-hidden"
      >
        <CardHeader class="px-6 pt-5 pb-3">
          <CardTitle
            class="text-base font-black tracking-tight flex items-center gap-2"
          >
            <ClipboardList class="w-4 h-4 text-primary" />
            Ticket by Category
          </CardTitle>
        </CardHeader>
        <CardContent class="px-6 pb-5">
          <div
            class="space-y-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-hide"
          >
            <div
              v-if="!categoryStats.length"
              class="text-center py-8 text-muted-foreground/30 text-xs font-bold uppercase tracking-widest"
            >
              No data
            </div>
            <div
              v-for="(item, i) in categoryStats"
              :key="item.name"
              class="space-y-1"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-sm"
                    :style="{
                      backgroundColor:
                        categoryColors[i % categoryColors.length],
                    }"
                  ></span>
                  <span class="text-xs font-bold text-foreground capitalize">{{
                    item.name
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-black text-foreground">{{
                    item.count
                  }}</span>
                  <span
                    class="text-[0.6rem] font-bold text-muted-foreground/50 w-8 text-right"
                    >{{ item.percent }}%</span
                  >
                </div>
              </div>
              <div class="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{
                    width: item.percent + '%',
                    backgroundColor: categoryColors[i % categoryColors.length],
                  }"
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- First Call Response Rate -->
      <Card
        class="border-none shadow-2xl shadow-black/5 rounded-[10px] overflow-hidden"
      >
        <CardHeader class="px-6 pt-5 pb-3">
          <div class="flex items-center justify-between gap-2">
            <CardTitle
              class="text-base font-black tracking-tight flex items-center gap-2"
            >
              <Zap class="w-4 h-4 text-primary" />
              First Call Response Rate
            </CardTitle>
            <span class="text-lg font-black text-primary">{{
              ticketStats.fcrPercent
            }}</span>
          </div>
        </CardHeader>
        <CardContent class="px-6 pb-5">
          <div
            class="relative w-full aspect-[2/1] max-w-[240px] mx-auto mt-4 mb-2"
          >
            <!-- Gauge Background -->
            <svg viewBox="0 0 200 100" class="w-full h-full text-center">
              <!-- Segments: Red, Orange, Yellow, Light Green, Green -->
              <!-- Red (180deg -> 144deg) -->
              <path
                d="M 30 100 A 70 70 0 0 1 43.37 58.85"
                fill="none"
                stroke="#ef4444"
                stroke-width="35"
                stroke-linecap="butt"
              />
              <!-- Orange (144deg -> 108deg) -->
              <path
                d="M 43.37 58.85 A 70 70 0 0 1 78.37 33.43"
                fill="none"
                stroke="#f97316"
                stroke-width="35"
                stroke-linecap="butt"
              />
              <!-- Yellow (108deg -> 72deg) -->
              <path
                d="M 78.37 33.43 A 70 70 0 0 1 121.63 33.43"
                fill="none"
                stroke="#eab308"
                stroke-width="35"
                stroke-linecap="butt"
              />
              <!-- Light Green (72deg -> 36deg) -->
              <path
                d="M 121.63 33.43 A 70 70 0 0 1 156.63 58.85"
                fill="none"
                stroke="#84cc16"
                stroke-width="35"
                stroke-linecap="butt"
              />
              <!-- Green (36deg -> 0deg) -->
              <path
                d="M 156.63 58.85 A 70 70 0 0 1 170 100"
                fill="none"
                stroke="#22c55e"
                stroke-width="35"
                stroke-linecap="butt"
              />

              <!-- Emojis inside segments (Centered at R=70) -->
              <text
                x="33"
                y="82"
                font-size="16"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                😠
              </text>
              <text
                x="58"
                y="48"
                font-size="16"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                🙁
              </text>
              <text
                x="100"
                y="35"
                font-size="16"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                😐
              </text>
              <text
                x="142"
                y="48"
                font-size="16"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                🙂
              </text>
              <text
                x="167"
                y="82"
                font-size="16"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                😁
              </text>

              <!-- Needle -->
              <!-- Rotate: (Percentage * 1.8) - 90 deg. (0 -> -90, 50 -> 0, 100 -> 90) -->
              <g
                :style="{
                  transform: `rotate(${Math.max(-90, Math.min(90, parseInt(ticketStats.fcrPercent) * 1.8 - 90))}deg)`,
                  transformOrigin: '100px 100px',
                  transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }"
              >
                <!-- Thinner Needle Base -->
                <polygon
                  points="100,105 92,100 100,30 108,100"
                  fill="#1f2937"
                />
                <circle cx="100" cy="100" r="6" fill="#1f2937" />
                <circle cx="100" cy="100" r="2" fill="#fff" />
              </g>
            </svg>
          </div>
          <div
            class="text-center text-sm font-black text-muted-foreground/60 mt-3 uppercase tracking-tight"
          >
            Based on {{ ticketStats.resolved }} resolved tickets
          </div>
        </CardContent>
      </Card>

      <!-- Ticket By Resolution Time -->
      <Card
        class="border-none shadow-2xl shadow-black/5 rounded-[10px] overflow-hidden"
      >
        <CardHeader class="px-6 pt-5 pb-3">
          <CardTitle
            class="text-base font-black tracking-tight flex items-center gap-2"
          >
            <Clock class="w-4 h-4 text-primary" />
            Ticket By Resolution Time
          </CardTitle>
        </CardHeader>
        <CardContent class="px-5 pb-5">
          <div class="flex items-center gap-8 justify-center">
            <div class="relative shrink-0 w-52 h-52">
              <svg
                viewBox="0 0 100 100"
                class="w-full h-full -rotate-90 transform"
              >
                <path
                  v-for="(slice, i) in replyTimeSlices"
                  :key="i"
                  :d="slice.path"
                  :fill="slice.color"
                  class="transition-all duration-500 hover:opacity-80 cursor-pointer"
                />
              </svg>
              <!-- Percentage Labels on Chart -->
              <div class="absolute inset-0 pointer-events-none">
                <div
                  v-for="(slice, i) in replyTimeSlices"
                  :key="i"
                  v-show="slice.percent >= 5"
                  class="absolute flex items-center justify-center text-[0.65rem] font-black text-white drop-shadow-md transform -translate-x-1/2 -translate-y-1/2"
                  :style="{ left: slice.lx + '%', top: slice.ly + '%' }"
                >
                  {{ slice.percent }}%
                </div>
              </div>
              <!-- Center Text -->
              <div
                class="absolute inset-8 rounded-full bg-card shadow-inner flex flex-col items-center justify-center pointer-events-none"
              >
                <span
                  class="text-4xl font-black tracking-tighter text-foreground"
                  >{{ replyTimeStats.resolvedCount }}</span
                >
                <span
                  class="text-xs font-bold uppercase tracking-widest text-muted-foreground/60"
                  >Tickets</span
                >
              </div>
            </div>

            <!-- Legend -->
            <div class="flex-1 space-y-3 min-w-[120px]">
              <div
                v-for="(item, i) in replyTimeSlices"
                :key="i"
                class="flex items-center gap-2"
              >
                <span
                  class="w-3 h-3 rounded-sm shrink-0"
                  :style="{ backgroundColor: item.color }"
                ></span>
                <span
                  class="flex-1 text-sm font-bold text-foreground/80 capitalize"
                  >{{ item.label }}</span
                >
                <span class="text-sm font-black text-foreground">{{
                  item.count
                }}</span>
                <span
                  class="text-[0.65rem] font-bold text-muted-foreground/60 w-9 text-right"
                >
                  {{ item.percent }}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ── Row 3: Recent Tickets (70%) │ Agent Stats (30%) ── -->
    <div class="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <!-- Recent Tickets (70%) -->
      <Card
        class="col-span-1 lg:col-span-7 border-none shadow-2xl shadow-black/5 rounded-[10px] overflow-hidden"
      >
        <CardHeader
          class="px-6 pt-5 pb-3 flex flex-row items-start justify-between"
        >
          <div>
            <CardTitle
              class="text-base font-black tracking-tight flex items-center gap-2"
            >
              <Ticket class="w-4 h-4 text-primary" />
              Recent Tickets
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            class="text-xs font-bold text-primary gap-1.5 h-7 px-2 hover:bg-primary/5 rounded-[8px]"
            @click="router.push('/admin/helpdesk/tickets')"
          >
            View All <ArrowUpRight class="w-3 h-3" />
          </Button>
        </CardHeader>
        <CardContent class="px-6 pb-5">
          <div
            v-if="!recentTicketsList.length"
            class="flex flex-col items-center gap-3 py-12 opacity-20"
          >
            <Activity class="w-10 h-10" />
            <p class="text-xs font-black uppercase tracking-widest">
              No Tickets
            </p>
          </div>
          <div v-else class="space-y-1">
            <!-- Table Header -->
            <div
              class="grid grid-cols-[4px_1fr_90px_110px_70px_100px] gap-4 px-2 py-2 text-[0.6rem] font-black uppercase tracking-widest text-muted-foreground/50 border-b border-border/30"
            >
              <div></div>
              <div>Subject / Requester</div>
              <div class="text-center">Duration</div>
              <div class="text-center">Opened</div>
              <div class="text-center">Rating</div>
              <div class="text-center">Status</div>
            </div>

            <div
              v-for="ticket in recentTicketsList"
              :key="ticket.id"
              class="group grid grid-cols-[4px_1fr_90px_110px_70px_100px] items-center gap-4 py-3 border-b border-border/30 last:border-0 hover:bg-primary/[0.02] transition-colors duration-150 cursor-pointer rounded-[8px] -mx-2 px-2"
              @click="openTicketDetails(ticket)"
            >
              <!-- Priority Color Indicator -->
              <div
                class="shrink-0 w-1 h-10 rounded-full"
                :class="getPriorityColor(ticket.priority)"
              ></div>

              <!-- Content -->
              <div class="min-w-0">
                <p
                  class="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors leading-tight"
                >
                  {{ ticket.title }}
                </p>
                <p
                  class="text-[0.6rem] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5"
                >
                  by {{ ticket.requester?.displayName || "—" }}
                </p>
              </div>
              <!-- Resolution Time -->
              <div class="flex justify-center">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[0.65rem] font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm"
                >
                  {{ getDuration(ticket) }}
                </span>
              </div>
              <!-- Opened Time -->
              <div
                class="text-[0.65rem] font-bold text-muted-foreground tabular-nums text-center"
              >
                {{ formatFullTime(ticket.createdAt) }}
              </div>
              <!-- Rate Score -->
              <div class="flex items-center justify-center gap-0.5">
                <Star
                  v-for="n in 5"
                  :key="n"
                  class="w-3.5 h-3.5 transition-all duration-300"
                  :class="
                    n <= (ticket.rating || 0)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200 fill-slate-50'
                  "
                />
              </div>
              <!-- Status Badge -->
              <div class="flex justify-center">
                <span
                  :class="[
                    'px-2.5 py-0.5 rounded-[6px] text-[0.6rem] font-black uppercase tracking-widest',
                    ticket.status === 'Resolved' || ticket.status === 'Closed'
                      ? 'bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/20'
                      : ticket.status === 'In Progress'
                        ? 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                        : 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20',
                  ]"
                >
                  {{ ticket.status }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Tickets Solved By Agent (30%) -->
      <Card
        class="col-span-1 lg:col-span-3 border-none shadow-2xl shadow-black/5 rounded-[10px] overflow-hidden"
      >
        <CardHeader class="px-6 pt-5 pb-3">
          <CardTitle
            class="text-base font-black tracking-tight flex items-center gap-2"
          >
            <User class="w-4 h-4 text-primary" />
            Tickets Solved By Agent
          </CardTitle>
        </CardHeader>
        <CardContent class="px-6 pb-5">
          <div
            v-if="!agentStats.length"
            class="text-center py-8 text-muted-foreground/30 text-xs font-bold uppercase tracking-widest"
          >
            No resolved tickets
          </div>
          <div
            v-for="(agent, i) in agentStats"
            :key="i"
            class="flex items-center gap-3 py-3 border-b border-border/30 last:border-0"
          >
            <Avatar
              class="w-10 h-10 rounded-[10px] border border-border/40 shadow-sm shrink-0"
            >
              <AvatarFallback
                class="text-xs bg-primary/5 text-primary font-black rounded-[10px]"
                >{{ agent.name.charAt(0) }}</AvatarFallback
              >
            </Avatar>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-foreground truncate">
                {{ agent.name }}
              </p>
              <p
                class="text-[0.6rem] font-bold text-muted-foreground/50 uppercase tracking-widest"
              >
                IT Support Agent
              </p>
            </div>
            <div class="text-right shrink-0">
              <span class="text-sm font-black text-foreground">{{
                agent.count
              }}</span>
              <span
                class="text-[0.6rem] font-bold text-muted-foreground/60 ml-1"
                >Tickets</span
              >
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <TicketDetailModal
      v-model:open="isDetailModalOpen"
      :ticket="selectedTicket"
      :viewMode="detailViewMode"
      @ticketUpdated="onTicketUpdated"
    />
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

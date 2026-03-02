<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">CCTV Management</h2>
        <p class="text-muted-foreground">
          Manage CCTV systems, monitoring, and maintenance records
        </p>
      </div>
      <Button @click="openCreateDialog">
        <Plus class="mr-2 h-4 w-4" />
        Add CCTV Record
      </Button>
    </div>

    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="records">Records</TabsTrigger>
        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Total CCTV Systems</CardTitle>
              <Camera class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.totalSystems }}</div>
              <p class="text-xs text-muted-foreground">
                {{ stats.activeSystems }} active systems
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Pending Checks</CardTitle>
              <AlertCircle class="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.pendingChecks }}</div>
              <p class="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Issues Found</CardTitle>
              <XCircle class="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.issuesFound }}</div>
              <p class="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Uptime</CardTitle>
              <Activity class="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.uptime }}%</div>
              <p class="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-4">
                <div class="rounded-full p-2" :class="getActivityColor(activity.type)">
                  <component :is="getActivityIcon(activity.type)" class="h-4 w-4" />
                </div>
                <div class="flex-1 space-y-1">
                  <p class="text-sm font-medium">{{ activity.title }}</p>
                  <p class="text-sm text-muted-foreground">{{ activity.description }}</p>
                  <p class="text-xs text-muted-foreground">{{ formatDate(activity.date) }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="records" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>CCTV Check Records</CardTitle>
            <CardDescription>Record and track CCTV result check reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <Input
                  v-model="searchQuery"
                  placeholder="Search records..."
                  class="max-w-sm"
                />
                <Select v-model="filterStatus">
                  <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="issue">Has Issues</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Check Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Issues</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="record in filteredRecords" :key="record.id">
                      <TableCell class="font-medium">{{ record.reportId }}</TableCell>
                      <TableCell>{{ record.location }}</TableCell>
                      <TableCell>{{ formatDate(record.checkDate) }}</TableCell>
                      <TableCell>
                        <Badge :variant="getStatusVariant(record.status)">
                          {{ record.status }}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span v-if="record.issues > 0" class="text-red-600">
                          {{ record.issues }} issue(s)
                        </span>
                        <span v-else class="text-green-600">No issues</span>
                      </TableCell>
                      <TableCell>
                        <div class="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" @click="viewRecord(record)">
                            <Eye class="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" @click="editRecord(record)">
                            <Edit class="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" @click="deleteRecord(record)">
                            <Trash class="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monitoring" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>CCTV Layout</CardTitle>
              <CardDescription>Current CCTV camera placement and coverage</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div class="text-center space-y-2">
                  <Map class="h-12 w-12 mx-auto text-muted-foreground" />
                  <p class="text-sm text-muted-foreground">Layout diagram will be displayed here</p>
                  <Button variant="outline" size="sm">
                    <Upload class="mr-2 h-4 w-4" />
                    Upload Layout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monitor Screen Status</CardTitle>
              <CardDescription>Real-time monitoring screen status</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div v-for="screen in monitorScreens" :key="screen.id" class="flex items-center justify-between p-3 border rounded-lg">
                  <div class="flex items-center space-x-3">
                    <Monitor :class="screen.online ? 'text-green-500' : 'text-red-500'" class="h-5 w-5" />
                    <div>
                      <p class="font-medium">{{ screen.name }}</p>
                      <p class="text-sm text-muted-foreground">{{ screen.location }}</p>
                    </div>
                  </div>
                  <Badge :variant="screen.online ? 'default' : 'destructive'">
                    {{ screen.online ? 'Online' : 'Offline' }}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Problem Alerts</CardTitle>
            <CardDescription>
              <AlertTriangle class="inline h-4 w-4 mr-1 text-yellow-500" />
              Data problem form (FM-MIS-08) will be informed you later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <div v-for="alert in dataAlerts" :key="alert.id" class="flex items-start space-x-3 p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <AlertTriangle class="h-5 w-5 text-yellow-600 mt-0.5" />
                <div class="flex-1">
                  <p class="font-medium">{{ alert.title }}</p>
                  <p class="text-sm text-muted-foreground">{{ alert.description }}</p>
                  <p class="text-xs text-muted-foreground mt-1">{{ formatDate(alert.date) }}</p>
                </div>
                <Button variant="outline" size="sm">
                  View Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="maintenance" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Schedule</CardTitle>
            <CardDescription>Scheduled maintenance and service records</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="maintenance in maintenanceRecords" :key="maintenance.id" class="border rounded-lg p-4">
                <div class="flex items-start justify-between">
                  <div class="space-y-1">
                    <div class="flex items-center space-x-2">
                      <h4 class="font-semibold">{{ maintenance.title }}</h4>
                      <Badge :variant="getMaintenanceStatusVariant(maintenance.status)">
                        {{ maintenance.status }}
                      </Badge>
                    </div>
                    <p class="text-sm text-muted-foreground">{{ maintenance.location }}</p>
                    <div class="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                      <div class="flex items-center">
                        <Calendar class="mr-1 h-4 w-4" />
                        {{ formatDate(maintenance.scheduledDate) }}
                      </div>
                      <div class="flex items-center">
                        <User class="mr-1 h-4 w-4" />
                        {{ maintenance.technician }}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <Dialog v-model:open="isCreateDialogOpen">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{ editingRecord ? 'Edit CCTV Record' : 'New CCTV Record' }}</DialogTitle>
          <DialogDescription>
            Record CCTV result check report (FM-MIS-07)
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Report ID</Label>
              <Input v-model="formData.reportId" placeholder="FM-MIS-07-001" />
            </div>
            <div class="space-y-2">
              <Label>Check Date</Label>
              <Input v-model="formData.checkDate" type="date" />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Location</Label>
            <Select v-model="formData.location">
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building-a">Building A</SelectItem>
                <SelectItem value="building-b">Building B</SelectItem>
                <SelectItem value="parking">Parking Area</SelectItem>
                <SelectItem value="entrance">Main Entrance</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>CCTV Layout Status</Label>
            <Select v-model="formData.layoutStatus">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="needs-adjustment">Needs Adjustment</SelectItem>
                <SelectItem value="coverage-issue">Coverage Issue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Monitor Screen Status</Label>
            <Select v-model="formData.monitorStatus">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-working">All Working</SelectItem>
                <SelectItem value="some-offline">Some Offline</SelectItem>
                <SelectItem value="display-issue">Display Issue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Issues Found</Label>
            <Textarea
              v-model="formData.issues"
              placeholder="Describe any issues found during the check..."
              rows="4"
            />
          </div>

          <div class="space-y-2">
            <Label>Remarks</Label>
            <Textarea
              v-model="formData.remarks"
              placeholder="Additional notes or recommendations..."
              rows="3"
            />
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox v-model:checked="formData.dataProblemsReported" id="data-problems" />
            <Label for="data-problems" class="text-sm font-normal">
              Data problem form (FM-MIS-08) has been filed
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isCreateDialogOpen = false">Cancel</Button>
          <Button @click="saveRecord">
            {{ editingRecord ? 'Update' : 'Create' }} Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <DocumentViewerDialog
      v-model:open="isDocumentViewerOpen"
      document-type="cctv"
      :data="selectedDocument"
    />
  </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Map,
  Monitor,
  Plus,
  Trash,
  Upload,
  User,
  XCircle,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';

const activeTab = ref('overview');
const searchQuery = ref('');
const filterStatus = ref('all');
const isCreateDialogOpen = ref(false);
const editingRecord = ref(null);
const isDocumentViewerOpen = ref(false);
const selectedDocument = ref(null);

const stats = ref({
  totalSystems: 24,
  activeSystems: 22,
  pendingChecks: 3,
  issuesFound: 5,
  uptime: 98.5,
});

const recentActivities = ref([
  {
    id: 1,
    type: 'check',
    title: 'CCTV Check Completed',
    description: 'Building A - All systems operational',
    date: new Date(),
  },
  {
    id: 2,
    type: 'issue',
    title: 'Camera Offline Detected',
    description: 'Parking Area - Camera #3 not responding',
    date: new Date(Date.now() - 86400000),
  },
  {
    id: 3,
    type: 'maintenance',
    title: 'Scheduled Maintenance',
    description: 'Main Entrance - Lens cleaning completed',
    date: new Date(Date.now() - 172800000),
  },
]);

const cctvRecords = ref([
  {
    id: 1,
    reportId: 'FM-MIS-07-001',
    location: 'Building A',
    checkDate: new Date(),
    status: 'Normal',
    issues: 0,
  },
  {
    id: 2,
    reportId: 'FM-MIS-07-002',
    location: 'Parking Area',
    checkDate: new Date(Date.now() - 86400000),
    status: 'Has Issues',
    issues: 2,
  },
  {
    id: 3,
    reportId: 'FM-MIS-07-003',
    location: 'Main Entrance',
    checkDate: new Date(Date.now() - 172800000),
    status: 'Pending',
    issues: 0,
  },
]);

const monitorScreens = ref([
  { id: 1, name: 'Monitor 1', location: 'Security Room A', online: true },
  { id: 2, name: 'Monitor 2', location: 'Security Room A', online: true },
  { id: 3, name: 'Monitor 3', location: 'Security Room B', online: false },
  { id: 4, name: 'Monitor 4', location: 'Reception', online: true },
]);

const dataAlerts = ref([
  {
    id: 1,
    title: 'Storage Capacity Warning',
    description: 'CCTV storage at 85% capacity. Data problem form will be issued.',
    date: new Date(),
  },
]);

const maintenanceRecords = ref([
  {
    id: 1,
    title: 'Quarterly System Check',
    location: 'All Buildings',
    scheduledDate: new Date(Date.now() + 604800000),
    status: 'Scheduled',
    technician: 'John Doe',
  },
  {
    id: 2,
    title: 'Camera Lens Cleaning',
    location: 'Parking Area',
    scheduledDate: new Date(Date.now() + 259200000),
    status: 'In Progress',
    technician: 'Jane Smith',
  },
]);

const formData = ref({
  reportId: '',
  checkDate: '',
  location: '',
  layoutStatus: '',
  monitorStatus: '',
  issues: '',
  remarks: '',
  dataProblemsReported: false,
});

const filteredRecords = computed(() => {
  let filtered = cctvRecords.value;

  if (searchQuery.value) {
    filtered = filtered.filter(
      (r) =>
        r.reportId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter((r) => {
      if (filterStatus.value === 'normal') return r.status === 'Normal';
      if (filterStatus.value === 'issue') return r.status === 'Has Issues';
      if (filterStatus.value === 'pending') return r.status === 'Pending';
      return true;
    });
  }

  return filtered;
});

const formatDate = (date: Date) => {
  return format(date, 'MMM dd, yyyy HH:mm');
};

const getActivityColor = (type: string) => {
  const colors: Record<string, string> = {
    check: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
    issue: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
    maintenance: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  };
  return colors[type] || colors.check;
};

const getActivityIcon = (type: string) => {
  const icons: Record<string, any> = {
    check: CheckCircle,
    issue: AlertCircle,
    maintenance: Clock,
  };
  return icons[type] || CheckCircle;
};

const getStatusVariant = (status: string) => {
  if (status === 'Normal') return 'default';
  if (status === 'Has Issues') return 'destructive';
  return 'secondary';
};

const getMaintenanceStatusVariant = (status: string) => {
  if (status === 'Scheduled') return 'secondary';
  if (status === 'In Progress') return 'default';
  if (status === 'Completed') return 'outline';
  return 'secondary';
};

const openCreateDialog = () => {
  editingRecord.value = null;
  formData.value = {
    reportId: '',
    checkDate: '',
    location: '',
    layoutStatus: '',
    monitorStatus: '',
    issues: '',
    remarks: '',
    dataProblemsReported: false,
  };
  isCreateDialogOpen.value = true;
};

const viewRecord = (record: any) => {
  selectedDocument.value = record;
  isDocumentViewerOpen.value = true;
};

const editRecord = (record: any) => {
  editingRecord.value = record;
  formData.value = { ...record };
  isCreateDialogOpen.value = true;
};

const deleteRecord = (record: any) => {
  toast.error('Delete Record', {
    description: `Are you sure you want to delete ${record.reportId}?`,
  });
};

const saveRecord = () => {
  toast.success('Success', {
    description: editingRecord.value ? 'Record updated successfully' : 'Record created successfully',
  });
  isCreateDialogOpen.value = false;
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Backup Data Management</h2>
        <p class="text-muted-foreground">
          Manage backup plans, schedules, and restoration procedures
        </p>
      </div>
      <Button @click="openCreateDialog">
        <Plus class="mr-2 h-4 w-4" />
        Add Backup Record
      </Button>
    </div>

    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="plans">Backup Plans</TabsTrigger>
        <TabsTrigger value="jobs">Backup Jobs</TabsTrigger>
        <TabsTrigger value="restoration">Restoration</TabsTrigger>
        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Total Backups</CardTitle>
              <Database class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.totalBackups }}</div>
              <p class="text-xs text-muted-foreground">
                {{ stats.successfulBackups }} successful
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Active Plans</CardTitle>
              <FileText class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.activePlans }}</div>
              <p class="text-xs text-muted-foreground">
                {{ stats.scheduledJobs }} scheduled jobs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.storageUsed }}TB</div>
              <p class="text-xs text-muted-foreground">
                of {{ stats.totalStorage }}TB total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp class="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.successRate }}%</div>
              <p class="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Backup Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div v-for="job in recentJobs" :key="job.id" class="flex items-center justify-between p-3 border rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="rounded-full p-2" :class="getJobStatusColor(job.status)">
                      <component :is="getJobStatusIcon(job.status)" class="h-4 w-4" />
                    </div>
                    <div>
                      <p class="font-medium">{{ job.name }}</p>
                      <p class="text-sm text-muted-foreground">{{ formatDate(job.date) }}</p>
                    </div>
                  </div>
                  <Badge :variant="getJobBadgeVariant(job.status)">
                    {{ job.status }}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div v-for="storage in storageDistribution" :key="storage.type" class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="font-medium">{{ storage.type }}</span>
                    <span class="text-muted-foreground">{{ storage.size }}GB ({{ storage.percentage }}%)</span>
                  </div>
                  <div class="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-primary transition-all"
                      :style="{ width: storage.percentage + '%' }"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="plans" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Backup Plans</CardTitle>
            <CardDescription>Configure and manage backup strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <Input
                  v-model="searchQuery"
                  placeholder="Search backup plans..."
                  class="max-w-sm"
                />
                <Select v-model="filterType">
                  <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full">Full Backup</SelectItem>
                    <SelectItem value="incremental">Incremental</SelectItem>
                    <SelectItem value="differential">Differential</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <Card v-for="plan in filteredPlans" :key="plan.id" class="border-2">
                  <CardHeader>
                    <div class="flex items-start justify-between">
                      <div class="space-y-1">
                        <CardTitle class="text-lg">{{ plan.name }}</CardTitle>
                        <CardDescription>{{ plan.description }}</CardDescription>
                      </div>
                      <Badge :variant="plan.active ? 'default' : 'secondary'">
                        {{ plan.active ? 'Active' : 'Inactive' }}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent class="space-y-3">
                    <div class="grid grid-cols-2 gap-2 text-sm">
                      <div class="flex items-center space-x-2">
                        <Clock class="h-4 w-4 text-muted-foreground" />
                        <span>{{ plan.frequency }}</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <Database class="h-4 w-4 text-muted-foreground" />
                        <span>{{ plan.type }}</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <Calendar class="h-4 w-4 text-muted-foreground" />
                        <span>Next: {{ formatDate(plan.nextRun) }}</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <HardDrive class="h-4 w-4 text-muted-foreground" />
                        <span>{{ plan.retention }} days</span>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2 pt-2">
                      <Button variant="outline" size="sm" class="flex-1" @click="editPlan(plan)">
                        <Edit class="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" class="flex-1" @click="runPlan(plan)">
                        <Play class="mr-2 h-4 w-4" />
                        Run Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="jobs" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Backup Job History</CardTitle>
            <CardDescription>View and manage backup job executions</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <Input
                  v-model="jobSearchQuery"
                  placeholder="Search jobs..."
                  class="max-w-sm"
                />
                <Select v-model="jobFilterStatus">
                  <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="job in filteredJobs" :key="job.id">
                      <TableCell class="font-medium">{{ job.name }}</TableCell>
                      <TableCell>{{ job.type }}</TableCell>
                      <TableCell>{{ formatDate(job.startTime) }}</TableCell>
                      <TableCell>{{ job.duration }}</TableCell>
                      <TableCell>{{ job.size }}</TableCell>
                      <TableCell>
                        <Badge :variant="getJobBadgeVariant(job.status)">
                          {{ job.status }}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div class="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" @click="viewJobDetails(job)">
                            <Eye class="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" @click="downloadJobLog(job)">
                            <Download class="h-4 w-4" />
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

      <TabsContent value="restoration" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Restoration Test Reports</CardTitle>
              <CardDescription>Regular restoration testing and validation</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div v-for="test in restorationTests" :key="test.id" class="border rounded-lg p-4">
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <h4 class="font-semibold">{{ test.name }}</h4>
                      <p class="text-sm text-muted-foreground">{{ test.description }}</p>
                    </div>
                    <Badge :variant="test.passed ? 'default' : 'destructive'">
                      {{ test.passed ? 'Passed' : 'Failed' }}
                    </Badge>
                  </div>
                  <div class="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div class="flex items-center">
                      <Calendar class="mr-1 h-4 w-4" />
                      {{ formatDate(test.date) }}
                    </div>
                    <div class="flex items-center">
                      <Clock class="mr-1 h-4 w-4" />
                      {{ test.duration }}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" class="mt-3 w-full">
                    <FileText class="mr-2 h-4 w-4" />
                    View Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Snapshot Schedule</CardTitle>
              <CardDescription>Automated snapshot management</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div v-for="snapshot in snapshots" :key="snapshot.id" class="border rounded-lg p-4">
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <h4 class="font-semibold">{{ snapshot.name }}</h4>
                      <p class="text-sm text-muted-foreground">{{ snapshot.target }}</p>
                    </div>
                    <Badge>{{ snapshot.frequency }}</Badge>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-sm mt-3">
                    <div>
                      <span class="text-muted-foreground">Last Snapshot:</span>
                      <p class="font-medium">{{ formatDate(snapshot.lastSnapshot) }}</p>
                    </div>
                    <div>
                      <span class="text-muted-foreground">Next Snapshot:</span>
                      <p class="font-medium">{{ formatDate(snapshot.nextSnapshot) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Backup Result Reports</CardTitle>
            <CardDescription>Comprehensive backup execution reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Backup Plan</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="report in backupReports" :key="report.id">
                    <TableCell class="font-medium">{{ report.reportId }}</TableCell>
                    <TableCell>{{ report.planName }}</TableCell>
                    <TableCell>{{ formatDate(report.date) }}</TableCell>
                    <TableCell>
                      <Badge :variant="report.success ? 'default' : 'destructive'">
                        {{ report.success ? 'Success' : 'Failed' }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-sm text-muted-foreground">
                      {{ report.details }}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" @click="viewReport(report)">
                        <FileText class="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="maintenance" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Agreement of Server Machine</CardTitle>
            <CardDescription>Server maintenance contracts and service agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="agreement in maintenanceAgreements" :key="agreement.id" class="border rounded-lg p-4">
                <div class="flex items-start justify-between mb-3">
                  <div class="space-y-1">
                    <h4 class="font-semibold text-lg">{{ agreement.serverName }}</h4>
                    <p class="text-sm text-muted-foreground">{{ agreement.vendor }}</p>
                  </div>
                  <Badge :variant="agreement.active ? 'default' : 'secondary'">
                    {{ agreement.active ? 'Active' : 'Expired' }}
                  </Badge>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span class="text-muted-foreground">Contract ID:</span>
                    <p class="font-medium">{{ agreement.contractId }}</p>
                  </div>
                  <div>
                    <span class="text-muted-foreground">Start Date:</span>
                    <p class="font-medium">{{ formatDate(agreement.startDate) }}</p>
                  </div>
                  <div>
                    <span class="text-muted-foreground">End Date:</span>
                    <p class="font-medium">{{ formatDate(agreement.endDate) }}</p>
                  </div>
                  <div>
                    <span class="text-muted-foreground">Service Level:</span>
                    <p class="font-medium">{{ agreement.serviceLevel }}</p>
                  </div>
                </div>

                <div class="mt-4 p-3 bg-muted rounded-lg">
                  <h5 class="font-medium mb-2">Coverage Details:</h5>
                  <ul class="text-sm space-y-1 text-muted-foreground">
                    <li v-for="(coverage, idx) in agreement.coverage" :key="idx" class="flex items-center">
                      <CheckCircle2 class="h-4 w-4 mr-2 text-green-600" />
                      {{ coverage }}
                    </li>
                  </ul>
                </div>

                <div class="flex items-center space-x-2 mt-4">
                  <Button variant="outline" size="sm" @click="viewAgreement(agreement)">
                    <FileText class="mr-2 h-4 w-4" />
                    View Contract
                  </Button>
                  <Button variant="outline" size="sm" @click="renewAgreement(agreement)">
                    <RefreshCw class="mr-2 h-4 w-4" />
                    Renew
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <Dialog v-model:open="isCreateDialogOpen">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ editingRecord ? 'Edit Backup Record' : 'New Backup Plan' }}</DialogTitle>
          <DialogDescription>
            Configure backup plan settings and schedule
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Plan Name</Label>
              <Input v-model="formData.name" placeholder="Daily Database Backup" />
            </div>
            <div class="space-y-2">
              <Label>Backup Type</Label>
              <Select v-model="formData.type">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Backup</SelectItem>
                  <SelectItem value="incremental">Incremental</SelectItem>
                  <SelectItem value="differential">Differential</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-2">
            <Label>Description</Label>
            <Textarea
              v-model="formData.description"
              placeholder="Describe the backup plan purpose and scope..."
              rows="3"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Frequency</Label>
              <Select v-model="formData.frequency">
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label>Retention Period (days)</Label>
              <Input v-model="formData.retention" type="number" placeholder="30" />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Target Location</Label>
            <Input v-model="formData.targetLocation" placeholder="/backup/database" />
          </div>

          <div class="space-y-2">
            <Label>Notification Email</Label>
            <Input v-model="formData.notificationEmail" type="email" placeholder="admin@example.com" />
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox v-model:checked="formData.active" id="active" />
            <Label for="active" class="text-sm font-normal">
              Activate this backup plan immediately
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isCreateDialogOpen = false">Cancel</Button>
          <Button @click="saveRecord">
            {{ editingRecord ? 'Update' : 'Create' }} Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <DocumentViewerDialog
      v-model:open="isDocumentViewerOpen"
      document-type="backup"
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
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  Database,
  Download,
  Edit,
  Eye,
  FileText,
  HardDrive,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  TrendingUp,
  XCircle,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';

const activeTab = ref('overview');
const searchQuery = ref('');
const filterType = ref('all');
const jobSearchQuery = ref('');
const jobFilterStatus = ref('all');
const isCreateDialogOpen = ref(false);
const editingRecord = ref(null);
const isDocumentViewerOpen = ref(false);
const selectedDocument = ref(null);

const stats = ref({
  totalBackups: 1247,
  successfulBackups: 1198,
  activePlans: 8,
  scheduledJobs: 24,
  storageUsed: 4.2,
  totalStorage: 10,
  successRate: 96.1,
});

const recentJobs = ref([
  {
    id: 1,
    name: 'Daily Database Backup',
    date: new Date(),
    status: 'Success',
  },
  {
    id: 2,
    name: 'File Server Backup',
    date: new Date(Date.now() - 3600000),
    status: 'Success',
  },
  {
    id: 3,
    name: 'Email Server Backup',
    date: new Date(Date.now() - 7200000),
    status: 'Running',
  },
]);

const storageDistribution = ref([
  { type: 'Database Backups', size: 1500, percentage: 35 },
  { type: 'File Server', size: 1200, percentage: 28 },
  { type: 'Email Archives', size: 900, percentage: 21 },
  { type: 'System Images', size: 600, percentage: 16 },
]);

const backupPlans = ref([
  {
    id: 1,
    name: 'Daily Database Backup',
    description: 'Full database backup every night',
    type: 'Full Backup',
    frequency: 'Daily',
    nextRun: new Date(Date.now() + 86400000),
    retention: 30,
    active: true,
  },
  {
    id: 2,
    name: 'Hourly Incremental',
    description: 'Incremental backup every hour',
    type: 'Incremental',
    frequency: 'Hourly',
    nextRun: new Date(Date.now() + 3600000),
    retention: 7,
    active: true,
  },
]);

const backupJobs = ref([
  {
    id: 1,
    name: 'Daily Database Backup',
    type: 'Full',
    startTime: new Date(),
    duration: '45 min',
    size: '2.3 GB',
    status: 'Success',
  },
  {
    id: 2,
    name: 'File Server Backup',
    type: 'Incremental',
    startTime: new Date(Date.now() - 3600000),
    duration: '12 min',
    size: '450 MB',
    status: 'Success',
  },
]);

const restorationTests = ref([
  {
    id: 1,
    name: 'Q1 2026 Restoration Test',
    description: 'Quarterly database restoration validation',
    date: new Date(Date.now() - 604800000),
    duration: '2h 15min',
    passed: true,
  },
]);

const snapshots = ref([
  {
    id: 1,
    name: 'Production Server Snapshot',
    target: 'Server-PROD-01',
    frequency: 'Daily',
    lastSnapshot: new Date(Date.now() - 86400000),
    nextSnapshot: new Date(Date.now() + 3600000),
  },
]);

const backupReports = ref([
  {
    id: 1,
    reportId: 'BR-2026-001',
    planName: 'Daily Database Backup',
    date: new Date(),
    success: true,
    details: 'All data backed up successfully',
  },
]);

const maintenanceAgreements = ref([
  {
    id: 1,
    serverName: 'Production Database Server',
    vendor: 'Dell Technologies',
    contractId: 'SVC-2026-001',
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 11, 31),
    serviceLevel: '24/7 Premium Support',
    active: true,
    coverage: [
      'Hardware replacement within 4 hours',
      'Software support and updates',
      'Preventive maintenance quarterly',
      'Emergency on-site support',
    ],
  },
]);

const formData = ref({
  name: '',
  type: '',
  description: '',
  frequency: '',
  retention: '',
  targetLocation: '',
  notificationEmail: '',
  active: true,
});

const filteredPlans = computed(() => {
  let filtered = backupPlans.value;

  if (searchQuery.value) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (filterType.value !== 'all') {
    filtered = filtered.filter((p) => p.type.toLowerCase().includes(filterType.value.toLowerCase()));
  }

  return filtered;
});

const filteredJobs = computed(() => {
  let filtered = backupJobs.value;

  if (jobSearchQuery.value) {
    filtered = filtered.filter((j) =>
      j.name.toLowerCase().includes(jobSearchQuery.value.toLowerCase())
    );
  }

  if (jobFilterStatus.value !== 'all') {
    filtered = filtered.filter((j) => j.status.toLowerCase() === jobFilterStatus.value.toLowerCase());
  }

  return filtered;
});

const formatDate = (date: Date) => {
  return format(date, 'MMM dd, yyyy HH:mm');
};

const getJobStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Success: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
    Failed: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
    Running: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  };
  return colors[status] || colors.Success;
};

const getJobStatusIcon = (status: string) => {
  const icons: Record<string, any> = {
    Success: CheckCircle,
    Failed: XCircle,
    Running: Loader2,
  };
  return icons[status] || CheckCircle;
};

const getJobBadgeVariant = (status: string) => {
  if (status === 'Success') return 'default';
  if (status === 'Failed') return 'destructive';
  return 'secondary';
};

const openCreateDialog = () => {
  editingRecord.value = null;
  formData.value = {
    name: '',
    type: '',
    description: '',
    frequency: '',
    retention: '',
    targetLocation: '',
    notificationEmail: '',
    active: true,
  };
  isCreateDialogOpen.value = true;
};

const editPlan = (plan: any) => {
  editingRecord.value = plan;
  formData.value = { ...plan };
  isCreateDialogOpen.value = true;
};

const runPlan = (plan: any) => {
  toast.info('Running Backup', {
    description: `Starting backup job for ${plan.name}`,
  });
};

const viewJobDetails = (job: any) => {
  toast.info('Job Details', {
    description: `Viewing details for ${job.name}`,
  });
};

const downloadJobLog = (job: any) => {
  toast.success('Download Started', {
    description: `Downloading log for ${job.name}`,
  });
};

const viewReport = (report: any) => {
  selectedDocument.value = report;
  isDocumentViewerOpen.value = true;
};

const viewAgreement = (agreement: any) => {
  toast.info('View Contract', {
    description: `Opening contract ${agreement.contractId}`,
  });
};

const renewAgreement = (agreement: any) => {
  toast.info('Renew Contract', {
    description: `Initiating renewal for ${agreement.serverName}`,
  });
};

const saveRecord = () => {
  toast.success('Success', {
    description: editingRecord.value ? 'Plan updated successfully' : 'Plan created successfully',
  });
  isCreateDialogOpen.value = false;
};
</script>

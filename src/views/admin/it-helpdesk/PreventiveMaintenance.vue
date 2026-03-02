<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Preventive Maintenance Process</h2>
        <p class="text-muted-foreground">
          Manage preventive maintenance plans, schedules, and execution records
        </p>
      </div>
      <Button @click="openCreateDialog">
        <Plus class="mr-2 h-4 w-4" />
        Add Maintenance Record
      </Button>
    </div>

    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="plans">Maintenance Plans</TabsTrigger>
        <TabsTrigger value="activities">Activities</TabsTrigger>
        <TabsTrigger value="ups">UPS Maintenance</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Active Plans</CardTitle>
              <ClipboardList class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.activePlans }}</div>
              <p class="text-xs text-muted-foreground">
                {{ stats.totalPlans }} total plans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">This Month</CardTitle>
              <Calendar class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.thisMonth }}</div>
              <p class="text-xs text-muted-foreground">
                {{ stats.completed }} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock class="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.pending }}</div>
              <p class="text-xs text-muted-foreground">
                {{ stats.overdue }} overdue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp class="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.completionRate }}%</div>
              <p class="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance</CardTitle>
              <CardDescription>Scheduled maintenance activities for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div v-for="activity in upcomingActivities" :key="activity.id" class="flex items-start space-x-3 p-3 border rounded-lg">
                  <div class="rounded-full p-2" :class="getPriorityColor(activity.priority)">
                    <Wrench class="h-4 w-4" />
                  </div>
                  <div class="flex-1 space-y-1">
                    <div class="flex items-center justify-between">
                      <p class="font-medium">{{ activity.title }}</p>
                      <Badge :variant="getPriorityVariant(activity.priority)">
                        {{ activity.priority }}
                      </Badge>
                    </div>
                    <p class="text-sm text-muted-foreground">{{ activity.equipment }}</p>
                    <div class="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div class="flex items-center">
                        <Calendar class="mr-1 h-3 w-3" />
                        {{ formatDate(activity.scheduledDate) }}
                      </div>
                      <div class="flex items-center">
                        <User class="mr-1 h-3 w-3" />
                        {{ activity.assignee }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest preventive maintenance executions</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3 p-3 border rounded-lg">
                  <div class="rounded-full p-2" :class="getStatusColor(activity.status)">
                    <component :is="getStatusIcon(activity.status)" class="h-4 w-4" />
                  </div>
                  <div class="flex-1 space-y-1">
                    <div class="flex items-center justify-between">
                      <p class="font-medium">{{ activity.title }}</p>
                      <Badge :variant="getStatusVariant(activity.status)">
                        {{ activity.status }}
                      </Badge>
                    </div>
                    <p class="text-sm text-muted-foreground">{{ activity.equipment }}</p>
                    <p class="text-xs text-muted-foreground">{{ formatDate(activity.completedDate) }}</p>
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
            <CardTitle>Preventive Maintenance Plans (FM-MIS-03)</CardTitle>
            <CardDescription>Annual preventive maintenance planning with actual activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <Input
                  v-model="searchQuery"
                  placeholder="Search plans..."
                  class="max-w-sm"
                />
                <Select v-model="filterStatus">
                  <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan ID</TableHead>
                      <TableHead>Equipment/System</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Last Maintenance</TableHead>
                      <TableHead>Next Scheduled</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="plan in filteredPlans" :key="plan.id">
                      <TableCell class="font-medium">{{ plan.planId }}</TableCell>
                      <TableCell>{{ plan.equipment }}</TableCell>
                      <TableCell>{{ plan.frequency }}</TableCell>
                      <TableCell>{{ plan.lastMaintenance ? formatDate(plan.lastMaintenance) : 'N/A' }}</TableCell>
                      <TableCell>{{ formatDate(plan.nextScheduled) }}</TableCell>
                      <TableCell>
                        <Badge :variant="getStatusVariant(plan.status)">
                          {{ plan.status }}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div class="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" @click="viewPlan(plan)">
                            <Eye class="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" @click="editPlan(plan)">
                            <Edit class="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" @click="executePlan(plan)">
                            <Play class="h-4 w-4" />
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

      <TabsContent value="activities" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Actual Preventive Maintenance Activities (FM-MIS-02)</CardTitle>
            <CardDescription>
              <AlertTriangle class="inline h-4 w-4 mr-1 text-blue-500" />
              Actual Preventive Maintenance form (FM-MIS-02) will be informed you later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <Input
                  v-model="activitySearchQuery"
                  placeholder="Search activities..."
                  class="max-w-sm"
                />
                <Select v-model="activityFilterStatus">
                  <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity ID</TableHead>
                      <TableHead>Plan Reference</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="activity in filteredActivities" :key="activity.id">
                      <TableCell class="font-medium">{{ activity.activityId }}</TableCell>
                      <TableCell>{{ activity.planId }}</TableCell>
                      <TableCell>{{ activity.equipment }}</TableCell>
                      <TableCell>{{ formatDate(activity.scheduledDate) }}</TableCell>
                      <TableCell>{{ activity.completedDate ? formatDate(activity.completedDate) : '-' }}</TableCell>
                      <TableCell>{{ activity.technician }}</TableCell>
                      <TableCell>
                        <Badge :variant="getStatusVariant(activity.status)">
                          {{ activity.status }}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div class="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" @click="viewActivity(activity)">
                            <Eye class="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" @click="editActivity(activity)">
                            <Edit class="h-4 w-4" />
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

      <TabsContent value="ups" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Preventive Maintenance UPS (FM-MIS-26)</CardTitle>
            <CardDescription>
              <AlertTriangle class="inline h-4 w-4 mr-1 text-blue-500" />
              Actual Preventive Maintenance UPS form (FM-MIS-26) will be informed you later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader class="pb-3">
                    <CardTitle class="text-sm font-medium">Total UPS Units</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold">{{ upsStats.totalUnits }}</div>
                    <p class="text-xs text-muted-foreground">{{ upsStats.activeUnits }} active</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader class="pb-3">
                    <CardTitle class="text-sm font-medium">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold">{{ upsStats.thisMonth }}</div>
                    <p class="text-xs text-muted-foreground">Maintenance completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader class="pb-3">
                    <CardTitle class="text-sm font-medium">Upcoming</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold">{{ upsStats.upcoming }}</div>
                    <p class="text-xs text-muted-foreground">Next 30 days</p>
                  </CardContent>
                </Card>
              </div>

              <div class="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>UPS ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Last Maintenance</TableHead>
                      <TableHead>Next Scheduled</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="ups in upsRecords" :key="ups.id">
                      <TableCell class="font-medium">{{ ups.upsId }}</TableCell>
                      <TableCell>{{ ups.location }}</TableCell>
                      <TableCell>{{ ups.model }}</TableCell>
                      <TableCell>{{ ups.capacity }}</TableCell>
                      <TableCell>{{ ups.lastMaintenance ? formatDate(ups.lastMaintenance) : 'N/A' }}</TableCell>
                      <TableCell>{{ formatDate(ups.nextScheduled) }}</TableCell>
                      <TableCell>
                        <Badge :variant="ups.status === 'Good' ? 'default' : 'destructive'">
                          {{ ups.status }}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div class="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" @click="viewUPS(ups)">
                            <Eye class="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" @click="performUPSMaintenance(ups)">
                            <Wrench class="h-4 w-4" />
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

      <TabsContent value="reports" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
              <CardDescription>Preventive maintenance execution summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div v-for="month in monthlySummary" :key="month.month" class="border rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold">{{ month.month }}</h4>
                    <Badge>{{ month.completionRate }}% Complete</Badge>
                  </div>
                  <div class="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span class="text-muted-foreground">Planned:</span>
                      <p class="font-medium">{{ month.planned }}</p>
                    </div>
                    <div>
                      <span class="text-muted-foreground">Completed:</span>
                      <p class="font-medium text-green-600">{{ month.completed }}</p>
                    </div>
                    <div>
                      <span class="text-muted-foreground">Pending:</span>
                      <p class="font-medium text-yellow-600">{{ month.pending }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment Categories</CardTitle>
              <CardDescription>Maintenance distribution by equipment type</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div v-for="category in equipmentCategories" :key="category.name" class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="font-medium">{{ category.name }}</span>
                    <span class="text-muted-foreground">{{ category.count }} items</span>
                  </div>
                  <div class="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-primary transition-all"
                      :style="{ width: category.percentage + '%' }"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
            <CardDescription>Generate and download maintenance reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4 md:grid-cols-3">
              <Button variant="outline" class="justify-start">
                <FileText class="mr-2 h-4 w-4" />
                FM-MIS-03 Report
              </Button>
              <Button variant="outline" class="justify-start">
                <FileText class="mr-2 h-4 w-4" />
                FM-MIS-02 Report
              </Button>
              <Button variant="outline" class="justify-start">
                <FileText class="mr-2 h-4 w-4" />
                FM-MIS-26 Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <Dialog v-model:open="isCreateDialogOpen">
      <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ editingRecord ? 'Edit Maintenance Plan' : 'New Maintenance Plan' }}</DialogTitle>
          <DialogDescription>
            Create preventive maintenance plan (FM-MIS-03)
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Plan ID</Label>
              <Input v-model="formData.planId" placeholder="FM-MIS-03-001" />
            </div>
            <div class="space-y-2">
              <Label>Equipment/System</Label>
              <Input v-model="formData.equipment" placeholder="Server Room AC Unit" />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Description</Label>
            <Textarea
              v-model="formData.description"
              placeholder="Detailed description of the maintenance plan..."
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
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label>Priority</Label>
              <Select v-model="formData.priority">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Next Scheduled Date</Label>
              <Input v-model="formData.nextScheduled" type="date" />
            </div>
            <div class="space-y-2">
              <Label>Assigned Technician</Label>
              <Input v-model="formData.assignee" placeholder="John Doe" />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Maintenance Tasks</Label>
            <Textarea
              v-model="formData.tasks"
              placeholder="List of tasks to be performed during maintenance..."
              rows="4"
            />
          </div>

          <div class="space-y-2">
            <Label>Required Tools/Parts</Label>
            <Textarea
              v-model="formData.requiredItems"
              placeholder="Tools, parts, or materials needed..."
              rows="3"
            />
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox v-model:checked="formData.active" id="active" />
            <Label for="active" class="text-sm font-normal">
              Activate this maintenance plan
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
      document-type="preventive-maintenance"
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
  AlertTriangle,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  Edit,
  Eye,
  FileText,
  Loader2,
  Play,
  Plus,
  TrendingUp,
  User,
  Wrench
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';

const activeTab = ref('overview');
const searchQuery = ref('');
const filterStatus = ref('all');
const activitySearchQuery = ref('');
const activityFilterStatus = ref('all');
const isCreateDialogOpen = ref(false);
const editingRecord = ref(null);
const isDocumentViewerOpen = ref(false);
const selectedDocument = ref(null);

const stats = ref({
  activePlans: 24,
  totalPlans: 32,
  thisMonth: 18,
  completed: 15,
  pending: 8,
  overdue: 2,
  completionRate: 93.8,
});

const upsStats = ref({
  totalUnits: 12,
  activeUnits: 11,
  thisMonth: 8,
  upcoming: 4,
});

const upcomingActivities = ref([
  {
    id: 1,
    title: 'Server Room AC Maintenance',
    equipment: 'AC Unit #1',
    scheduledDate: new Date(Date.now() + 86400000),
    assignee: 'John Doe',
    priority: 'High',
  },
  {
    id: 2,
    title: 'UPS Battery Check',
    equipment: 'UPS-DC-01',
    scheduledDate: new Date(Date.now() + 172800000),
    assignee: 'Jane Smith',
    priority: 'Critical',
  },
  {
    id: 3,
    title: 'Network Switch Cleaning',
    equipment: 'Switch-FL2-01',
    scheduledDate: new Date(Date.now() + 259200000),
    assignee: 'Mike Johnson',
    priority: 'Medium',
  },
]);

const recentActivities = ref([
  {
    id: 1,
    title: 'Fire Suppression System Check',
    equipment: 'Fire System',
    completedDate: new Date(Date.now() - 86400000),
    status: 'Completed',
  },
  {
    id: 2,
    title: 'Generator Load Test',
    equipment: 'Generator #1',
    completedDate: new Date(Date.now() - 172800000),
    status: 'Completed',
  },
]);

const maintenancePlans = ref([
  {
    id: 1,
    planId: 'FM-MIS-03-001',
    equipment: 'Server Room AC Unit',
    frequency: 'Monthly',
    lastMaintenance: new Date(Date.now() - 2592000000),
    nextScheduled: new Date(Date.now() + 86400000),
    status: 'Active',
  },
  {
    id: 2,
    planId: 'FM-MIS-03-002',
    equipment: 'UPS System',
    frequency: 'Quarterly',
    lastMaintenance: new Date(Date.now() - 7776000000),
    nextScheduled: new Date(Date.now() + 172800000),
    status: 'Active',
  },
]);

const maintenanceActivities = ref([
  {
    id: 1,
    activityId: 'FM-MIS-02-001',
    planId: 'FM-MIS-03-001',
    equipment: 'Server Room AC Unit',
    scheduledDate: new Date(Date.now() - 86400000),
    completedDate: new Date(Date.now() - 3600000),
    technician: 'John Doe',
    status: 'Completed',
  },
]);

const upsRecords = ref([
  {
    id: 1,
    upsId: 'UPS-DC-01',
    location: 'Data Center',
    model: 'APC Smart-UPS 3000',
    capacity: '3000 VA',
    lastMaintenance: new Date(Date.now() - 2592000000),
    nextScheduled: new Date(Date.now() + 172800000),
    status: 'Good',
  },
  {
    id: 2,
    upsId: 'UPS-SR-01',
    location: 'Server Room',
    model: 'Eaton 9PX 5000',
    capacity: '5000 VA',
    lastMaintenance: new Date(Date.now() - 1296000000),
    nextScheduled: new Date(Date.now() + 604800000),
    status: 'Good',
  },
]);

const monthlySummary = ref([
  {
    month: 'March 2026',
    planned: 25,
    completed: 18,
    pending: 7,
    completionRate: 72,
  },
  {
    month: 'February 2026',
    planned: 28,
    completed: 26,
    pending: 2,
    completionRate: 93,
  },
]);

const equipmentCategories = ref([
  { name: 'HVAC Systems', count: 8, percentage: 35 },
  { name: 'UPS & Power', count: 12, percentage: 52 },
  { name: 'Network Equipment', count: 15, percentage: 65 },
  { name: 'Fire & Safety', count: 6, percentage: 26 },
]);

const formData = ref({
  planId: '',
  equipment: '',
  description: '',
  frequency: '',
  priority: '',
  nextScheduled: '',
  assignee: '',
  tasks: '',
  requiredItems: '',
  active: true,
});

const filteredPlans = computed(() => {
  let filtered = maintenancePlans.value;

  if (searchQuery.value) {
    filtered = filtered.filter(
      (p) =>
        p.planId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        p.equipment.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter((p) => p.status.toLowerCase() === filterStatus.value.toLowerCase());
  }

  return filtered;
});

const filteredActivities = computed(() => {
  let filtered = maintenanceActivities.value;

  if (activitySearchQuery.value) {
    filtered = filtered.filter(
      (a) =>
        a.activityId.toLowerCase().includes(activitySearchQuery.value.toLowerCase()) ||
        a.equipment.toLowerCase().includes(activitySearchQuery.value.toLowerCase())
    );
  }

  if (activityFilterStatus.value !== 'all') {
    filtered = filtered.filter((a) => a.status.toLowerCase() === activityFilterStatus.value.toLowerCase());
  }

  return filtered;
});

const formatDate = (date: Date) => {
  return format(date, 'MMM dd, yyyy');
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    Low: 'bg-gray-100 text-gray-600 dark:bg-gray-950 dark:text-gray-400',
    Medium: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    High: 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
    Critical: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
  };
  return colors[priority] || colors.Medium;
};

const getPriorityVariant = (priority: string) => {
  if (priority === 'Critical' || priority === 'High') return 'destructive';
  if (priority === 'Medium') return 'default';
  return 'secondary';
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Completed: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
    'In Progress': 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    Scheduled: 'bg-gray-100 text-gray-600 dark:bg-gray-950 dark:text-gray-400',
  };
  return colors[status] || colors.Scheduled;
};

const getStatusIcon = (status: string) => {
  const icons: Record<string, any> = {
    Completed: CheckCircle,
    'In Progress': Loader2,
    Scheduled: Clock,
  };
  return icons[status] || Clock;
};

const getStatusVariant = (status: string) => {
  if (status === 'Completed' || status === 'Active') return 'default';
  if (status === 'In Progress' || status === 'Pending') return 'secondary';
  return 'outline';
};

const openCreateDialog = () => {
  editingRecord.value = null;
  formData.value = {
    planId: '',
    equipment: '',
    description: '',
    frequency: '',
    priority: '',
    nextScheduled: '',
    assignee: '',
    tasks: '',
    requiredItems: '',
    active: true,
  };
  isCreateDialogOpen.value = true;
};

const viewPlan = (plan: any) => {
  selectedDocument.value = plan;
  isDocumentViewerOpen.value = true;
};

const editPlan = (plan: any) => {
  editingRecord.value = plan;
  formData.value = { ...plan };
  isCreateDialogOpen.value = true;
};

const executePlan = (plan: any) => {
  toast.info('Execute Plan', {
    description: `Starting maintenance for ${plan.equipment}`,
  });
};

const viewActivity = (activity: any) => {
  toast.info('View Activity', {
    description: `Viewing details for ${activity.activityId}`,
  });
};

const editActivity = (activity: any) => {
  toast.info('Edit Activity', {
    description: `Editing ${activity.activityId}`,
  });
};

const viewUPS = (ups: any) => {
  toast.info('View UPS', {
    description: `Viewing details for ${ups.upsId}`,
  });
};

const performUPSMaintenance = (ups: any) => {
  toast.info('UPS Maintenance', {
    description: `Starting maintenance for ${ups.upsId}`,
  });
};

const saveRecord = () => {
  toast.success('Success', {
    description: editingRecord.value ? 'Plan updated successfully' : 'Plan created successfully',
  });
  isCreateDialogOpen.value = false;
};
</script>

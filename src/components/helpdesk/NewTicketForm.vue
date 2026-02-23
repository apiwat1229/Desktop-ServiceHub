<script setup lang="ts">
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import { Textarea } from '@/components/ui/textarea';
import { itTicketsApi } from '@/services/it-tickets';
import {
    CheckCircle2, CloudUpload, FileText,
    FolderTree, MapPin, SearchCheck, Send, Timer, Trash2
} from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

const props = defineProps<{
  onSuccess?: () => void;
  onCancel?: () => void;
}>();

const { t, tm, rt } = useI18n();
const emit = defineEmits(['success', 'cancel']);

const loading = ref(false);
const attachmentInput = ref<HTMLInputElement | null>(null);
const attachmentPreview = ref<string | null>(null);

const form = ref({
  subject: '',
  category: '',
  subcategory: '',
  issueType: '',
  priority: 'medium',
  location: '',
  description: '',
  attachment: null as File | null,
  createdAt: null as string | null, // Combined Date + Time
});

// Created Date/Time Local State
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');

const createdDate = ref<string | null>(`${year}-${month}-${day}`);
const createdTime = ref<string>(`${hours}:${minutes}`);

// Watchers to Combine Date + Time into form.createdAt
watch(
  [createdDate, createdTime],
  ([newDate, newTime]) => {
    if (!newDate) {
      form.value.createdAt = null;
      return;
    }
    const combined = new Date(`${newDate}T${newTime || '00:00'}:00`);
    if (!isNaN(combined.getTime())) {
      form.value.createdAt = combined.toISOString();
    } else {
      form.value.createdAt = null;
    }
  },
  { immediate: true }
);

// Cascading Logic Helpers
const categories = computed(() => {
  const cats = tm('services.itHelp.tickets.categories') as Record<string, any>;
  return Object.keys(cats).map((key) => ({
    id: key,
    label: rt(cats[key].label),
  }));
});

const subcategories = computed(() => {
  if (!form.value.category || form.value.category === 'other') return [];
  const subs = tm(`services.itHelp.tickets.categories.${form.value.category}.subs`) as Record<
    string,
    any
  >;
  
  if (!subs || typeof subs === 'string') return [];

  return Object.keys(subs).map((key) => {
    const sub = subs[key];
    return {
      id: key,
      label: typeof sub === 'string' ? rt(sub) : rt(sub.label),
      hasIssues: typeof sub !== 'string' && !!sub.issues,
    };
  });
});

const issueTypes = computed(() => {
  if (!form.value.category || !form.value.subcategory || form.value.category === 'other') return [];
  const sub = tm(
    `services.itHelp.tickets.categories.${form.value.category}.subs.${form.value.subcategory}`
  ) as any;
  if (!sub || typeof sub === 'string' || !sub.issues) return [];

  const issues = sub.issues as Record<string, any>;
  return Object.keys(issues).map((key) => ({
    id: key,
    label: rt(issues[key]),
  }));
});

// Watchers to reset dependable fields
watch(
  () => form.value.category,
  () => {
    form.value.subcategory = '';
    form.value.issueType = '';
  }
);

watch(
  () => form.value.subcategory,
  () => {
    form.value.issueType = '';
  }
);

const handleFileClick = () => {
  attachmentInput.value?.click();
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    handleFile(e.dataTransfer.files[0]);
  }
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    handleFile(target.files[0]);
  }
};

const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
    }
    form.value.attachment = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      attachmentPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
};

const removeAttachment = () => {
  form.value.attachment = null;
  attachmentPreview.value = null;
  if (attachmentInput.value) attachmentInput.value.value = '';
};

const handleSubmit = async () => {
  if (!form.value.subject || !form.value.category || !form.value.subcategory) {
      toast.error('Please fill in all required fields');
      return;
  }

  loading.value = true;
  try {
    const isOther = form.value.category === 'other';
    const categoryString = isOther 
      ? `Other > ${form.value.subcategory}` 
      : `${form.value.category} > ${form.value.subcategory}${form.value.issueType ? ' > ' + form.value.issueType : ''}`;

    const payload = {
      title: form.value.subject,
      category: categoryString,
      description: form.value.description,
      priority: form.value.priority.charAt(0).toUpperCase() + form.value.priority.slice(1),
      ...(form.value.createdAt ? { createdAt: new Date(form.value.createdAt).toISOString() } : {}),
      location: form.value.location,
    };

    await itTicketsApi.create(payload);
    emit('success');
    if (props.onSuccess) props.onSuccess();
  } catch (error) {
    console.error('Failed to submit ticket:', error);
    toast.error('Failed to submit ticket');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    
    <!-- Section 1: Overview -->
    <div class="bg-slate-50/50 dark:bg-slate-900/50 rounded-[12px] p-4 sm:p-5 border border-border/40">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1.5 h-1.5 rounded-full bg-primary shadow-sm"></div>
        <h3 class="text-xs font-black uppercase tracking-widest text-primary">Overview</h3>
      </div>
      <div class="space-y-2">
        <Label for="subject" class="text-xs font-bold text-slate-700 dark:text-slate-300">
          {{ t('services.itHelp.tickets.subject') }} <span class="text-red-500">*</span>
        </Label>
        <div class="relative">
          <Input
            id="subject"
            v-model="form.subject"
            :placeholder="t('services.itHelp.tickets.subjectPlaceholder')"
            class="pl-10 h-11 bg-white dark:bg-card border-border/50 focus:border-primary shadow-sm rounded-[10px]"
            required
          />
          <FileText class="w-4 h-4 text-muted-foreground absolute left-4 top-3.5 pointer-events-none" />
        </div>
      </div>
    </div>

    <!-- Section 2: Classification -->
    <div class="bg-slate-50/50 dark:bg-slate-900/50 rounded-[12px] p-4 sm:p-5 border border-border/40 space-y-4">
      <div class="flex items-center gap-2 mb-1">
        <div class="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm"></div>
        <h3 class="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Classification</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Main Category -->
        <div class="space-y-2">
          <Label for="category" class="text-xs font-bold text-slate-700 dark:text-slate-300">
            {{ t('services.itHelp.tickets.category') }} <span class="text-red-500">*</span>
          </Label>
          <Select v-model="form.category" required>
            <SelectTrigger id="category" class="h-11 bg-white dark:bg-card border-border/50 rounded-[10px]">
              <div class="flex items-center gap-2">
                <FolderTree class="w-4 h-4 text-muted-foreground" />
                <SelectValue :placeholder="t('services.itHelp.tickets.category')" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Sub-Category -->
        <div class="space-y-2">
          <Label for="subcategory" class="text-xs font-bold text-slate-700 dark:text-slate-300">
            {{ form.category === 'other' ? t('services.itHelp.tickets.subject') : t('services.itHelp.tickets.subcategory') }} <span class="text-red-500">*</span>
          </Label>
          
          <template v-if="form.category === 'other'">
            <Input
              id="subcategory"
              v-model="form.subcategory"
              :placeholder="t('services.itHelp.tickets.descriptionPlaceholder')"
              class="h-11 bg-white dark:bg-card border-border/50 focus:border-primary shadow-sm rounded-[10px]"
              required
            />
          </template>
          <template v-else>
            <Select v-model="form.subcategory" :disabled="!form.category" required>
              <SelectTrigger id="subcategory" class="h-11 bg-white dark:bg-card border-border/50 rounded-[10px]">
                <SelectValue :placeholder="t('services.itHelp.tickets.subcategory')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="sub in subcategories" :key="sub.id" :value="sub.id">
                  {{ sub.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </template>
        </div>
      </div>

      <!-- Issue Type (Conditional) -->
      <div v-if="issueTypes.length > 0 && form.category !== 'other'" class="space-y-2 animation-in fade-in slide-in-from-top-2 duration-300">
        <Label for="issueType" class="text-xs font-bold text-slate-700 dark:text-slate-300">
          {{ t('services.itHelp.tickets.issueType') }} <span class="text-red-500">*</span>
        </Label>
        <Select v-model="form.issueType" required>
          <SelectTrigger id="issueType" class="h-11 bg-white dark:bg-card border-border/50 rounded-[10px]">
            <div class="flex items-center gap-2">
                <SearchCheck class="w-4 h-4 text-muted-foreground" />
                <SelectValue :placeholder="t('services.itHelp.tickets.issueType')" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="issue in issueTypes" :key="issue.id" :value="issue.id">
              {{ issue.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Section 3: Details & Timing -->
    <div class="bg-slate-50/50 dark:bg-slate-900/50 rounded-[12px] p-4 sm:p-5 border border-border/40 space-y-4">
        <div class="flex items-center gap-2 mb-1">
            <div class="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm"></div>
            <h3 class="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Context & Urgency</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
                <Label for="priority" class="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {{ t('services.itHelp.tickets.priority') }}
                </Label>
                <Select v-model="form.priority">
                    <SelectTrigger id="priority" class="h-11 bg-white dark:bg-card border-border/50 rounded-[10px]">
                        <SelectValue :placeholder="t('services.itHelp.tickets.priority')" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                            <span class="text-emerald-700 font-medium">{{ t('services.itHelp.tickets.priorities.low') }}</span>
                        </div>
                        </SelectItem>
                        <SelectItem value="medium">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-amber-500 shadow-sm" />
                            <span class="text-amber-700 font-medium">{{ t('services.itHelp.tickets.priorities.medium') }}</span>
                        </div>
                        </SelectItem>
                        <SelectItem value="high">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-orange-600 shadow-sm" />
                            <span class="text-orange-700 font-medium">{{ t('services.itHelp.tickets.priorities.high') }}</span>
                        </div>
                        </SelectItem>
                        <SelectItem value="critical">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-red-600 shadow-sm animate-pulse" />
                            <span class="text-red-700 font-bold">{{ t('services.itHelp.tickets.priorities.critical') }}</span>
                        </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div class="space-y-2">
                <Label for="location" class="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {{ t('services.itHelp.tickets.location') }} <span class="text-red-500">*</span>
                </Label>
                <div class="relative">
                    <Input
                        id="location"
                        v-model="form.location"
                        :placeholder="t('services.itHelp.tickets.locationPlaceholder')"
                        class="pl-10 h-11 bg-white dark:bg-card border-border/50 rounded-[10px]"
                        required
                    />
                    <MapPin class="w-4 h-4 text-muted-foreground absolute left-4 top-3.5 pointer-events-none" />
                </div>
            </div>
        </div>

        <div class="space-y-2 pt-1 border-t border-border/30">
            <Label class="text-xs font-bold text-slate-700 dark:text-slate-300">Retroactive Dating (Optional)</Label>
            <div class="flex items-center gap-2">
                <div class="flex-1">
                    <DatePicker v-model="createdDate" class="w-full bg-white dark:bg-card border-border/50 h-11 rounded-[10px]" />
                </div>
                <div class="w-[140px] relative">
                    <Input type="time" v-model="createdTime" class="pl-10 h-11 bg-white dark:bg-card border-border/50 rounded-[10px]" :disabled="!createdDate" />
                    <Timer class="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
            </div>
            <p class="text-[0.65rem] font-medium text-muted-foreground">Leave empty to use current exact time. Useful if the issue started earlier.</p>
        </div>
    </div>

    <!-- Section 4: Description & Evidence -->
    <div class="bg-slate-50/50 dark:bg-slate-900/50 rounded-[12px] p-4 sm:p-5 border border-border/40 space-y-4">
        <div class="flex items-center gap-2 mb-1">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm"></div>
            <h3 class="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Details & Evidence</h3>
        </div>

        <div class="space-y-2">
            <Label for="description" class="text-xs font-bold text-slate-700 dark:text-slate-300">
                {{ t('services.itHelp.tickets.description') }} <span class="text-red-500">*</span>
            </Label>
            <Textarea
                id="description"
                v-model="form.description"
                :placeholder="t('services.itHelp.tickets.descriptionPlaceholder')"
                class="min-h-[120px] bg-white dark:bg-card border-border/50 rounded-[10px] resize-y p-3"
                required
            />
        </div>

        <div class="space-y-2">
            <Label class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ t('services.itHelp.tickets.attachment') }}</Label>
            
            <div
                v-if="!attachmentPreview"
                class="w-full h-32 border-2 border-dashed border-border/60 rounded-[12px] flex flex-col items-center justify-center gap-3 bg-white hover:bg-slate-50 dark:bg-slate-900 transition-colors cursor-pointer group"
                @click="handleFileClick"
                @dragover="handleDragOver"
                @drop="handleDrop"
            >
                <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <CloudUpload class="w-5 h-5 text-slate-500" />
                </div>
                <div class="text-center">
                    <p class="text-sm font-bold text-slate-700 dark:text-slate-300">Click or drag image here</p>
                    <p class="text-[0.65rem] text-muted-foreground mt-0.5 font-medium">PNG, JPG up to 5MB</p>
                </div>
            </div>

            <div v-else class="relative w-full h-40 rounded-[12px] border border-border/40 overflow-hidden group shadow-sm">
                <img :src="attachmentPreview" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                    <CheckCircle2 class="w-8 h-8 text-white mb-2" />
                    <Button type="button" variant="destructive" size="sm" class="h-8 text-xs font-bold uppercase tracking-wider rounded-full px-4" @click="removeAttachment">
                        <Trash2 class="w-3.5 h-3.5 mr-1.5" /> Remove Image
                    </Button>
                </div>
            </div>

            <input
                ref="attachmentInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileChange"
            />
        </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-4 border-t border-border/30">
      <Button type="button" variant="outline" class="flex-1 h-12 rounded-[10px] text-xs font-bold uppercase tracking-widest border-border/60 hover:bg-slate-50" @click="onCancel">
        {{ t('common.cancel') }}
      </Button>
      <Button type="submit" class="flex-[2] h-12 rounded-[10px] text-xs font-bold uppercase tracking-widest shadow-md shadow-primary/20 hover:shadow-lg transition-shadow" :disabled="loading">
        <Send v-if="!loading" class="w-4 h-4 mr-2" />
        <span v-if="loading" class="flex items-center gap-2">
          <Spinner class="h-4 w-4" />
          {{ t('services.itHelp.request.submitting') }}
        </span>
        <span v-else>{{ t('services.itHelp.tickets.submit') }}</span>
      </Button>
    </div>
  </form>
</template>

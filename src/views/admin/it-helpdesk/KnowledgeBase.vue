<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import {
    BookOpen,
    Search,
    Upload
} from 'lucide-vue-next';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

// Components
import KnowledgeBookCard from '@/components/knowledge-center/KnowledgeBookCard.vue';
import KnowledgeBookEdit from '@/components/knowledge-center/KnowledgeBookEdit.vue';
import KnowledgeBookUpload from '@/components/knowledge-center/KnowledgeBookUpload.vue';
import KnowledgeBookViewer from '@/components/knowledge-center/KnowledgeBookViewer.vue';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Services & Composables
import { usePermissions } from '@/composables/usePermissions';
import { knowledgeBooksApi, type KnowledgeBook } from '@/services/knowledge-books';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n();
const { isAdmin } = usePermissions();
const authStore = useAuthStore();

// State
const books = ref<KnowledgeBook[]>([]);
const loadingBooks = ref(false);
const searchQuery = ref('');
const selectedCategory = ref<string>('ALL');
const ebookCategories = ref<string[]>([]);
const loadingCategories = ref(false);

// Modals
const isUploadModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isViewerModalOpen = ref(false);
const isDeleteConfirmOpen = ref(false);
const selectedBook = ref<KnowledgeBook | null>(null);
const bookToDelete = ref<KnowledgeBook | null>(null);

const isITDepartment = computed(() => {
  if (isAdmin.value) return true;
  const userDept = authStore.user?.department;
  return userDept === 'Information Technology' || userDept === 'เทคโนโลยีสารสนเทศ (IT)';
});

// Create a safe valid prop for Carousel
const carouselOpts = {
  align: 'start',
  loop: true,
} as any

async function loadCategories() {
  loadingCategories.value = true;
  try {
    ebookCategories.value = await knowledgeBooksApi.getCategories();
  } catch (error) {
    console.error('Failed to load categories:', error);
  } finally {
    loadingCategories.value = false;
  }
}

async function loadBooks() {
  loadingBooks.value = true;
  try {
    const params: any = {};
    if (selectedCategory.value !== 'ALL') params.category = selectedCategory.value;
    if (searchQuery.value) params.search = searchQuery.value;
    
    books.value = await knowledgeBooksApi.getAll(params);
  } catch (error) {
    console.error('Failed to load books:', error);
  } finally {
    loadingBooks.value = false;
  }
}

watch([searchQuery, selectedCategory], () => {
    loadBooks();
});

const handleViewBook = (book: KnowledgeBook) => {
  if (book.fileType !== 'pdf' && book.fileType !== 'pptx') {
    toast.info(t('services.itHelp.kb.pptxDirectDownload'));
    handleDownloadBook(book);
    return;
  }
  selectedBook.value = book;
  isViewerModalOpen.value = true;
};

const handleDownloadBook = (book: KnowledgeBook) => {
  const link = document.createElement('a');
  link.href = knowledgeBooksApi.getDownloadUrl(book.id);
  link.download = book.fileName;
  link.click();

  // Increment download count locally
  const bookIndex = books.value.findIndex((b) => b.id === book.id);
  if (bookIndex !== -1) {
    books.value[bookIndex].downloads++;
  }
};

const handleEditBook = (book: KnowledgeBook) => {
  selectedBook.value = book;
  isEditModalOpen.value = true;
};

const handleDeleteBook = (book: KnowledgeBook) => {
  bookToDelete.value = book;
  isDeleteConfirmOpen.value = true;
};

const confirmDelete = async () => {
  if (!bookToDelete.value) return;

  try {
    await knowledgeBooksApi.delete(bookToDelete.value.id);
    await loadBooks();
    toast.success('eBook deleted successfully');
  } catch (error) {
    console.error('Failed to delete book:', error);
    toast.error('Failed to delete eBook');
  } finally {
    isDeleteConfirmOpen.value = false;
    bookToDelete.value = null;
  }
};

const handleUploadSuccess = () => {
    isUploadModalOpen.value = false;
    loadBooks();
    loadCategories();
    toast.success('Book uploaded successfully');
}

const handleEditSuccess = () => {
    isEditModalOpen.value = false;
    loadBooks();
    toast.success('Book updated successfully');
}

onMounted(() => {
  loadCategories();
  loadBooks();
});
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold">{{ t('services.itHelp.kb.title') }}</h3>
        <p class="text-sm text-muted-foreground">{{ t('services.itHelp.kb.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
              v-model="searchQuery"
              :placeholder="t('services.itHelp.searchPlaceholder')"
              class="pl-9 h-9 w-[200px]"
            />
         </div>

        <Select v-model="selectedCategory">
          <SelectTrigger class="w-[180px] h-9">
            <SelectValue :placeholder="t('services.itHelp.kb.allCategories')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{{ t('services.itHelp.kb.allCategories') }}</SelectItem>
            <SelectItem v-for="cat in ebookCategories" :key="cat" :value="cat">
              {{ cat }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          v-if="isITDepartment"
          size="sm"
          @click="isUploadModalOpen = true"
          class="gap-2 h-9 whitespace-nowrap bg-primary text-white hover:bg-primary/90 shadow-sm font-bold"
        >
          <Upload class="w-4 h-4" />
          {{ t('services.itHelp.kb.uploadBtn') }}
        </Button>
      </div>
    </div>

    <!-- eBook Grid -->
    <div v-if="loadingBooks" class="flex justify-center py-12">
      <Spinner class="h-8 w-8 text-primary" />
    </div>

    <div v-else-if="books.length === 0" class="text-center py-12">
      <BookOpen class="w-12 h-12 mx-auto mb-4 opacity-20" />
      <h3 class="text-lg font-medium mb-2">{{ t('services.itHelp.kb.noBooks') }}</h3>
      <p class="text-muted-foreground mb-4">
        {{
          searchQuery || selectedCategory !== 'ALL'
            ? t('services.itHelp.kb.adjustFilters')
            : t('services.itHelp.kb.uploadFirst')
        }}
      </p>
      <Button
        v-if="isITDepartment"
        variant="outline"
        @click="isUploadModalOpen = true"
        class="gap-2"
      >
        <Upload class="w-4 h-4" />
        {{ t('services.itHelp.kb.uploadBtn') }}
      </Button>
    </div>

    <div v-else class="relative px-12">
      <Carousel
        class="w-full"
        :opts="carouselOpts"
      >
        <CarouselContent class="-ml-4">
          <CarouselItem
            v-for="book in books"
            :key="book.id"
            class="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <KnowledgeBookCard
              :book="book"
              :can-delete="isITDepartment"
              @view="handleViewBook(book)"
              @download="handleDownloadBook(book)"
              @delete="handleDeleteBook(book)"
              @edit="handleEditBook(book)"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious class="-left-12 h-10 w-10" />
        <CarouselNext class="-right-12 h-10 w-10" />
      </Carousel>
    </div>

    <!-- Upload Modal -->
    <KnowledgeBookUpload 
      v-model:open="isUploadModalOpen" 
      @uploaded="handleUploadSuccess" 
    />

    <!-- Edit Modal -->
    <KnowledgeBookEdit 
        v-if="selectedBook" 
        :book="selectedBook" 
        v-model:open="isEditModalOpen"
        @updated="handleEditSuccess" 
    />

    <!-- Viewer Modal -->
    <KnowledgeBookViewer
      v-if="selectedBook"
      v-model:open="isViewerModalOpen"
      :book="selectedBook"
    />

    <!-- Delete Confirmation -->
    <AlertDialog v-model:open="isDeleteConfirmOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{{ t('common.areYouSure') }}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the eBook
            <span class="font-bold text-foreground">{{ bookToDelete?.title }}</span>
            and remove the file from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{{ t('common.cancel') }}</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            @click="confirmDelete"
          >
            {{ t('common.delete') }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

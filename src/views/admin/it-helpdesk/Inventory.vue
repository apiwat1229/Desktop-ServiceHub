<script setup lang="ts">
import { ColumnDef } from '@tanstack/vue-table';
import {
    AlertTriangle,
    ArrowUpDown,
    Edit2,
    Monitor,
    Plus,
    Search
} from 'lucide-vue-next';
import { computed, h, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import BarcodePreview from '@/components/helpdesk/BarcodePreview.vue';
import ITStockForm from '@/components/helpdesk/ITStockForm.vue';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/ui/data-table/DataTable.vue';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Spinner from '@/components/ui/spinner/Spinner.vue';

import { itAssetsApi, type ITAsset } from '@/services/it-assets';

const { t } = useI18n();

const itStock = ref<ITAsset[]>([]);
const loadingStock = ref(false);
const searchQuery = ref('');
const stockCategoryFilter = ref<string>('ALL');
const isStockModalOpen = ref(false);
const editingStockItem = ref<ITAsset | null>(null);
const isStockDeleteConfirmOpen = ref(false);
const stockItemToDelete = ref<ITAsset | null>(null);

const loadITAssets = async () => {
  loadingStock.value = true;
  try {
    itStock.value = await itAssetsApi.getAll();
  } catch (error) {
    console.error('Failed to load IT assets:', error);
    toast.error(t('common.errorLoading'));
  } finally {
    loadingStock.value = false;
  }
};

const getStockStatus = (item: ITAsset) => {
  if (item.stock <= 0) return 'Out of Stock';
  if (item.stock <= (item.minStock || 0)) return 'Low Stock';
  return 'In Stock';
};

const getImageUrl = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://app.ytrc.co.th';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (
    cleanBaseUrl.includes('app.ytrc.co.th') &&
    !cleanBaseUrl.endsWith('/api') &&
    !cleanPath.startsWith('/api')
  ) {
    return `${cleanBaseUrl}/api${cleanPath}`;
  }

  return `${cleanBaseUrl}${cleanPath}`;
};

const stockStats = computed(() => {
  if (!itStock.value.length) {
    return {
      totalItems: 0,
      totalStock: 0,
      lowStock: 0,
      outOfStock: 0,
      alerts: 0,
    };
  }
  const totalItems = itStock.value.length;
  const totalStock = itStock.value.reduce((acc, item) => acc + (item.stock || 0), 0);
  const lowStock = itStock.value.filter((item) => getStockStatus(item) === 'Low Stock').length;
  const outOfStock = itStock.value.filter((item) => getStockStatus(item) === 'Out of Stock').length;
  return {
    totalItems,
    totalStock,
    lowStock,
    outOfStock,
    alerts: lowStock + outOfStock,
  };
});

const stockCategories = computed(() => {
  const cats = new Set(itStock.value.map((item) => item.category).filter(Boolean));
  return Array.from(cats).sort();
});

const filteredITStock = computed(() => {
  let filtered = itStock.value;

  if (stockCategoryFilter.value && stockCategoryFilter.value !== 'ALL') {
    filtered = filtered.filter((item) => item.category === stockCategoryFilter.value);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q))
    );
  }

  return filtered;
});

const handleAddStock = () => {
  editingStockItem.value = null;
  isStockModalOpen.value = true;
};

const handleEditStock = (item: ITAsset) => {
  editingStockItem.value = { ...item };
  isStockModalOpen.value = true;
};

const handleStockSuccess = () => {
  isStockModalOpen.value = false;
  loadITAssets();
  toast.success(t('services.itHelp.stock.saveSuccess'));
};

const handleDeleteStock = (item: ITAsset | null) => {
  if (!item) return;
  stockItemToDelete.value = item;
  isStockDeleteConfirmOpen.value = true;
};

const confirmDeleteStock = async () => {
  if (!stockItemToDelete.value) return;

  try {
    await itAssetsApi.delete(stockItemToDelete.value.id);
    toast.success(t('common.success'), {
      description: t('services.itHelp.stock.deleteSuccess') || 'Item deleted successfully',
    });
    loadITAssets();
  } catch (error) {
    console.error('Failed to delete stock item:', error);
    toast.error(t('common.error'), {
      description: 'Failed to delete item',
    });
  } finally {
    isStockDeleteConfirmOpen.value = false;
    stockItemToDelete.value = null;
  }
};


const itAssetColumns: ColumnDef<ITAsset>[] = [
  {
    id: 'index',
    header: () => h('div', { class: 'text-center' }, 'No.'),
    cell: ({ row }) => h('div', { class: 'text-center' }, row.index + 1),
  },
  {
    accessorKey: 'name',
    header: () => h('div', t('services.itHelp.stock.deviceName')),
    cell: ({ row }) => {
      const item = row.original;
      return h(
        HoverCard,
        { openDelay: 200 },
        {
          default: () => [
            h(
              HoverCardTrigger,
              { asChild: true },
              {
                default: () =>
                  h('div', { class: 'flex flex-col cursor-help group' }, [
                    h(
                      'div',
                      { class: 'font-medium group-hover:text-primary transition-colors' },
                      item.name
                    ),
                    h('div', { class: 'text-xs text-muted-foreground' }, item.code),
                  ]),
              }
            ),
            h(
              HoverCardContent,
              { class: 'w-80 shadow-2xl' },
              {
                default: () =>
                  h('div', { class: 'space-y-3' }, [
                    item.image
                      ? h(
                          'div',
                          {
                            class:
                              'relative aspect-video rounded-md overflow-hidden bg-muted border',
                          },
                          [
                            h('img', {
                              src: getImageUrl(item.image),
                              class: 'absolute inset-0 w-full h-full object-contain',
                            }),
                          ]
                        )
                      : h(
                          'div',
                          {
                            class:
                              'aspect-video rounded-md bg-muted flex items-center justify-center border',
                          },
                          [h(Monitor, { class: 'w-8 h-8 opacity-20' })]
                        ),
                    h('div', { class: 'space-y-1' }, [
                      h('div', { class: 'text-sm font-bold' }, item.name),
                      h(
                        'div',
                        { class: 'grid grid-cols-[80px_1fr] gap-x-2 gap-y-0.5 text-[0.6875rem]' },
                        [
                          h('span', { class: 'text-muted-foreground' }, 'Device Code:'),
                          h('span', { class: 'font-mono' }, item.code),
                          h('span', { class: 'text-muted-foreground' }, 'Category:'),
                          h(
                            'span',
                            item.category
                              ? item.category.charAt(0).toUpperCase() + item.category.slice(1)
                              : '-'
                          ),
                          h('span', { class: 'text-muted-foreground' }, 'Location:'),
                          h('span', item.location || '-'),
                        ]
                      ),
                      item.barcode
                        ? h('div', { class: 'pt-2' }, [
                            h(BarcodePreview, { value: item.barcode, height: 35, fontSize: 10 }),
                          ])
                        : null,
                    ]),
                  ]),
              }
            ),
          ],
        }
      );
    },
  },
  {
    accessorKey: 'category',
    header: () => h('div', t('services.itHelp.stock.category')),
    cell: ({ row }) => {
      const category = row.getValue('category') as string;
      return h('div', category ? category.charAt(0).toUpperCase() + category.slice(1) : '-');
    },
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
          class: 'text-center w-full hover:bg-muted font-bold px-0 gap-2',
        },
        () => [t('services.itHelp.stock.count'), h(ArrowUpDown, { class: 'h-4 w-4' })]
      );
    },
    cell: ({ row }) => h('div', { class: 'text-center font-bold' }, row.getValue('stock')),
  },
  {
    id: 'status',
    header: () => h('div', { class: 'text-center' }, t('common.status')),
    cell: ({ row }) => {
      const item = row.original;
      const status = getStockStatus(item);
      let badgeClass = 'bg-green-100 text-green-700';
      if (status === 'Low Stock') badgeClass = 'bg-orange-100 text-orange-700';
      if (status === 'Out of Stock') badgeClass = 'bg-red-100 text-red-700';

      return h(
        'div',
        { class: 'text-center' },
        h(
          Badge,
          {
            variant: 'secondary',
            class: badgeClass,
          },
          () => status
        )
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    header: () => h('div', { class: 'text-center' }, t('common.actions')),
    cell: ({ row }) => {
      const item = row.original;
      return h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
        h(
          Button,
          {
            variant: 'ghost',
            size: 'icon',
            class: 'h-8 w-8',
            onClick: (e: Event) => {
              e.stopPropagation();
              handleEditStock(item);
            },
          },
          () => h(Edit2, { class: 'w-4 h-4' })
        ),
        h(
          Button,
          {
             variant: 'ghost',
             size: 'icon',
             class: 'h-8 w-8 text-destructive hover:bg-destructive/10',
             onClick: (e: Event) => {
               e.stopPropagation();
               handleDeleteStock(item);
             },
          },
             () => h(Monitor, { class: 'w-4 h-4' }) // Using Monitor icon as placeholder if Trash not available, but should probably import Trash
        )
      ]);
    },
  },
];

onMounted(() => {
  loadITAssets();
});
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-muted-foreground">Inventory Overview</h3>
        <div class="flex items-center gap-3">
          <!-- Search Popover -->
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                size="icon"
                class="h-9 w-9 text-muted-foreground hover:text-primary bg-white/50 hover:bg-white shadow-sm border-slate-200"
              >
                <Search class="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-80 p-2" align="start">
              <div class="flex items-center gap-2">
                <Search class="h-4 w-4 text-muted-foreground" />
                <Input
                  v-model="searchQuery"
                  :placeholder="t('services.itHelp.searchPlaceholder')"
                  class="h-8 border-none focus-visible:ring-0 shadow-none"
                  auto-focus
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent class="flex items-center justify-between p-3">
            <div
              class="flex-1 flex flex-col items-center justify-center border-r border-border pr-2"
            >
              <div
                class="text-[0.7rem] font-medium text-muted-foreground mb-1 uppercase tracking-tight"
              >
                Total Hardware
              </div>
              <div class="text-xl font-bold">{{ stockStats.totalItems }}</div>
            </div>
            <div class="flex-1 flex flex-col items-center justify-center pl-2">
              <div
                class="text-[0.7rem] font-medium text-primary flex items-center gap-1 mb-1 uppercase tracking-tight"
              >
                <Monitor class="w-3 h-3" /> Total Units
              </div>
              <div class="text-xl font-bold">{{ stockStats.totalStock }}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="flex items-center justify-between p-3">
            <div
              class="flex-1 flex flex-col items-center justify-center border-r border-border pr-2"
            >
              <div
                class="text-[0.7rem] font-medium text-orange-600 mb-1 uppercase tracking-tight"
              >
                Low Stock
              </div>
              <div class="text-xl font-bold text-orange-600">{{ stockStats.lowStock }}</div>
            </div>
            <div class="flex-1 flex flex-col items-center justify-center pl-2">
              <div class="text-[0.7rem] font-medium text-red-600 mb-1 uppercase tracking-tight">
                Out of Stock
              </div>
              <div class="text-xl font-bold text-red-600">{{ stockStats.outOfStock }}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="flex items-center justify-between p-3 bg-red-50/50">
            <div class="flex-1 flex flex-col items-center justify-center">
              <div
                class="text-[0.7rem] font-medium text-red-700 flex items-center gap-1 mb-1 uppercase tracking-tight"
              >
                <AlertTriangle class="w-3 h-3" /> Stock Alerts
              </div>
              <div class="text-2xl font-black text-red-700 line-height-1">
                {{ stockStats.alerts }}
              </div>
              <div
                class="text-[0.55rem] text-red-600/70 mt-0.5 uppercase tracking-wider font-bold"
              >
                Items needing attention
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <div class="space-y-1">
          <CardTitle>{{ t('services.itHelp.stock.title') }}</CardTitle>
          <CardDescription>{{ t('services.itHelp.stock.subtitle') }}</CardDescription>
        </div>
        <div class="flex items-center gap-3">
          <Select v-model="stockCategoryFilter">
            <SelectTrigger class="w-[180px] h-9">
              <SelectValue :placeholder="t('services.itHelp.stock.category') || 'Category'" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{{ t('services.itHelp.kb.allCategories') }}</SelectItem>
              <SelectItem v-for="cat in stockCategories" :key="cat" :value="cat">
                {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            class="gap-2 h-9 font-bold bg-primary text-white hover:bg-primary/90 shadow-sm"
            @click="handleAddStock"
          >
            <Plus class="w-4 h-4" /> {{ t('services.itHelp.stock.addItem') }}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="loadingStock" class="flex justify-center py-12">
          <Spinner class="h-8 w-8 text-primary" />
        </div>
        <DataTable v-else :columns="itAssetColumns" :data="filteredITStock" />
      </CardContent>
    </Card>

    <!-- Stock Form Modal -->
    <Dialog v-model:open="isStockModalOpen">
      <DialogContent class="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <ITStockForm
          :edit-mode="!!editingStockItem"
          :initial-data="editingStockItem || undefined"
          @success="handleStockSuccess"
          @cancel="isStockModalOpen = false"
        />
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation -->
    <AlertDialog v-model:open="isStockDeleteConfirmOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{{ t('common.areYouSure') }}</AlertDialogTitle>
          <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item
              <span class="font-bold text-foreground">{{ stockItemToDelete?.name }}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{{ t('common.cancel') }}</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            @click="confirmDeleteStock"
          >
            {{ t('common.delete') }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

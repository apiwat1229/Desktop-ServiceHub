<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const breadcrumbs = computed(() => {
  const matched = route.matched;
  const crumbs: Array<{ name: string; path: string; isLast: boolean }> = [];

  matched.forEach((record, index) => {
    // Skip records without a name or explicitly marked to hide in breadcrumbs (if we had such meta)
    // Also skip the 'MainLayout' wrapper if it doesn't have a meaningful name
    const name = record.name?.toString() || record.meta?.breadcrumb?.toString();
    
    if (name && name !== 'MainLayout') {
      crumbs.push({
        name: name,
        path: record.path || '/',
        isLast: index === matched.length - 1,
      });
    }
  });

  return crumbs;
});

const navigate = (path: string) => {
  router.push(path);
};
</script>

<template>
  <Breadcrumb class="no-drag">
    <BreadcrumbList>
      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
        <BreadcrumbItem>
          <BreadcrumbLink 
            v-if="!crumb.isLast" 
            @click.prevent="navigate(crumb.path)"
            href="#"
            class="text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer capitalize"
          >
            {{ crumb.name }}
          </BreadcrumbLink>
          <BreadcrumbPage v-else class="text-xs font-bold text-foreground capitalize">
            {{ crumb.name }}
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" class="opacity-50" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

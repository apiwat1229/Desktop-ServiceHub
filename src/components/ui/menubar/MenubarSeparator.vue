<script setup lang="ts">
import { cn } from '@/lib/utils';
import { MenubarSeparator, type MenubarSeparatorProps } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<MenubarSeparatorProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <MenubarSeparator v-bind="delegatedProps" :class="cn('-mx-1 my-1 h-px bg-muted', props.class)" />
</template>

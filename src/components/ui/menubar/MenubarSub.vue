<script setup lang="ts">
import { MenubarSub, useForwardPropsEmits, type MenubarSubEmits, type MenubarSubProps } from 'radix-vue';

const props = defineProps<MenubarSubProps>();
const emits = defineEmits<MenubarSubEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <MenubarSub v-bind="forwarded">
    <slot />
  </MenubarSub>
</template>

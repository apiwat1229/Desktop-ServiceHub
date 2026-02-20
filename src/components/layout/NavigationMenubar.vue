<script setup lang="ts">
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { useSidebarMenu } from '@/composables/useSidebarMenu';
import { Menu } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const { menuGroups } = useSidebarMenu();
const router = useRouter();

const navigate = (path: string) => {
  router.push(path);
};
</script>

<template>
  <Menubar class="border-none bg-transparent shadow-none">
    <MenubarMenu v-for="group in menuGroups" :key="group.title">
      <MenubarTrigger class="font-bold text-xs uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors cursor-pointer group">
        <div class="flex items-center gap-2">
          <Menu v-if="group.title.toUpperCase() === 'MAIN'" class="w-4 h-4 opacity-70 group-hover:text-primary transition-colors" />
          <span>{{ group.title.toUpperCase() === 'MAIN' ? 'Menu' : group.title }}</span>
        </div>
      </MenubarTrigger>
      <MenubarContent>
        <template v-for="(item, itemIndex) in group.items" :key="item.path">
          <!-- Submenu -->
          <MenubarSub v-if="item.children">
            <MenubarSubTrigger class="flex items-center gap-2 group">
              <component :is="item.icon" class="w-4 h-4 opacity-70 group-hover:text-primary transition-colors" />
              <span class="font-medium">{{ item.name }}</span>
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem 
                v-for="child in item.children" 
                :key="child.path"
                @click="navigate(child.path)"
                class="flex items-center gap-2 cursor-pointer"
              >
                <component :is="child.icon" class="w-3.5 h-3.5 opacity-60" />
                <span>{{ child.name }}</span>
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>

          <!-- Normal Item -->
          <MenubarItem 
            v-else 
            @click="navigate(item.path)"
            class="flex items-center gap-2 cursor-pointer"
          >
            <component :is="item.icon" class="w-4 h-4 opacity-70 group-hover:text-primary transition-colors" />
            <span class="font-medium">{{ item.name }}</span>
          </MenubarItem>
          
          <MenubarSeparator v-if="itemIndex < group.items.length - 1" />
        </template>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>

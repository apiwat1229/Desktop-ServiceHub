<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/theme';
import {
    Code,
    Languages,
    Maximize,
    Moon,
    Palette,
    RefreshCw,
    RotateCcw,
    Search,
    Sun,
    Type,
    Zap
} from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const themeStore = useThemeStore();
const { locale } = useI18n();

const colors = [
  { name: 'Teal', value: 'teal', bg: 'bg-teal-500' },
  { name: 'Green', value: 'green', bg: 'bg-green-600' },
  { name: 'Blue', value: 'blue', bg: 'bg-blue-600' },
  { name: 'Pink', value: 'pink', bg: 'bg-pink-500' },
  { name: 'Rose', value: 'rose', bg: 'bg-rose-500' },
  { name: 'Violet', value: 'violet', bg: 'bg-violet-600' },
];

const fontFamilies = [
  { name: 'Bai Jamjuree', value: 'baiJamjuree', style: { fontFamily: 'Bai Jamjuree, sans-serif' } },
  { name: 'Sarabun', value: 'sarabun', style: { fontFamily: 'Sarabun, sans-serif' } },
  { name: 'Kanit', value: 'kanit', style: { fontFamily: 'Kanit, sans-serif' } },
  { name: 'Prompt', value: 'prompt', style: { fontFamily: 'Prompt, sans-serif' } },
  { name: 'Noto Sans Thai', value: 'notoSansThai', style: { fontFamily: 'Noto Sans Thai, sans-serif' } },
];

const fontSizeMap = ['small', 'medium', 'large', 'xl'];
const currentFontSizeValue = computed({
  get: () => fontSizeMap.indexOf(themeStore.fontSize),
  set: (val) => {
    themeStore.fontSize = fontSizeMap[val];
  }
});

const setLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem('language', lang);
};

// System Control Handlers
const handleReload = () => (window as any).ipcRenderer?.window?.reload?.();
const handleForceReload = () => (window as any).ipcRenderer?.window?.forceReload?.();
const handleDevTools = () => (window as any).ipcRenderer?.window?.toggleDevTools?.();
const handleZoomIn = () => (window as any).ipcRenderer?.window?.zoomIn?.();
const handleZoomOut = () => (window as any).ipcRenderer?.window?.zoomOut?.();
const handleZoomReset = () => (window as any).ipcRenderer?.window?.zoomReset?.();
const handleFullscreen = () => (window as any).ipcRenderer?.window?.toggleFullscreen?.();

</script>

<template>
  <div class="space-y-8 select-none">
    
    <!-- Top Row: Appearance & Language -->
    <div class="grid grid-cols-2 gap-8">
      <!-- Appearance -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-primary flex items-center gap-2">
          <Sun class="w-4 h-4" />
          Appearance
        </h3>
        <div class="grid grid-cols-2 gap-2">
            <button
                @click="themeStore.isDark = false"
                class="flex flex-col items-center justify-center h-20 rounded-xl border-2 transition-all duration-200 hover:bg-muted/50"
                :class="!themeStore.isDark ? 'border-primary bg-primary/5 text-primary' : 'border-border/40 text-muted-foreground'"
            >
                <Sun class="w-6 h-6 mb-2" />
                <span class="text-xs font-semibold">Light</span>
            </button>
            <button
                @click="themeStore.isDark = true"
                class="flex flex-col items-center justify-center h-20 rounded-xl border-2 transition-all duration-200 hover:bg-muted/50"
                :class="themeStore.isDark ? 'border-primary bg-primary/5 text-primary' : 'border-border/40 text-muted-foreground'"
            >
                <Moon class="w-6 h-6 mb-2" />
                <span class="text-xs font-semibold">Dark</span>
            </button>
        </div>
      </div>

      <!-- Language -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-primary flex items-center gap-2">
          <Languages class="w-4 h-4" />
          Language
        </h3>
         <div class="grid grid-cols-2 gap-2">
            <button
                @click="setLanguage('en')"
                class="flex flex-col items-center justify-center h-20 rounded-xl border-2 transition-all duration-200 hover:bg-muted/50"
                :class="locale === 'en' ? 'border-primary bg-primary/5 text-primary' : 'border-border/40 text-muted-foreground'"
            >
                <div class="w-8 h-6 mb-2 rounded shadow-sm overflow-hidden relative bg-blue-900 icon-scale">
                    <svg viewBox="0 0 60 30" class="w-full h-full object-cover">
                        <clipPath id="t">
                            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
                        </clipPath>
                        <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/>
                        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
                        <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#cf142b" stroke-width="4"/>
                        <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
                        <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" stroke-width="6"/>
                    </svg>
                </div>
                <span class="text-xs font-semibold">English</span>
            </button>
             <button
                @click="setLanguage('th')"
                class="flex flex-col items-center justify-center h-20 rounded-xl border-2 transition-all duration-200 hover:bg-muted/50"
                :class="locale === 'th' ? 'border-primary bg-primary/5 text-primary' : 'border-border/40 text-muted-foreground'"
            >
                <div class="w-8 h-6 mb-2 rounded shadow-sm overflow-hidden bg-gray-100 icon-scale">
                    <svg viewBox="0 0 900 600" class="w-full h-full object-cover">
                        <rect width="900" height="600" fill="#ED1C24"/>
                        <rect y="100" width="900" height="400" fill="#FFF"/>
                        <rect y="200" width="900" height="200" fill="#241D4F"/>
                    </svg>
                </div>
                <span class="text-xs font-semibold">ไทย</span>
            </button>
        </div>
      </div>
    </div>

    <!-- Theme Color -->
    <div class="space-y-4">
      <h3 class="text-sm font-semibold text-primary flex items-center gap-2">
        <Palette class="w-4 h-4" />
        Theme Color
      </h3>
      <div class="flex items-center gap-4">
      <div class="flex items-center gap-4">
        <button
          v-for="color in colors"
          :key="color.value"
          @click="themeStore.themeColor = color.value"
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
          :class="[
            color.bg,
            themeStore.themeColor === color.value ? 'ring-4 ring-offset-2 ring-offset-background scale-110 shadow-md' : 'opacity-70 hover:opacity-100 hover:scale-105'
          ]"
          :style="{ '--tw-ring-color': `var(--color-${color.value}-500)` }" 
        >
           <div v-if="themeStore.themeColor === color.value" class="text-white drop-shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
           </div>
        </button>
      </div>
      </div>
    </div>

    <!-- Typography -->
    <div class="p-6 rounded-2xl border border-border/60 bg-card/50">
      <h3 class="text-sm font-semibold text-primary flex items-center gap-2 mb-6">
        <Type class="w-4 h-4" />
        Typography Settings
      </h3>
      
      <div class="grid grid-cols-12 gap-8">
        <!-- Font Selection -->
        <div class="col-span-5 space-y-4 border-r border-border/40 pr-6">
          <label class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 block">Font Family</label>
          <div class="space-y-1">
             <button
                v-for="font in fontFamilies"
                :key="font.value"
                @click="themeStore.fontFamily = font.value"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left text-sm group overflow-hidden"
                :class="themeStore.fontFamily === font.value ? 'bg-primary text-primary-foreground font-medium shadow-md' : 'text-muted-foreground hover:bg-muted'"
             >
                <div class="w-2 h-2 rounded-full shrink-0" :class="themeStore.fontFamily === font.value ? 'bg-white' : 'bg-muted-foreground/30'"></div>
                <span :style="font.style" class="truncate whitespace-nowrap">{{ font.name }}</span>
             </button>
          </div>
        </div>

        <!-- Font Size & Preview -->
        <div class="col-span-7 flex flex-col gap-6">
           <div>
              <div class="flex items-center justify-between mb-4">
                <label class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Font Size: {{ themeStore.fontSize.toUpperCase() }}</label>
              </div>
              <input 
                type="range" 
                min="0" 
                max="3" 
                v-model.number="currentFontSizeValue" 
                class="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              >
              <div class="flex justify-between text-[10px] text-muted-foreground font-bold mt-2 px-1">
                  <span>A</span>
                  <span>A</span>
              </div>
           </div>

           <div class="flex-1 flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 min-h-[120px] text-center gap-2 overflow-hidden">
               <span class="text-foreground font-medium truncate w-full">Example Text</span>
               <!-- Thai text often needs to be slightly larger to match Latin cap height visually -->
               <span class="text-foreground font-medium truncate w-full" style="font-size: 1.1em; line-height: 1.2;">ตัวอย่างข้อความ</span>
           </div>
        </div>
      </div>
    </div>

    <!-- System Controls -->
    <div class="pt-6 border-t border-dashed border-border/60 space-y-4">
        <h3 class="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Code class="w-3 h-3" />
            System Controls
        </h3>
        
        <div class="grid grid-cols-3 gap-3">
             <Button variant="outline" class="h-16 flex flex-col gap-1 rounded-xl bg-muted/20 hover:bg-muted/40 border-border/40" @click="handleReload">
                <RefreshCw class="w-4 h-4 text-muted-foreground" />
                <span class="text-[10px] font-bold text-foreground">Reload</span>
             </Button>
             <Button variant="outline" class="h-16 flex flex-col gap-1 rounded-xl bg-muted/20 hover:bg-muted/40 border-border/40" @click="handleForceReload">
                <Zap class="w-4 h-4 text-amber-500" />
                <span class="text-[10px] font-bold text-foreground">Force</span>
             </Button>
             <Button variant="outline" class="h-16 flex flex-col gap-1 rounded-xl bg-muted/20 hover:bg-muted/40 border-border/40" @click="handleDevTools">
                <Code class="w-4 h-4 text-blue-500" />
                <span class="text-[10px] font-bold text-foreground">DevTools</span>
             </Button>
        </div>

        <div class="grid grid-cols-3 gap-3">
             <Button variant="outline" class="h-16 flex flex-col gap-1 rounded-xl bg-muted/20 hover:bg-muted/40 border-border/40" @click="handleZoomOut">
                <Search class="w-4 h-4 text-muted-foreground" />
                <span class="text-[10px] font-bold text-foreground">Zoom -</span>
             </Button>
             <Button variant="outline" class="h-16 flex flex-col gap-1 rounded-xl bg-muted/20 hover:bg-muted/40 border-border/40" @click="handleZoomReset">
                <RotateCcw class="w-4 h-4 text-muted-foreground" />
                <span class="text-[10px] font-bold text-foreground">Reset</span>
             </Button>
             <Button variant="outline" class="h-16 flex flex-col gap-1 rounded-xl bg-muted/20 hover:bg-muted/40 border-border/40" @click="handleZoomIn">
                <Search class="w-4 h-4 text-muted-foreground" />
                <span class="text-[10px] font-bold text-foreground">Zoom +</span>
             </Button>
        </div>
        
         <Button variant="outline" class="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-muted/20 hover:bg-muted/40 border-primary/20 hover:border-primary text-primary font-bold uppercase tracking-widest text-xs" @click="handleFullscreen">
            <Maximize class="w-4 h-4" />
            Full Screen
         </Button>
    </div>

  </div>
</template>

<style scoped>
/* Custom Range Slider Styling */
input[type=range] {
  -webkit-appearance: none;
  background: transparent; 
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  margin-top: -6px; 
  box-shadow: 0 0 0 4px hsl(var(--background));
  border: 2px solid hsl(var(--primary));
}

input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: hsl(var(--muted));
  border-radius: 2px;
}
</style>

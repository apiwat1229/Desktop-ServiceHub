// vite.config.ts
import vue from "file:///C:/Users/apiwa/Desktop/Desktop-NestJS/apps/desktop/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "node:path";
import Components from "file:///C:/Users/apiwa/Desktop/Desktop-NestJS/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig } from "file:///C:/Users/apiwa/Desktop/Desktop-NestJS/apps/desktop/node_modules/vite/dist/node/index.js";
import electron from "file:///C:/Users/apiwa/Desktop/Desktop-NestJS/node_modules/vite-plugin-electron/dist/simple.mjs";
var __vite_injected_original_dirname = "C:\\Users\\apiwa\\Desktop\\Desktop-NestJS\\apps\\desktop";
var vite_config_default = defineConfig(({ mode }) => {
  const isWebOnly = process.env.ELECTRON_DISABLE === "1";
  const plugins = [
    vue(),
    Components({
      dts: true,
      dirs: ["src/components"],
      resolvers: [
        // Custom resolver for UI components
        (componentName) => {
          if (componentName.startsWith("Alert") || componentName.startsWith("Dialog") || componentName.startsWith("Button") || componentName.startsWith("Input") || componentName.startsWith("Label") || componentName.startsWith("Select") || componentName.startsWith("Card") || componentName.startsWith("Badge") || componentName.startsWith("Tabs") || componentName.startsWith("Table") || componentName.startsWith("Checkbox") || componentName.startsWith("Avatar") || componentName.startsWith("Dropdown") || componentName.startsWith("Sheet") || componentName.startsWith("Popover") || componentName.startsWith("Command") || componentName.startsWith("Separator") || componentName.startsWith("Scroll") || componentName.startsWith("Toast") || componentName.startsWith("Switch") || componentName.startsWith("Radio") || componentName.startsWith("Slider") || componentName.startsWith("Progress") || componentName.startsWith("Skeleton")) {
            const dirMap = {
              "Alert": "alert",
              "AlertDialog": "alert-dialog",
              "Button": "button",
              "Card": "card",
              "Dialog": "dialog",
              "Input": "input",
              "Label": "label",
              "Select": "select",
              "Badge": "badge",
              "Tabs": "tabs",
              "Table": "table",
              "Checkbox": "checkbox",
              "Avatar": "avatar",
              "Dropdown": "dropdown-menu",
              "Sheet": "sheet",
              "Popover": "popover",
              "Command": "command",
              "Separator": "separator",
              "Scroll": "scroll-area",
              "Toast": "toast",
              "Switch": "switch",
              "Radio": "radio-group",
              "Slider": "slider",
              "Progress": "progress",
              "Skeleton": "skeleton"
            };
            for (const [prefix, dir] of Object.entries(dirMap)) {
              if (componentName.startsWith(prefix)) {
                return {
                  name: componentName,
                  from: `@/components/ui/${dir}`
                };
              }
            }
          }
        }
      ]
    })
  ];
  if (!isWebOnly) {
    plugins.push(
      electron({
        main: {
          // Shortcut of `build.lib.entry`.
          entry: "electron/main.ts"
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: path.join(__vite_injected_original_dirname, "electron/preload.ts")
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: process.env.NODE_ENV === "test" ? void 0 : {}
      })
    );
  }
  return {
    cacheDir: isWebOnly ? "node_modules/.vite-web" : "node_modules/.vite-electron",
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    optimizeDeps: {
      include: [
        "vue",
        "pinia",
        "vue-router",
        "axios",
        "date-fns",
        "dayjs",
        "lucide-vue-next",
        "vue-i18n",
        "clsx",
        "tailwind-merge",
        "radix-vue",
        "reka-ui"
      ]
    },
    server: {
      host: true,
      port: 5173,
      allowedHosts: ["app.ytrc.co.th", "localhost", "122.154.46.21"]
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhcGl3YVxcXFxEZXNrdG9wXFxcXERlc2t0b3AtTmVzdEpTXFxcXGFwcHNcXFxcZGVza3RvcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYXBpd2FcXFxcRGVza3RvcFxcXFxEZXNrdG9wLU5lc3RKU1xcXFxhcHBzXFxcXGRlc2t0b3BcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FwaXdhL0Rlc2t0b3AvRGVza3RvcC1OZXN0SlMvYXBwcy9kZXNrdG9wL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IGVsZWN0cm9uIGZyb20gJ3ZpdGUtcGx1Z2luLWVsZWN0cm9uL3NpbXBsZSdcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICBjb25zdCBpc1dlYk9ubHkgPSBwcm9jZXNzLmVudi5FTEVDVFJPTl9ESVNBQkxFID09PSAnMSdcclxuXHJcbiAgY29uc3QgcGx1Z2luczogYW55W10gPSBbXHJcbiAgICB2dWUoKSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICBkdHM6IHRydWUsXHJcbiAgICAgIGRpcnM6IFsnc3JjL2NvbXBvbmVudHMnXSxcclxuICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgLy8gQ3VzdG9tIHJlc29sdmVyIGZvciBVSSBjb21wb25lbnRzXHJcbiAgICAgICAgKGNvbXBvbmVudE5hbWUpID0+IHtcclxuICAgICAgICAgIC8vIEF1dG8taW1wb3J0IGZyb20gY29tcG9uZW50cy91aS8qXHJcbiAgICAgICAgICBpZiAoY29tcG9uZW50TmFtZS5zdGFydHNXaXRoKCdBbGVydCcpIHx8XHJcbiAgICAgICAgICAgIGNvbXBvbmVudE5hbWUuc3RhcnRzV2l0aCgnRGlhbG9nJykgfHxcclxuICAgICAgICAgICAgY29tcG9uZW50TmFtZS5zdGFydHNXaXRoKCdCdXR0b24nKSB8fFxyXG4gICAgICAgICAgICBjb21wb25lbnROYW1lLnN0YXJ0c1dpdGgoJ0lucHV0JykgfHxcclxuICAgICAgICAgICAgY29tcG9uZW50TmFtZS5zdGFydHNXaXRoKCdMYWJlbCcpIHx8XHJcbiAgICAgICAgICAgIGNvbXBvbmVudE5hbWUuc3RhcnRzV2l0aCgnU2VsZWN0JykgfHxcclxuICAgICAgICAgICAgY29tcG9uZW50TmFtZS5zdGFydHNXaXRoKCdDYXJkJykgfHxcclxuICAgICAgICAgICAgY29tcG9uZW50TmFtZS5zdGFydHNXaXRoKCdCYWRnZScpIHx8XHJcbiAgICAgICAgICAgIGNvbXBvbmVudE5hbWUuc3RhcnRzV2l0aCgnVGFicycpIHx8XHJcbiAgICAgICAgICAgIGNvbXBvbmVudE5hbWUuc3RhcnRzV2l0aCgnVGFibGUnKSB8fFxyXG4gICAgICAgICAgICBjb21wb25lbnROYW1lLnN0YXJ0c1dpdGgoJ0NoZWNrYm94JykgfHxcclxuICAgICAgICAgICAgY29tcG9uZW50TmFtZS5zdGFydHNXaXRoKCdBdmF0YXInKSB8fFxyXG4gICAgICAgICAgICBjb21wb25lbnROYW1lLnN0YXJ0c1dpdGgoJ0Ryb3Bkb3duJykgfHxcclxuICAgICAgICAgICAgY29tcG9uZW50TmFtZS5zdGFydHNXaXRoKCdTaGVldCcpIHx8XHJcbiAgICAgICAgICAgIGNvbXBvbmVudE5hbWUuc3RhcnRzV2l0aCgnUG9wb3ZlcicpIHx8XHJcbiAgICAgICAgICAgIGNvbXBvbmVudE5hbWUuc3RhcnRzV2l0aCgnQ29tbWFuZCcpIHx8XHJcbiAgICAgICAgICAgIGNvbXBvbmVudE5hbWUuc3RhcnRzV2l0aCgnU2VwYXJhdG9yJykgfHxcclxuICAgICAgICAgICAgY29tcG9uZW50TmFtZS5zdGFydHNXaXRoKCdTY3JvbGwnKSB8fFxyXG4gICAgICAgICAgICBjb21wb25lbnROYW1lLnN0YXJ0c1dpdGgoJ1RvYXN0JykgfHxcclxuICAgICAgICAgICAgY29tcG9uZW50TmFtZS5zdGFydHNXaXRoKCdTd2l0Y2gnKSB8fFxyXG4gICAgICAgICAgICBjb21wb25lbnROYW1lLnN0YXJ0c1dpdGgoJ1JhZGlvJykgfHxcclxuICAgICAgICAgICAgY29tcG9uZW50TmFtZS5zdGFydHNXaXRoKCdTbGlkZXInKSB8fFxyXG4gICAgICAgICAgICBjb21wb25lbnROYW1lLnN0YXJ0c1dpdGgoJ1Byb2dyZXNzJykgfHxcclxuICAgICAgICAgICAgY29tcG9uZW50TmFtZS5zdGFydHNXaXRoKCdTa2VsZXRvbicpKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBNYXAgY29tcG9uZW50IG5hbWVzIHRvIHRoZWlyIGRpcmVjdG9yaWVzXHJcbiAgICAgICAgICAgIGNvbnN0IGRpck1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcclxuICAgICAgICAgICAgICAnQWxlcnQnOiAnYWxlcnQnLFxyXG4gICAgICAgICAgICAgICdBbGVydERpYWxvZyc6ICdhbGVydC1kaWFsb2cnLFxyXG4gICAgICAgICAgICAgICdCdXR0b24nOiAnYnV0dG9uJyxcclxuICAgICAgICAgICAgICAnQ2FyZCc6ICdjYXJkJyxcclxuICAgICAgICAgICAgICAnRGlhbG9nJzogJ2RpYWxvZycsXHJcbiAgICAgICAgICAgICAgJ0lucHV0JzogJ2lucHV0JyxcclxuICAgICAgICAgICAgICAnTGFiZWwnOiAnbGFiZWwnLFxyXG4gICAgICAgICAgICAgICdTZWxlY3QnOiAnc2VsZWN0JyxcclxuICAgICAgICAgICAgICAnQmFkZ2UnOiAnYmFkZ2UnLFxyXG4gICAgICAgICAgICAgICdUYWJzJzogJ3RhYnMnLFxyXG4gICAgICAgICAgICAgICdUYWJsZSc6ICd0YWJsZScsXHJcbiAgICAgICAgICAgICAgJ0NoZWNrYm94JzogJ2NoZWNrYm94JyxcclxuICAgICAgICAgICAgICAnQXZhdGFyJzogJ2F2YXRhcicsXHJcbiAgICAgICAgICAgICAgJ0Ryb3Bkb3duJzogJ2Ryb3Bkb3duLW1lbnUnLFxyXG4gICAgICAgICAgICAgICdTaGVldCc6ICdzaGVldCcsXHJcbiAgICAgICAgICAgICAgJ1BvcG92ZXInOiAncG9wb3ZlcicsXHJcbiAgICAgICAgICAgICAgJ0NvbW1hbmQnOiAnY29tbWFuZCcsXHJcbiAgICAgICAgICAgICAgJ1NlcGFyYXRvcic6ICdzZXBhcmF0b3InLFxyXG4gICAgICAgICAgICAgICdTY3JvbGwnOiAnc2Nyb2xsLWFyZWEnLFxyXG4gICAgICAgICAgICAgICdUb2FzdCc6ICd0b2FzdCcsXHJcbiAgICAgICAgICAgICAgJ1N3aXRjaCc6ICdzd2l0Y2gnLFxyXG4gICAgICAgICAgICAgICdSYWRpbyc6ICdyYWRpby1ncm91cCcsXHJcbiAgICAgICAgICAgICAgJ1NsaWRlcic6ICdzbGlkZXInLFxyXG4gICAgICAgICAgICAgICdQcm9ncmVzcyc6ICdwcm9ncmVzcycsXHJcbiAgICAgICAgICAgICAgJ1NrZWxldG9uJzogJ3NrZWxldG9uJyxcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gRmluZCBtYXRjaGluZyBkaXJlY3RvcnlcclxuICAgICAgICAgICAgZm9yIChjb25zdCBbcHJlZml4LCBkaXJdIG9mIE9iamVjdC5lbnRyaWVzKGRpck1hcCkpIHtcclxuICAgICAgICAgICAgICBpZiAoY29tcG9uZW50TmFtZS5zdGFydHNXaXRoKHByZWZpeCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGNvbXBvbmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgIGZyb206IGBAL2NvbXBvbmVudHMvdWkvJHtkaXJ9YFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSksXHJcbiAgXVxyXG5cclxuICAvLyBPbmx5IGFkZCBlbGVjdHJvbiBwbHVnaW4gaWYgbm90IGluIHdlYi1vbmx5IG1vZGVcclxuICBpZiAoIWlzV2ViT25seSkge1xyXG4gICAgcGx1Z2lucy5wdXNoKFxyXG4gICAgICBlbGVjdHJvbih7XHJcbiAgICAgICAgbWFpbjoge1xyXG4gICAgICAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLmxpYi5lbnRyeWAuXHJcbiAgICAgICAgICBlbnRyeTogJ2VsZWN0cm9uL21haW4udHMnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcHJlbG9hZDoge1xyXG4gICAgICAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLnJvbGx1cE9wdGlvbnMuaW5wdXRgLlxyXG4gICAgICAgICAgLy8gUHJlbG9hZCBzY3JpcHRzIG1heSBjb250YWluIFdlYiBhc3NldHMsIHNvIHVzZSB0aGUgYGJ1aWxkLnJvbGx1cE9wdGlvbnMuaW5wdXRgIGluc3RlYWQgYGJ1aWxkLmxpYi5lbnRyeWAuXHJcbiAgICAgICAgICBpbnB1dDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2VsZWN0cm9uL3ByZWxvYWQudHMnKSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFBsb3lmaWxsIHRoZSBFbGVjdHJvbiBhbmQgTm9kZS5qcyBBUEkgZm9yIFJlbmRlcmVyIHByb2Nlc3MuXHJcbiAgICAgICAgLy8gSWYgeW91IHdhbnQgdXNlIE5vZGUuanMgaW4gUmVuZGVyZXIgcHJvY2VzcywgdGhlIGBub2RlSW50ZWdyYXRpb25gIG5lZWRzIHRvIGJlIGVuYWJsZWQgaW4gdGhlIE1haW4gcHJvY2Vzcy5cclxuICAgICAgICAvLyBTZWUgXHVEODNEXHVEQzQ5IGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi12aXRlL3ZpdGUtcGx1Z2luLWVsZWN0cm9uLXJlbmRlcmVyXHJcbiAgICAgICAgcmVuZGVyZXI6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAndGVzdCdcclxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi12aXRlL3ZpdGUtcGx1Z2luLWVsZWN0cm9uLXJlbmRlcmVyL2lzc3Vlcy83OCNpc3N1ZWNvbW1lbnQtMjA1MzYwMDgwOFxyXG4gICAgICAgICAgPyB1bmRlZmluZWRcclxuICAgICAgICAgIDoge30sXHJcbiAgICAgIH0pIGFzIGFueVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGNhY2hlRGlyOiBpc1dlYk9ubHkgPyAnbm9kZV9tb2R1bGVzLy52aXRlLXdlYicgOiAnbm9kZV9tb2R1bGVzLy52aXRlLWVsZWN0cm9uJyxcclxuICAgIHBsdWdpbnMsXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgaW5jbHVkZTogW1xyXG4gICAgICAgICd2dWUnLFxyXG4gICAgICAgICdwaW5pYScsXHJcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxyXG4gICAgICAgICdheGlvcycsXHJcbiAgICAgICAgJ2RhdGUtZm5zJyxcclxuICAgICAgICAnZGF5anMnLFxyXG4gICAgICAgICdsdWNpZGUtdnVlLW5leHQnLFxyXG4gICAgICAgICd2dWUtaTE4bicsXHJcbiAgICAgICAgJ2Nsc3gnLFxyXG4gICAgICAgICd0YWlsd2luZC1tZXJnZScsXHJcbiAgICAgICAgJ3JhZGl4LXZ1ZScsXHJcbiAgICAgICAgJ3Jla2EtdWknXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIGhvc3Q6IHRydWUsXHJcbiAgICAgIHBvcnQ6IDUxNzMsXHJcbiAgICAgIGFsbG93ZWRIb3N0czogWydhcHAueXRyYy5jby50aCcsICdsb2NhbGhvc3QnLCAnMTIyLjE1NC40Ni4yMSddLFxyXG4gICAgfSxcclxuICAgIGRlZmluZToge1xyXG4gICAgICBfX0FQUF9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lm5wbV9wYWNrYWdlX3ZlcnNpb24pLFxyXG4gICAgfSxcclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1YsT0FBTyxTQUFTO0FBQ3RXLE9BQU8sVUFBVTtBQUNqQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGNBQWM7QUFKckIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxZQUFZLFFBQVEsSUFBSSxxQkFBcUI7QUFFbkQsUUFBTSxVQUFpQjtBQUFBLElBQ3JCLElBQUk7QUFBQSxJQUNKLFdBQVc7QUFBQSxNQUNULEtBQUs7QUFBQSxNQUNMLE1BQU0sQ0FBQyxnQkFBZ0I7QUFBQSxNQUN2QixXQUFXO0FBQUE7QUFBQSxRQUVULENBQUMsa0JBQWtCO0FBRWpCLGNBQUksY0FBYyxXQUFXLE9BQU8sS0FDbEMsY0FBYyxXQUFXLFFBQVEsS0FDakMsY0FBYyxXQUFXLFFBQVEsS0FDakMsY0FBYyxXQUFXLE9BQU8sS0FDaEMsY0FBYyxXQUFXLE9BQU8sS0FDaEMsY0FBYyxXQUFXLFFBQVEsS0FDakMsY0FBYyxXQUFXLE1BQU0sS0FDL0IsY0FBYyxXQUFXLE9BQU8sS0FDaEMsY0FBYyxXQUFXLE1BQU0sS0FDL0IsY0FBYyxXQUFXLE9BQU8sS0FDaEMsY0FBYyxX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

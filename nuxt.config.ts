import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { presetUno } from "unocss";
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  plugins: [{ src: "~/plugins/progress.ts", mode: "client" }],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    plugins: [
      AutoImport({
        imports: [
          {
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
  },
  modules: ["@unocss/nuxt", "nuxtjs-naive-ui", "@vueuse/nuxt"],
  unocss: {
    nuxtLayers: true,
    presets: [presetUno()],
  },
  css: ["@unocss/reset/tailwind-compat.css", "nprogress/nprogress.css","~/assets/css/main.css"],
});

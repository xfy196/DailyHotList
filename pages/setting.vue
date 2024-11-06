<script setup lang="ts">
import { useThemeVars } from "naive-ui";
import { useStorage } from "@vueuse/core";
import type { IRoute } from "~/types";
const themeVars = useThemeVars();
const icons: Record<string, string> = getIcons();
const bgPrimaryColor = themeVars.value.primaryColor;
const isDark = useDark();
const fixNavbar = useStorage("fixNavbar", false);
const hots = useStorage<Array<IRoute>>("hots", []);
const getLogo = (name: string) => {
  let url = icons[name.toLowerCase()];
  return url || "https://placehold.dtool.tech/64x64?text=avatar";
};
const getTitle = (name: string) => {
    return getHotTitle()[name] ?? ''
}
</script>

<template>
  <div class="">
    <n-scrollbar>
      <div
        class="border dark:border-[#ffffff17] p-3 rounded-sm flex justify-between items-center"
      >
        <n-text
          class="text-lg text-label flex items-center text-[#333639] dark:text-[white] font-bold before:content-[''] before:block before:w-1 before:h-5 before:flex before:items-center before:mr-2"
        >
          主题设置
        </n-text>
        <div>
          <n-switch v-model:value="isDark" :round="false" />
        </div>
      </div>
      <div
        class="border mt-2 dark:border-[#ffffff17] p-3 rounded-sm flex justify-between items-center"
      >
        <n-text
          class="text-lg text-label flex items-center text-[#333639] dark:text-[white] font-bold before:content-[''] before:block before:w-1 before:h-5 before:flex before:items-center before:mr-2"
        >
          固定导航栏
        </n-text>
        <div>
          <n-switch v-model:value="fixNavbar" :round="false" />
        </div>
      </div>
      <!-- 榜单排序和榜单开关 -->
      <div
        class="p-3 border mt-2 dark:border-[#ffffff17] rounded-sm flex flex-col"
      >
        <n-text
          class="text-lg text-label flex items-center text-[#333639] dark:text-[white] font-bold before:content-[''] before:block before:w-1 before:h-5 before:flex before:items-center before:mr-2"
        >
          榜单排序
        </n-text>
        <!-- 榜单列表 -->
        <div class="mt-2">
          <n-grid layout-shift-disabled x-gap="12" y-gap="12" :cols="4">
            <n-gi v-for="hot in hots" :key="hot.path">
              <div class="flex items-center justify-between px-2">
                <div class="flex items-center">
                  <n-avatar
                  size="small"
                    round
                    fallback-src="https://placehold.dtool.tech/64x64?text=avatar"
                    color="#fffff00"
                    :src="getLogo(hot.name)"
                  />
                  <span class="ml-2">{{ getTitle(hot.name) }}</span>
                </div>
                <n-switch v-model:value="hot.show" :round="false" />
              </div>
            </n-gi>
          </n-grid>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.text-label::before {
  background: v-bind(bgPrimaryColor);
}
</style>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { Refresh, Moon, Sun, Menu2 } from "@vicons/tabler";
import { Lunar } from "lunar-javascript";
const icons = useStorage("icons", {}, localStorage);
await useAsyncData("icons", () => $fetch("/api/hoticon"), {
  transform: (data: any) => {
    if (data.code === 200) {
      icons.value = data.data;
      return data.data;
    }
    icons.value = {};
    return {};
  },
});
const isDark = useDark();
const router = useRouter();
const toogleDark = useToggle(isDark);
const formatted = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");
const showAnimation = ref(false);
const handleScroll = (e: Event) => {
  if (e.target && e.target?.scrollTop > 0) {
    showAnimation.value = true;
  } else {
    showAnimation.value = false;
  }
};
const lunarTimeStr = computed(() => Lunar.fromDate(new Date()).toString());
const handleToHome = () => {
  router.push("/");
};
const handleRefresh = () => {
  window.location.reload();
};
</script>

<template>
  <n-layout
    :on-scroll="handleScroll"
    :native-scrollbar="false"
    class="h-screen"
  >
  
  <n-layout-header class="fixed top-0 z-50">
      <div
        :class="!showAnimation ? 'h-24' : 'h-18 border-b-2'"
        class="flex justify-evenly sm:px-6 md:px-10 lg:px-14 dark:border-b-[#ffffff17] dark: xl:px-16 2xl:px-20 px-4 items-center transition-all duration-300"
      >
        <div class="flex items-center flex-[0 0 auto]">
          <img class="w-16 h-16 rounded-full" src="https://placehold.dtool.tech/64x64?text=今日热点" alt="" />
          <div
            @click.stop="handleToHome"
            class="cursor-pointer ml-2 hidden sm:block"
          >
            <h1 class="text-xl text-[#333639] dark:text-[white] font-bold">
              今日热榜
            </h1>
            <h3 class="text-coolgray text-sm">立即吃瓜，热点一览无余</h3>
          </div>
        </div>
        <div
          class="flex-1 flex flex-col items-center justify-center items-center"
        >
          <div>
            {{ formatted }}
          </div>
          <div>
            {{ lunarTimeStr }}
          </div>
        </div>
        <div class="flex-[0 0 auto] hidden sm:flex justify-end items-center">
          <n-space>
            <n-popover trigger="hover">
              <template #trigger>
                <n-button @click.stop="handleRefresh" tertiary circle>
                  <template #icon>
                    <n-icon :size="24"><Refresh /></n-icon>
                  </template>
                </n-button>
              </template>
              刷新页面
            </n-popover>
            <n-popover trigger="hover">
              <template #trigger>
                <n-button @click.stop="toogleDark()" tertiary circle>
                  <template #icon>
                    <n-icon :size="24">
                      <Moon v-if="isDark" />
                      <Sun v-else />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ isDark ? "浅色模式" : "深色模式" }}
            </n-popover>
          </n-space>
        </div>
        <div class="block sm:hidden">
          <n-popover placement="left-start" trigger="click">
            <template #trigger>
              <n-button secondary circle>
                <template #icon>
                  <n-icon :size="24">
                    <Menu2 />
                  </n-icon>
                </template>
              </n-button>
            </template>
              <n-space vertical>
                <n-button @click.stop="handleRefresh" tertiary>
                  <template #icon>
                    <n-icon :size="24"><Refresh /></n-icon>
                  </template>
                  刷新
                </n-button>
                <n-button @click.stop="toogleDark()" tertiary>
                  <template #icon>
                    <n-icon :size="24">
                      <Moon v-if="isDark" />
                      <Sun v-else />
                    </n-icon>
                  </template>
                  {{ isDark ? "浅色模式" : "深色模式" }}
                </n-button>
              </n-space>
          </n-popover>
        </div>
      </div>
    </n-layout-header>
    <n-layout-content
      :native-scrollbar="false"
      class="sm:px-6 mt-2 md:px-10 lg:px-14 xl:px-16 2xl:px-20 px-4 pt-24"
    >
      <slot></slot>
    </n-layout-content>
    <!-- <n-layout-footer>成府路</n-layout-footer> -->
  </n-layout>
</template>

<style lang="scss" scoped></style>

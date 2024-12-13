<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { Refresh, Moon, Sun, Menu2, Settings } from "@vicons/tabler";
import { Lunar } from "lunar-javascript";
import type { IRoute } from "~/types";
// 是否固定导航栏
const fixNavbar = useStorage("fixNavbar", false);
const route = useRoute();
const isDark = useDark();
const router = useRouter();
const toogleDark = useToggle(isDark);
const formatted = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");
const showAnimation = ref(false);
const hots = useStorage<Array<IRoute>>("hots", []);
  const {refresh} = await useAsyncData(
    "all",
    () =>
      $fetch("https://hotapi.xxytime.top/all", {
        params: {
          cache: true,
        },
      }),
    {
      immediate: false,
      transform: (data: any) => {
        if (data.code === 200) {
          data.routes = data.routes.filter(
            (route: IRoute) =>
              route.path &&
              ![
                "/csdn",
                "/earthquake",
                "/genshin",
                "/honkai",
                "/starrail",
                "/netease-news",
              ].includes(route.path)
          );
          hots.value = data.routes.map((item: IRoute) => {
            item.show = true;
            item.title = "";
            return item;
          });
          return data;
        }
        return {
          routes: [],
          count: 0,
        };
      },
    }
  );

  onBeforeMount(() => {
    refresh()
  })
const handleScroll = (e: Event) => {
  if (e.target && e.target?.scrollTop > 0) {
    showAnimation.value = !fixNavbar.value;
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
      <n-el
        :class="!showAnimation ? 'h-24' : 'h-18 border-b-2'"
        class="flex justify-evenly sm:px-6 md:px-10 lg:px-14 dark:border-b-[#ffffff17] dark: xl:px-16 2xl:px-20 px-4 items-center transition-all duration-300"
      >
        <n-el
          @click.stop="handleToHome"
          class="flex items-center flex-[0 0 auto]"
        >
          <img
            class="w-16"
            src="/logo.png
            "
            alt=""
          />
          <n-el class="cursor-pointer ml-2 hidden sm:block">
            <n-el tag="h1" class="text-xl text-[#333639] dark:text-[white] font-bold">
              今日热榜
            </n-el>
            <h3 class="text-coolgray text-sm">立即吃瓜，热点一览无余</h3>
          </n-el>
        </n-el>
        <n-el
          class="flex-1 flex flex-col items-center justify-center items-center"
        >
          <n-el>
            {{ formatted }}
          </n-el>
          <n-el>
            {{ lunarTimeStr }}
          </n-el>
        </n-el>
        <n-el class="flex-[0 0 auto] hidden sm:flex justify-end items-center">
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
            <n-popover v-if="route.path !== '/setting'" trigger="hover">
              <template #trigger>
                <n-button @click.stop="router.push('/setting')" tertiary circle>
                  <template #icon>
                    <n-icon :size="24"><Settings /></n-icon>
                  </template>
                </n-button>
              </template>
              设置
            </n-popover>
          </n-space>
        </n-el>
        <!-- 移动端小屏幕下的样式 -->
        <n-el class="block sm:hidden">
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
              <n-button
                v-if="route.path !== '/setting'"
                @click.stop="router.push('/setting')"
                tertiary
              >
                <template #icon>
                  <n-icon :size="24"><Settings /></n-icon>
                </template>
                设置
              </n-button>
            </n-space>
          </n-popover>
        </n-el>
      </n-el>
    </n-layout-header>
    <n-layout-content
      :native-scrollbar="false"
      class="pb-2 sm:px-6 mt-2 md:px-10 lg:px-14 xl:px-16 2xl:px-20 px-4 pt-24"
    >
      <slot></slot>
    </n-layout-content>
    <!-- <n-layout-footer>成府路</n-layout-footer> -->
  </n-layout>
</template>

<style lang="scss" scoped></style>

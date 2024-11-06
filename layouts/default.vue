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
const hots = useStorage<Array<IRoute>>("hots", [], localStorage);
const hotData = [
  { name: "36kr", path: "/36kr", show: true, title: "36氪" },
  { name: "51cto", path: "/51cto", show: true, title: "51CTO" },
  { name: "acfun", path: "/acfun", show: true, title: "AcFun" },
  { name: "baidu", path: "/baidu", show: true, title: "百度" },
  { name: "bilibili", path: "/bilibili", show: true, title: "哔哩哔哩" },
  {
    name: "douban-group",
    path: "/douban-group",
    show: true,
    title: "豆瓣讨论",
  },
  {
    name: "douban-movie",
    path: "/douban-movie",
    show: true,
    title: "豆瓣电影",
  },
  { name: "douyin", path: "/douyin", show: true, title: "抖音" },
  {
    name: "hellogithub",
    path: "/hellogithub",
    show: true,
    title: "HelloGitHub",
  },
  { name: "history", path: "/history", show: true, title: "历史上的今天" },
  { name: "hupu", path: "/hupu", show: true, title: "虎扑" },
  { name: "huxiu", path: "/huxiu", show: true, title: "虎嗅" },
  { name: "ifanr", path: "/ifanr", show: true, title: "爱范儿" },
  {
    name: "ithome-xijiayi",
    path: "/ithome-xijiayi",
    show: true,
    title: "IT之家「喜加一」",
  },
  { name: "ithome", path: "/ithome", show: true, title: "IT之家" },
  { name: "jianshu", path: "/jianshu", show: true, title: "简书" },
  { name: "juejin", path: "/juejin", show: true, title: "稀土掘金" },
  { name: "lol", path: "/lol", show: true, title: "英雄联盟" },
  { name: "ngabbs", path: "/ngabbs", show: true, title: "NGA" },
  { name: "nodeseek", path: "/nodeseek", show: true, title: "NodeSeek" },
  { name: "qq-news", path: "/qq-news", show: true, title: "腾讯新闻" },
  { name: "sina-news", path: "/sina-news", show: true, title: "新浪新闻" },
  { name: "sina", path: "/sina", show: true, title: "新浪网" },
  { name: "sspai", path: "/sspai", show: true, title: "少数派" },
  { name: "thepaper", path: "/thepaper", show: true, title: "澎湃新闻" },
  { name: "tieba", path: "/tieba", show: true, title: "百度贴吧" },
  { name: "toutiao", path: "/toutiao", show: true, title: "今日头条" },
  { name: "v2ex", path: "/v2ex", show: true, title: "V2EX" },
  {
    name: "weatheralarm",
    path: "/weatheralarm",
    show: true,
    title: "中央气象台",
  },
  { name: "weibo", path: "/weibo", show: true, title: "微博" },
  { name: "weread", path: "/weread", show: true, title: "微信读书" },
  { name: "zhihu-daily", path: "/zhihu-daily", show: true, title: "知乎日报" },
  { name: "zhihu", path: "/zhihu", show: true, title: "知乎" },
];

await useAsyncData(
  "all",
  () =>
    $fetch("https://hotapi.xxytime.top/all", {
      params: {
        cache: true,
      },
    }),
  {
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
      <div
        :class="!showAnimation ? 'h-24' : 'h-18 border-b-2'"
        class="flex justify-evenly sm:px-6 md:px-10 lg:px-14 dark:border-b-[#ffffff17] dark: xl:px-16 2xl:px-20 px-4 items-center transition-all duration-300"
      >
        <div
          @click.stop="handleToHome"
          class="flex items-center flex-[0 0 auto]"
        >
          <img
            class="w-16 h-16 rounded-full"
            src="https://placehold.dtool.tech/64x64?text=今日热点"
            alt=""
          />
          <div class="cursor-pointer ml-2 hidden sm:block">
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
        </div>
        <!-- 移动端小屏幕下的样式 -->
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

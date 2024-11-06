<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { type ICardInfo, type IRoute } from "~/types";
import { Refresh } from "@vicons/tabler";
import { useThemeVars } from "naive-ui";
const { route } = defineProps<{
  route: IRoute;
}>();
const icons: Ref<Record<string, string>> = useStorage("icons", {});
const hots = useStorage<Array<IRoute>>("hots", []);
const router = useRouter();
const info = ref<ICardInfo>();
const loading = ref(false);
const error = ref(false);
const themeVars = useThemeVars();
const requestInfo = async () => {
  try {
    error.value = false;
    loading.value = true;
    const data: ICardInfo = await $fetch(
      `https://hotapi.xxytime.top${route.path}`,
      {
        params: {
          cache: true,
        },
      }
    );
    if (data.code === 200) {
      // 如果请求成功,需要同步hots对应的title
      info.value = data;
      const findIndex = hots.value.findIndex((item) => item.name === data.name);
      if (findIndex >= 0) {
        hots.value[findIndex].title = data.title;
      }
    }
  } catch (err) {
    error.value = true;
  } finally {
    loading.value = false;
  }
};
const handleRefresh = () => {
  requestInfo();
};
watch(
  () => route.path,
  async () => {
    requestInfo();
  },
  {
    immediate: true,
  }
);

const timeStatus = computed(() => {
  if (!info.value?.updateTime) {
    return "";
  }
  let gap = Date.now() - new Date(info.value?.updateTime).getTime();
  if (gap < 1000 * 60) {
    return "刚刚更新";
  }
  return Math.floor(gap / (1000 * 60)) + "分钟前更新";
});
const handleToList = () => {
  router.push({
    path: "/list",
    query: {
      type: route.name,
    },
  });
};
const getLogo = (name: string) => {
  return icons.value[name.toLowerCase()];
};
</script>

<template>
  <n-card class="cursor-pointer" @click.stop="handleToList">
    <template #header>
      <div class="flex items-center">
        <img
          v-if="info?.link && getLogo(route.name)"
          class="w-6 h-6 mr-2"
          :src="getLogo(route.name)"
          alt=""
        />
        <span class="truncate text-nowrap">{{ info?.title }}</span>
      </div>
    </template>
    <template #header-extra>
      <div class="min-w-8">
        <n-skeleton round v-if="loading" text :repeat="1" />
        <span v-else>
          {{ info?.type }}
        </span>
      </div>
    </template>
    <n-scrollbar v-if="!error" @click.stop class="min-h-64 max-h-64">
      <template v-if="loading">
        <n-skeleton round text :repeat="10" />
      </template>
      <ul v-else>
        <li
          class="first-of-type:mt-0 py-1 box-border"
          v-for="(hot, index) in info?.data"
          :key="hot.id"
        >
          <NuxtLink
            :to="hot.url"
            class="flex items-center"
            target="_blank"
            rel="noopener"
          >
            <div
              :class="{
                'bg-orange-500': index === 1,
                'bg-red-500': index === 0,
                'bg-yellow-500': index === 2,
                'bg-gray-300': index > 2,
              }"
              class="min-w-6 min-h-6 flex-[0 0 auto] flex items-center justify-center text-white rounded-md mr-2"
            >
              {{ index + 1 }}
            </div>
            <div
              class="hoverlink flex-[0 0 auto] line-height-normal border-b-4 border-b-transparent transition-all duration-500 hover:transform hover:translate-x-3"
            >
              {{ hot.title }}
            </div>
          </NuxtLink>
        </li>
      </ul>
    </n-scrollbar>
    <n-result
      v-else
      status="500"
      title="哎呀出错了"
      description="让瓜滚一会在来的路上了"
    >
      <template #footer>
        <n-button @click.stop="handleRefresh" secondary round>
          <template #icon>
            <n-icon>
              <Refresh />
            </n-icon>
          </template>
          重试
        </n-button>
      </template>
    </n-result>
    <template #footer>
      <div @click.stop class="flex justify-between items-center">
        <n-skeleton round v-if="error" text :repeat="1" />
        <template v-else>
          <div>
            {{ timeStatus }}
          </div>
          <n-button @click.stop="handleRefresh" tertiary strong circle>
            <template #icon>
              <n-icon>
                <Refresh />
              </n-icon>
            </template>
          </n-button>
        </template>
      </div>
    </template>
  </n-card>
</template>

<style lang="scss" scoped>
.hoverlink:hover {
  border-bottom-color: v-bind("themeVars.primaryColor");
}
</style>

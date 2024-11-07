<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import type { IRoute, IHotInfo } from "~/types";

interface INewRoute extends IRoute {
  checked: boolean;
}
const icons: Record<string, string> = getIcons();
const route = useRoute();
const router = useRouter();
const type = ref(route.query.type);
const { data: posts, status } = await useAsyncData(
  "hot",
  async () =>
    $fetch(`https://hotapi.xxytime.top/${type.value}`, {
      params: {
        cache: true,
      },
    }),
  {
    transform(data: any) {
      if (data.code === 200) {
        return data.data as IHotInfo[];
      }
      return [];
    },
    watch: [type],
  }
);
watch(
  () => route.query,
  (value) => {
    type.value = value.type;
  }
);

const hots = useStorage<Array<INewRoute>>("hots", []);
const handleToHotList = (path: string, name: string) => {
  router.replace({
    path: route.path,
    query: {
      type: name,
    },
  });
};
const getTagType = (name: string) =>
  type.value === name ? "primary" : "default";

const getLogo = (name: string) => {
  let url = icons[name.toLowerCase()];
  return url || "https://placehold.dtool.tech/64x64?text=avatar";
};
const getTitle = (name: string) => {
  return getHotTitle()[name] ?? "";
};

</script>

<template>
  <div class="pb-2">
    <div>
      <!-- tag的循环 -->
      <n-space>
        <n-tag
          @click.stop="handleToHotList(hot.path, hot.name)"
          :type="getTagType(hot.name)"
          size="large"
          round
          v-for="hot in hots"
          :key="hot.path"
        >
          <template #avatar>
            <n-avatar
              round
              fallback-src="https://placehold.dtool.tech/64x64?text=avatar"
              color="#fffff00"
              :src="getLogo(hot.name)"
            />
          </template>
          {{ getTitle(hot.name) }}
        </n-tag>
      </n-space>
    </div>
    <n-list class="mt-2" hoverable clickable>
      <n-skeleton
        height="24px"
        round
        v-if="status === 'pending'"
        text
        :repeat="20"
      />
      <n-list-item v-else v-for="(hot, index) in posts" :key="hot.id">
        <nuxt-link target="_blank" class="flex justify-between" :to="hot.url">
          <n-space>
            <div
              :class="{
                'bg-orange-500': index === 1,
                'bg-red-500': index === 0,
                'bg-yellow-500': index === 2,
                'bg-gray-300': index > 2,
              }"
              class="min-w-6 min-h-6 flex-[0 0 auto] flex items-center justify-center text-white rounded-md"
            >
              {{ index + 1 }}
            </div>
            <n-space vertical>
              <n-text class=" text-lg">
                {{ hot.title }}
              </n-text>
              <n-text v-if="hot.author"> 作者:{{ hot.author }} </n-text>
            </n-space>
          </n-space>
        </nuxt-link>
      </n-list-item>
    </n-list>
  </div>
</template>

<style lang="scss" scoped></style>

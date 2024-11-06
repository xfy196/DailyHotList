<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { type IRoute } from "~/types";
const hots = useStorage<Array<IRoute>>("hots", [], localStorage);
const { data }: { data: Ref<{ routes: IRoute[]; count: number }> } =
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
          hots.value = data.routes;
          return data;
        }
        return {
          routes: [],
          count: 0,
        };
      },
    }
  );
</script>

<template>
  <n-grid x-gap="16" y-gap="16" responsive="screen" cols="2xl:6 xl:5 l:4 m:3 s:2 1">
    <n-gi v-for="route in data?.routes" :key="route.path" :route="route">
      <HotCard :route="route" />
    </n-gi>
  </n-grid>
</template>

<style lang="scss" scoped></style>

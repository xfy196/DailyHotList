<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { type IRoute } from "~/types";
const hots = useStorage<Array<IRoute>>("hots", [], localStorage);
</script>

<template>
  <n-grid
    x-gap="16"
    y-gap="16"
    responsive="screen"
    cols="2xl:6 xl:5 l:4 m:3 s:2 1"
  >
    <n-gi
      v-for="route in hots.filter((hot) => hot.show)"
      :key="route.path"
      :route="route"
    >
      <HotCard :route="route" />
    </n-gi>
  </n-grid>
</template>

<style lang="scss" scoped></style>

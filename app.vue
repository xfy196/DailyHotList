<template>
    <n-config-provider inline-theme-disabled :theme="theme">
      <n-global-style />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </n-config-provider>
</template>
<script setup lang="ts">
import { darkTheme } from "naive-ui";
const isDark = useDark();
const theme = computed(() => (isDark.value ? darkTheme : null));
</script>

<template>
  <n-config-provider :theme="theme">
    <n-global-style />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </n-config-provider>
</template>
<script setup lang="ts">
import { darkTheme } from "naive-ui";
const isDark = useDark();
const theme = ref()
watch(() => isDark.value, (value) => {
  theme.value = value ? darkTheme : null
})
onMounted(() => {
  theme.value = isDark.value ? darkTheme : null
})
</script>

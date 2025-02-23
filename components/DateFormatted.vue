<template>
  <n-tooltip>
    <template #trigger>
      <n-time
        v-if="isOlderThanADay"
        :time="_date"
      />
      <n-time
        v-else-if="isOlderThanAYear"
        :time="_date"
        format="d MMM. y"
      />
      <n-time
        v-else
        :time="_date"
        :to="new Date()"
        type="relative"
      />
    </template>

    <n-time
      :time="_date"
      format="h:mm a - d MMM. y"
    />
  </n-tooltip>
</template>
<script setup lang="ts">
const { date } = defineProps<{ date: Date | string | number }>()

const _date = computed(() => new Date(date))
const isOlderThanADay = computed(() => (new Date()).getHours() - (_date.value.getHours()) >= 24)
const isOlderThanAYear = computed(() => (new Date().getFullYear() - (_date.value.getFullYear())) >= 1)

</script>
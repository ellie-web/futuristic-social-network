<template>
  <UTooltip :text="fullDate">
    <span>{{ formattedDate }}</span>
  </UTooltip>
</template>
<script setup lang="ts">
import { format, formatDistance } from 'date-fns'


const { date } = defineProps<{ date: Date | string | number }>()

const _date = computed(() => new Date(date))

const formattedDate = computed(() => {
  switch (true) {
    case ((new Date().getFullYear() - (_date.value.getFullYear())) >= 1):
      return format(_date.value, 'd MMM. y')
    case ((new Date()).getTime() - (_date.value.getTime()) >= 24 * 60 * 60 * 1000):
      return format(_date.value, 'd MMM.')
    default:
      return formatDistance(_date.value, new Date()) + ' ago'
  }
})

const fullDate = computed(() => format(_date.value, 'h:mm a - d MMM. y'))
</script>
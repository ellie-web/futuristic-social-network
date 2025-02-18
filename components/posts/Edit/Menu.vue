<template>
  <UDropdown
    v-model:open="isOpen"
    :items="items"
    :popper="{ placement: 'bottom-end' }"
  >
    <UButton
      @click.stop="toggleOpen"
      variant="ghost"
      icon="i-heroicons-ellipsis-horizontal-20-solid"
    />
  </UDropdown>
</template>
<script setup lang="ts">
type TProps = {
  id: number
}
const { id } = defineProps<TProps>()
const { updateIsEditing } = useIsEditing()

const isOpen = ref(false)
const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const items = [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: (e: Event) => {
      e.stopPropagation()
      updateIsEditing(true)
    }
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: async (e: Event) => {
      e.stopPropagation()
      await $fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      })
    }
  }]
]
</script>
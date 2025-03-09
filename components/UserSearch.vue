<template>
  <UForm
    ref="formRef"
    :state="state"
    :schema="schema"
    @submit="handleSubmit"
    class="relative w-80"
  >
    <UInput
      v-model="state.query"
      @focus="isPopoverOpen = true"
      icon="i-heroicons-magnifying-glass-20-solid"
      size="sm"
      color="white"
      placeholder="Search"
      class="w-full"
      autocomplete="off"
      :ui="{ icon: { trailing: { pointer: '' } } }"
    >
      <template #trailing>
        <UButton
          v-show="state.query !== ''"
          @click="state.query = ''"
          variant="link"
          color="gray"
          icon="i-heroicons-x-mark-20-solid"
        />
      </template>
    </UInput>

    <UCard
      v-if="isPopoverOpen"
      class="absolute top-9 w-full flex flex-col"
      :ui="{ body: { base: 'flex-1 flex flex-col', padding: 'px-0 py-0 sm:p-0' } }"
    >
      <UProgress
        v-if="isLoading"
        animation="carousel"
      />
      <UButton
        v-if="results.length > 0"
        v-for="user in results"
        :to="`/users/${user.username}`"
        @click="handlePopoverClose"
        variant="ghost"
        color="gray"
        class="w-full font-normal"
      >
        <template #leading>
          <UAvatar
            icon="i-heroicons-photo"
            size="sm"
            img-class="object-cover"
            :src="user.avatarUrl ? `/api/files?fileName=${user.avatarUrl}` : undefined"
          />
        </template>
        <div class="text-left ml-2">
          <p class="text-white">{{ user.name }}</p>
          <p class="text-gray-400">@{{ user.username }}</p>
        </div>
      </UButton>

      <p
        v-else-if="!isLoading && results.length === 0"
        class="m-auto py-6"
      >
        <template v-if="!state.query">Start typing to search users</template>
        <template v-else>No results for "{{ state.query }}"</template>
      </p>
    </UCard>
  </UForm>
</template>
<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { onClickOutside, watchDebounced } from '@vueuse/core'
import type IUser from '~/types/user'

const state = reactive({
  query: ''
})

const results = ref<IUser[]>([])
const isLoading = ref(false)
const isPopoverOpen = ref(false)

const formRef = useTemplateRef<HTMLElement>('formRef')

const schema = z.object({
  query: z.string()
})

type Schema = z.output<typeof schema>

const handlePopoverClose = () => {
  isPopoverOpen.value = false
}

onClickOutside(formRef, handlePopoverClose)

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (isLoading.value) return
  if (state.query === '') return

  isLoading.value = true

  try {
    const users = await $fetch('/api/users/search', {
      query: {
        query: state.query
      }
    })

    results.value = users
  }
  catch (err) {
    console.log(err)
  }

  isLoading.value = false
}

// FIXME: idk whats wrong here...
// probably just TS being weird?
watchDebounced(
  () => state.query,
  handleSubmit,
  { debounce: 200, maxWait: 500 }
)
</script>
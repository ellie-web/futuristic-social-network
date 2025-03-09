<template>
  <div class="fixed top-0 left-0 w-full h-full z-30">
    <div class="relative flex justify-center items-center h-full ">
      <div class="relative h-64 w-96 max-w-full z-20">

        <div class="flex justify-center items-center">
          <UButton
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="handleClose"
          />
        </div>

        <UCard>
          <template #header>
            Settings
          </template>

          <div>
            <UForm
              :state="state"
              :schema="schema"
              @submit="handleSubmit"
            >
              <UFormGroup name="name">
                <UInput
                  v-model="state.name"
                  placeholder="name"
                  :maxlength="45"
                >
                  <template #trailing>
                    <span class="text-xs text-gray-400">{{ state.name.length }}/45</span>
                  </template>
                </UInput>
              </UFormGroup>

              <UFormGroup name="bio">
                <UTextarea
                  v-model="state.bio"
                  placeholder="bio"
                  :maxlength="160"
                >
                  <template #trailing>
                    <span class="text-xs text-gray-400">{{ state.bio.length }}/160</span>
                  </template>
                </UTextarea>
              </UFormGroup>

              <div
                v-if="error"
                class="text-red-500"
              >
                {{ error }}
              </div>

              <UButton
                type="submit"
                class="!mt-10 mx-auto"
                :loading="isLoading"
              >
                Save
              </UButton>
            </UForm>
          </div>
        </UCard>
      </div>

      <div
        @click="handleClose"
        class="fixed top-0 left-0 w-full h-full z-10 bg-gray-800/75"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { z } from 'zod'
import type { Form, FormSubmitEvent } from '#ui/types'
import { userUpdateSchema } from '~/types/schema'

type TProps = {
  routeAfterClose: string
}

const { routeAfterClose } = defineProps<TProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const state = reactive(Object.assign({
  name: user.value?.name,
  bio: user.value?.bio || ''
}))

const isLoading = ref(false)
const error = ref<string | null>(null)

const schema = userUpdateSchema

type Schema = z.output<typeof schema>

const handleClose = async () => {
  return await navigateTo(routeAfterClose)
}

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  error.value = null

  try {
    isLoading.value = true

    const updatedUser = await $fetch(`/api/users/${user.value?.id}`, {
      method: 'PUT',
      body: {
        name: state.name,
        bio: state.bio
      }
    })

    handleClose()
  }
  catch (err: any) {
    error.value = err.statusMessage ? err.statusMessage : 'Error editing profile'
  }
  finally {
    isLoading.value = false
  }
}
</script>
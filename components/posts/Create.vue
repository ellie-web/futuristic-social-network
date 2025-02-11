<template>
  <div>
    <h2>Create a post</h2>
    <UForm
      ref="formRef"
      :state="state"
      :schema="schema"
      @submit.prevent="handleSubmit"
    >
      <UFormGroup name="content">
        <UTextarea v-model="state.content" />
      </UFormGroup>
      <div
        v-if="error"
        class="text-red-500"
      >
        {{ error }}
      </div>
      <UButton type="submit">post</UButton>
    </UForm>
  </div>

</template>
<script setup lang="ts">
import { z } from 'zod'
import type { Form, FormSubmitEvent } from '#ui/types'

const schema = z.object({
  content: z.string({
    required_error: 'Post content can`t be empty'
  })
    .max(480)
})

type Schema = z.output<typeof schema>

const stateDefault = {
  content: undefined
}

const state = reactive({ ...stateDefault })
const formRef = ref<Form<typeof state> | null>(null)

const isLoading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  error.value = null
  try {
    isLoading.value = true

    await $fetch('/api/posts', {
      method: 'POST',
      body: state
    })

    formRef.value?.clear()
    Object.assign(state, stateDefault)
  }
  catch (err: any) {
    error.value = err.statusMessage ? err.statusMessage : 'Error creating post'
  }
  finally {
    isLoading.value = false
  }
}
</script>
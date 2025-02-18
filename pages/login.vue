<template>
  <div>
    <h1>login page</h1>
    <UForm
      ref="formRef"
      :state="state"
      :schema="schema"
      @submit.prevent="handleSubmit"
    >
      <UFormGroup name="email">
        <UInput
          v-model="state.email"
          name="email"
          autocomplete="email"
          placeholder="Email*"
        />
      </UFormGroup>
      <UFormGroup name="password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Password*"
        />
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
        Submit
      </UButton>
    </UForm>
  </div>
</template>
<script setup lang="ts">
import { z } from 'zod'
import type { Form, FormSubmitEvent } from '#ui/types'

definePageMeta({
  pageTransition: {
    name: 'slide-fade',
    mode: 'in-out'
  },
  middleware: [
    'auth-redirect',
    (to, from) => {
      console.log('login m', to, from)
      if ((to.meta.pageTransition && typeof to.meta.pageTransition !== 'boolean') && from.meta.pageTransition && typeof from.meta.pageTransition !== 'boolean') {
        if (from.path === 'register') {
          to.meta.pageTransition.name = 'slide-right'
        }
        else {
          to.meta.pageTransition.name = 'slide-left'
        }
      }
    }]
})

const schema = z.object({
  email: z.string({ required_error: 'Required field' }).email('Please enter a valid email'),
  password: z.string({ required_error: 'Required field' })
})

type Schema = z.output<typeof schema>

const stateDefault = {
  email: undefined,
  password: undefined
}

const state = reactive({ ...stateDefault })
const formRef = ref<Form<typeof state> | null>(null)

const isLoading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  error.value = null

  try {
    isLoading.value = true

    const { login } = useUserStore()

    await login(event.data)

    formRef.value?.clear()
    Object.assign(state, stateDefault)
  }
  catch (err: any) {
    error.value = err.statusMessage ? err.statusMessage : 'Error logging in'
  }
  finally {
    isLoading.value = false
  }
}
</script>
<template>
  <div class="flex-1">
    <h1>register page</h1>
    <UForm
      ref="formRef"
      :state="state"
      :schema="schema"
      @submit.prevent="handleSubmit"
    >
      <UFormGroup name="name">
        <UInput
          v-model="state.name"
          placeholder="Name"
        />
      </UFormGroup>
      <UFormGroup name="email">
        <UInput
          v-model="state.email"
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
      console.log('register m', to, from)
      if ((to.meta.pageTransition && typeof to.meta.pageTransition !== 'boolean') && from.meta.pageTransition && typeof from.meta.pageTransition !== 'boolean') {
        if (from.path === 'login') {
          to.meta.pageTransition.name = 'slide-left'
        }
        else {
          to.meta.pageTransition.name = 'slide-right'
        }
      }
    }]
})

const schema = z.object({
  name: z.string().optional().or(z.literal('')),
  email: z.string({ required_error: 'Required field' }).email('Please enter a valid email'),
  password: z.string({ required_error: 'Required field' })
})

type Schema = z.output<typeof schema>

const stateDefault = {
  email: undefined,
  name: undefined,
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

    await $fetch('/api/register', {
      method: 'POST',
      body: state
    })

    formRef.value?.clear()
    Object.assign(state, stateDefault)

    // refresh the session status now that the user is logged in
    const { fetchSession, refreshUser } = useUserStore()
    await fetchSession()
    await refreshUser()
    await navigateTo('/')
  }
  catch (err: any) {
    error.value = err.statusMessage ? err.statusMessage : 'Error registering user'
  }
  finally {
    isLoading.value = false
  }
}
</script>
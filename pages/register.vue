<template>
  <div>
    <h1>register page</h1>
    <UForm
      ref="formRef"
      :state="state"
      :schema="schema"
      @submit.prevent="handleSubmit"
      @error="onError"
    >

      <UFormGroup name="email">
        <UInput
          v-model="state.email"
          placeholder="email*"
        />
      </UFormGroup>
      <UFormGroup name="username">
        <UInput
          v-model="state.username"
          placeholder="username*"
        />
      </UFormGroup>
      <UFormGroup name="name">
        <UInput
          v-model="state.name"
          placeholder="name"
        />
      </UFormGroup>
      <UFormGroup name="password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="password*"
        />
      </UFormGroup>
      <UFormGroup name="passwordRepeat">
        <UInput
          v-model="state.passwordRepeat"
          type="password"
          placeholder="repeat the password*"
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
import type { Form, FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { userCreateSchema } from '~/types/schema'

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

const schema = userCreateSchema
  .extend({ passwordRepeat: z.string() })
  .refine(data => data.password === data.passwordRepeat,
    {
      message: 'Passwords must match',
      path: ['passwordRepeat']
    }
  )

type Schema = z.output<typeof schema>

const stateDefault = {
  email: undefined,
  name: undefined,
  username: undefined,
  password: undefined,
  passwordRepeat: undefined
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
      body: {
        email: state.email,
        name: state.name,
        username: state.username,
        password: state.password
      }
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

async function onError(event: FormErrorEvent) {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
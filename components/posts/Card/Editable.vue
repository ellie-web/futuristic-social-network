<template>
  <UForm
    ref="formRef"
    :state="state"
    :schema="schema"
    @submit.prevent="handleSubmit"
  >
    <UCard
      as="article"
      class="block"
    >
      <template #header>
        <div class="flex items-center">
          <ULink
            :to="`/users/${data.author.username}`"
            class="flex items-center"
          >
            <UAvatar
              :src="avatarUrl"
              icon="i-heroicons-photo"
              class="mr-3"
              img-class="object-cover"
            />
            <span class="mr-2">{{ data.author.name }}</span>
            <span class="text-gray-400">@{{ data.author.username }}</span>
          </ULink>

          <!-- <div
          v-if="isCurrentUser"
          class="ml-auto"
        >
          <PostsEditMenu :id="data.id" />
        </div> -->
        </div>
      </template>

      <UFormGroup name="content">
        <UTextarea v-model="state.content" />
      </UFormGroup>

      <template #footer>
        <div class="flex justify-end items-center gap-5">
          <UButton
            @click="handleCancel"
            variant="outline"
          >
            cancel editing
          </UButton>
          <UButton
            type="submit"
            :loading="isLoading"
          >
            post
          </UButton>
        </div>
      </template>
    </UCard>
  </UForm>
</template>
<script setup lang="ts">
import type { IFeedPost } from '~/types/feed'
import { z } from 'zod'
import type { Form, FormSubmitEvent } from '#ui/types'

type TProps = {
  data: IFeedPost
}

const { data } = defineProps<TProps>()

const postsStore = usePostsStore()

const schema = z.object({
  content: z.string({
    required_error: 'Post content can`t be empty'
  })
    .max(480)
})

type Schema = z.output<typeof schema>

const state = reactive({ ...data })
const formRef = ref<Form<typeof state> | null>(null)

const isLoading = ref(false)
const error = ref<string | null>(null)

const { updateIsEditing } = useIsEditing()

const avatarUrl = computed(() => data.author.avatarUrl ? `/api/files?fileName=${data.author.avatarUrl}` : undefined)

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  error.value = null
  try {
    isLoading.value = true

    const updatedPost = await $fetch(`/api/posts/${data.id}`, {
      method: 'PUT',
      body: state
    })

    formRef.value?.clear() // clear form error state
    updateIsEditing(false) // close editable card and show readonly card 
    postsStore.updatePostById(updatedPost.id, updatedPost) // update corresponding post in store
  }
  catch (err: any) {
    error.value = err.statusMessage ? err.statusMessage : 'Error updating post'
  }
  finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  updateIsEditing(false)
}
</script>
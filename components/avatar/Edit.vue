<template>
  <div>
    <UAvatar
      :src="avatarUrl"
      icon="i-heroicons-photo"
      size="3xl"
      img-class="object-cover"
    />
    <UButton @click="openModal">Edit</UButton>
  </div>
  <UModal v-model="isModalOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h1>Change your avatar</h1>
          <UButton
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="closeModal"
          />
        </div>
      </template>

      <div>
        <UInput
          ref="fileInputRef"
          :key="fileInputKey.toString()"
          type="file"
          size="sm"
          icon="i-heroicons-folder"
          accept="image/*"
          @input="handleValidatedFileInput"
        />
        <p>Maximum image size: 5mb</p>
        <template v-if="files[0] && files[0].content">
          <div class="w-full relative">
            <cropper
              ref="cropperRef"
              :src="files[0].content"
              :stencil-props="{
                handlers: {},
                movable: false,
                resizable: false,
              }"
              :stencil-size="({ boundaries }: any) => {
                return {
                  width: boundaries.width,
                  height: boundaries.height,
                }
              }"
              :stencil-component="CircleStencil"
              image-restriction="stencil"
            />
          </div>
        </template>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-5">
          <UButton
            variant="outline"
            @click="closeModal"
          >
            cancel
          </UButton>
          <UButton
            :disabled="!files[0] || !files[0].content"
            @click="handleUploadAvatar"
          >
            upload avatar
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
<script setup lang="ts">
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { fileTypeFromBlob } from 'file-type'

const FILE_TYPES = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'image/x-icon',
]

const SIZE_LIMIT = 5242880

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { handleFileInput, files } = useFileStorage()
const { showError } = useErrorToast()
const toast = useToast()

const isModalOpen = ref(false)
const cropperRef = useTemplateRef('cropperRef')
const fileInputKey = ref(new Date())

const avatarUrl = computed(() => user.value?.avatarUrl ? `/api/files?fileName=${user.value.avatarUrl}` : undefined)

const handleValidatedFileInput = async (event: any) => {
  let _files = event.target.files
  console.log(_files)

  const type = await fileTypeFromBlob(_files[0])

  if (!type || !FILE_TYPES.includes(type.mime) || _files[0].size > SIZE_LIMIT) {
    _files = null
    fileInputKey.value = new Date()
    clearFiles()
    return showError({ message: 'Unable to upload the file' })
  }

  await handleFileInput(event)
}

const cleanup = () => {
  fileInputKey.value = new Date()
  clearFiles()
  cropperRef.value?.reset()
}

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  cleanup()
}

const clearFiles = () => {
  files.value = []
}

const handleUploadAvatar = async () => {
  if (!cropperRef.value) return
  try {
    const { canvas } = cropperRef.value.getResult()
    canvas?.toBlob(async blob => {
      if (!blob) {
        throw createError('Error resizing the image')
      }

      const reader = new FileReader()

      reader.onloadend = async () => {
        const toUpload = {
          name: files.value[0].name,
          size: blob.size,
          type: blob.type,
          lastModified: new Date(),
          content: reader.result
        }

        await $fetch(`/api/users/${user.value?.id}/avatar/upload`, {
          method: 'POST',
          body: {
            file: toUpload
          }
        })

        userStore.refreshUser()
        toast.add({
          icon: 'i-heroicons-check',
          description: 'Avatar updated successfully'
        })
        closeModal()
      }

      reader.readAsDataURL(blob)

    }, files.value[0].type)

  }
  catch (err) {
    clearFiles()
    showError({ message: 'Error uploading the image' })
  }
}
</script>
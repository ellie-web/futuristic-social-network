import type { InjectionKey } from 'vue'

const isEditingKey = Symbol() as InjectionKey<{
  isEditing: Ref<boolean>,
  updateIsEditing: (val: boolean) => {}
}>

export const useIsEditing = () => {
  const injected = inject(isEditingKey)

  if (!injected) {
    throw createError('No variable provided')
  }

  return { 
    isEditing: injected.isEditing, 
    updateIsEditing: injected.updateIsEditing
  }
}

export const provideIsEditing = (isEditing: Ref<boolean>) => {
  provide(isEditingKey, {
    isEditing, 
    updateIsEditing: (val: boolean) => isEditing.value = val
  })
}
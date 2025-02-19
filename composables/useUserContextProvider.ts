import type { InjectionKey } from 'vue'
import type { TUserContext } from '~/types/user'

const userContextKey = Symbol() as InjectionKey<{
  userContext: Ref<TUserContext | null>
}>

export const useUserContext = () => {
  const injected = inject(userContextKey)

  if (!injected) {
    console.log('No user context provided')
  }

  return { 
    userContext: injected?.userContext
  }
}

export const provideUserContext = (userContext: Ref<TUserContext | null>) => {
  provide(userContextKey, {
    userContext
  })
}
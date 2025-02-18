import type { RouterConfig } from '@nuxt/schema'
import { isChangingPage } from '#app/components/utils.js'
import type { RouteLocationNormalizedGeneric } from 'vue-router'

function _getHashElementScrollMarginTop(selector: string) {
  try {
      const elem = document.querySelector(selector)
      if (elem) {
          return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
      }
  } catch {}
  return 0
}

// export default {
//   scrollBehavior (to, from, savedPosition) {
//     return false
//   }
// } satisfies RouterConfig


export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // TODO: move route names to some special file
    const noScrollRoutes = [
      {
        parent: 'index',
        child: 'index-posts-id'
      },
      {
        parent: 'users-userId',
        child: 'users-userId-posts-postId'
      }
    ]
    // const noScrollRoutes = ['index-posts-id', 'users-userId-posts-postId']

    const isChanginBetweenParentAndChildRoutes = () => {
      const isParentToChild = noScrollRoutes.find(r => r.parent === from.name && r.child === to.name)
      const isChildToParent = noScrollRoutes.find(r => r.parent === to.name && r.child === from.name)

      return isParentToChild || isChildToParent
    }

    if (isChanginBetweenParentAndChildRoutes()) {
      console.log('no scroll!!')
      return false
    }

    const nuxtApp = useNuxtApp()
    // @ts-ignore
    const behavior = useRouter().options?.scrollBehaviorType ?? 'auto'
    let position = savedPosition || void 0
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === 'function' ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop


    if (!position && from && to && routeAllowsScrollToTop !== false && isChangingPage(to, from)) {
      position = {
        left: 0,
        top: 0
      }
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return {
          left: 0,
          top: 0
        }
      }
      if (to.hash) {
        return {
          el: to.hash,
          top: _getHashElementScrollMarginTop(to.hash),
          behavior
        }
      }
      return false
    }

    const hasTransition = (route: RouteLocationNormalizedGeneric) => !!(route.meta.pageTransition)
    const hookToWait = hasTransition(from) && hasTransition(to) ? 'page:transition:finish' : 'page:finish'
    return new Promise( (resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await new Promise( (resolve2) => setTimeout(resolve2, 0))
        if (to.hash) {
          position = {
            el: to.hash,
            top: _getHashElementScrollMarginTop(to.hash),
            behavior
          }
        }
        resolve(position)
      })
    })
  }
}
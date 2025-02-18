// No transition to start, set default to true.
const transitionState = reactive({
  transitionComplete: false
})

export const useTransition = () => {
  const toggleTransitionComplete = (value: any) => {
    transitionState.transitionComplete = value
  }

  return {
    transitionState,
    toggleTransitionComplete,
  }
}
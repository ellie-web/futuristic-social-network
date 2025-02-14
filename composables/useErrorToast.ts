type TShowErrorArgs = {
  message: string
}

export default function() {
  const toast = useToast()

  const showError = ({message}: TShowErrorArgs) => {
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      description: message
    })
  }

  return {
    showError
  }
}
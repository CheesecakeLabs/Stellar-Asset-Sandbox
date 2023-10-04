export const toBase64 = (file: File): Promise<unknown> => {
  return new Promise(resolve => {
    let baseURL
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (): void => {
      baseURL = reader.result as string
      resolve(baseURL.split(',')[1])
    }
  })
}

export const base64ToImg = (base64: string | undefined): string => {
  return `data:image/jpeg;base64,${base64}`
}

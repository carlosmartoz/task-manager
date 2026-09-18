// Downloads a piece of text as a file, without leaving the page.
export function downloadFile(filename: string, text: string, type: string): void {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.click()

  // Revoking synchronously cancels the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

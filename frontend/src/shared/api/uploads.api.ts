type StrapColorGroup = 'leather' | 'stitching' | 'edge' | 'buckle' | 'adapter' | 'strap' | 'frame' | 'common'

type UploadStrapColorPayload = {
  file: File
  group: StrapColorGroup
  view: 'view1' | 'view2' | 'view3' | 'icon' | 'butterfly'
  colorTitle?: string
}

export type UploadStrapColorResponse = {
  success: boolean
  url: string
}

export const uploadStrapColorImage = async ({
  file,
  group,
  view,
  colorTitle
}: UploadStrapColorPayload): Promise<UploadStrapColorResponse> => {
  const formData = new FormData()
  formData.append('group', group)
  formData.append('view', view)
  if (colorTitle) {
    formData.append('colorTitle', colorTitle)
  }
  formData.append('file', file)

  const response = await fetch('/api/uploads/strap-color', {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Upload failed')
    throw new Error(errorText)
  }

  return response.json()
}



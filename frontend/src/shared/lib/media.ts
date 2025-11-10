const DEFAULT_MEDIA_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.slavalarionov.store'
    : 'http://localhost:8081'

const trimSlashes = (value: string, position: 'start' | 'end' | 'both' = 'both') => {
  if (position === 'start') {
    return value.replace(/^\/+/, '')
  }
  if (position === 'end') {
    return value.replace(/\/+$/, '')
  }
  return value.replace(/^\/+/, '').replace(/\/+$/, '')
}

export const getMediaBaseUrl = (): string => {
  const envBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
  if (envBase && envBase.trim().length > 0) {
    return trimSlashes(envBase.trim(), 'end')
  }
  return DEFAULT_MEDIA_BASE_URL
}

export const resolveMediaUrl = (src?: string | null): string | undefined => {
  if (!src) return undefined
  const trimmed = src.trim()
  if (!trimmed) return undefined

  if (/^(data:|blob:)/i.test(trimmed)) {
    return trimmed
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  const baseUrl = getMediaBaseUrl()

  if (trimmed.startsWith('/')) {
    return `${baseUrl}${trimmed}`
  }

  return `${baseUrl}/${trimSlashes(trimmed, 'start')}`
}



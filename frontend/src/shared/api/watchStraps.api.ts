import { Strap, StrapParams, StrapBaseImage } from '../store/configurator.store'

const API_URL = '/api/watch-straps'

export interface WatchStrapDB {
  id: number
  strap_name: string
  strap_title: string
  strap_description?: string | null
  strap_short_description?: string | null
  price: number
  preview_image?: string | null
  ultra_preview_image?: string | null
  has_buckle_butterfly: boolean
  buckle_butterfly_price: number
  buckle_butterfly_image?: string | null
  strap_params: StrapParams
  base_images?: StrapBaseImage[]
  createdAt: string
  updatedAt: string
}

export interface CreateWatchStrapData {
  strap_name: string
  strap_title: string
  strap_description?: string
  strap_short_description?: string
  price: number
  preview_image?: string
  ultra_preview_image?: string
  has_buckle_butterfly?: boolean
  buckle_butterfly_price?: number
  buckle_butterfly_image?: string
  strap_params: StrapParams
}

// Преобразование из формата БД в формат store
export const mapDBToStore = (dbStrap: WatchStrapDB): Strap => ({
  choosen: false,
  dataFetched: true,
  attributes: {
    watch_strap: {
      id: dbStrap.id,
      strap_name: dbStrap.strap_name,
      strap_title: dbStrap.strap_title,
      strap_description: dbStrap.strap_description || undefined,
      strap_short_description: dbStrap.strap_short_description || undefined,
      price: dbStrap.price,
      preview_image: dbStrap.preview_image || undefined,
      ultra_preview_image: dbStrap.ultra_preview_image || undefined,
      has_buckle_butterfly: dbStrap.has_buckle_butterfly,
      buckle_butterfly_choosen: false,
      buckle_butterfly_price: dbStrap.buckle_butterfly_price,
      buckle_butterfly_image: dbStrap.buckle_butterfly_image || undefined,
      strap_params: {
        ...dbStrap.strap_params,
        has_buckle_butterfly:
          dbStrap.strap_params?.has_buckle_butterfly ?? dbStrap.has_buckle_butterfly
      },
      base_images: dbStrap.base_images || []
    }
  }
})

// Преобразование из формата store в формат для API
export const mapStoreToAPI = (storeStrap: Strap): CreateWatchStrapData => ({
  strap_name: storeStrap.attributes.watch_strap.strap_name,
  strap_title: storeStrap.attributes.watch_strap.strap_title,
  strap_description: storeStrap.attributes.watch_strap.strap_description,
  strap_short_description: storeStrap.attributes.watch_strap.strap_short_description,
  price: storeStrap.attributes.watch_strap.price,
  preview_image: storeStrap.attributes.watch_strap.preview_image,
  ultra_preview_image: storeStrap.attributes.watch_strap.ultra_preview_image,
  has_buckle_butterfly: !!storeStrap.attributes.watch_strap.has_buckle_butterfly,
  buckle_butterfly_price: storeStrap.attributes.watch_strap.buckle_butterfly_price,
  buckle_butterfly_image: storeStrap.attributes.watch_strap.buckle_butterfly_image,
  strap_params: {
    ...storeStrap.attributes.watch_strap.strap_params,
    has_buckle_butterfly:
      storeStrap.attributes.watch_strap.has_buckle_butterfly ??
      storeStrap.attributes.watch_strap.strap_params?.has_buckle_butterfly
  }
})

export const watchStrapsApi = {
  async getAll(): Promise<Strap[]> {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Failed to fetch watch straps')
    const data: WatchStrapDB[] = await response.json()
    return data.map(mapDBToStore)
  },

  async getOne(id: number): Promise<Strap> {
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) throw new Error('Failed to fetch watch strap')
    const data: WatchStrapDB = await response.json()
    return mapDBToStore(data)
  },

  async create(strap: Strap): Promise<Strap> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapStoreToAPI(strap))
    })
    if (!response.ok) throw new Error('Failed to create watch strap')
    const data: WatchStrapDB = await response.json()
    return mapDBToStore(data)
  },

  async update(id: number, strap: Strap): Promise<Strap> {
    const payload = mapStoreToAPI(strap)
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('watchStrapsApi.update payload', id, payload)
    }
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) throw new Error('Failed to update watch strap')
    const data: WatchStrapDB = await response.json()
    return mapDBToStore(data)
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete watch strap')
  },

  async backup(): Promise<{ timestamp: string; data: WatchStrapDB[] }> {
    const response = await fetch(`${API_URL}/backup`)
    if (!response.ok) throw new Error('Failed to create backup')
    return response.json()
  },

  async restore(backupData: WatchStrapDB[]): Promise<{ success: boolean; restoredCount: number }> {
    const response = await fetch(`${API_URL}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: backupData })
    })
    if (!response.ok) throw new Error('Failed to restore from backup')
    return response.json()
  }
}



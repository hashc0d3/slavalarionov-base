import { WatchModel } from '../store/configurator.store'

const API_URL = '/api/watch-models'

export interface WatchModelDB {
  id: number
  model_name: string
  watch_model_name: string
  watch_model_manufacturer?: string | null
  main_image?: string | null
  createdAt: string
  updatedAt: string
  watch_sizes: { id: number; watch_size: string; watchModelId: number }[]
  frame_colors: {
    id: number
    color_name: string
    color_code?: string | null
    view1Image?: string | null
    view2Image?: string | null
    view3Image?: string | null
    watchModelId: number
  }[]
  available_straps?: { id: number; watchModelId: number; watchStrapId: number; watchStrap: any }[]
}

export interface CreateWatchModelData {
  model_name: string
  watch_model_name: string
  watch_model_manufacturer?: string
  main_image?: string
  watch_sizes: { watch_size: string }[]
  frame_colors: {
    color_name: string
    color_code?: string
    view_images?: {
      view1?: string
      view2?: string
      view3?: string
    }
  }[]
  available_strap_ids?: number[]
}

// Преобразование из формата БД в формат store
export const mapDBToStore = (dbModel: WatchModelDB): WatchModel => ({
  id: dbModel.id, // Включаем ID для возможности удаления и обновления
  model_name: dbModel.model_name,
  watch_model_name: dbModel.watch_model_name,
  watch_model_manufacturer: dbModel.watch_model_manufacturer || undefined,
  main_image: dbModel.main_image || undefined,
  choosen: false,
  watch_sizes: dbModel.watch_sizes.map(s => ({
    watch_size: s.watch_size,
    choosen: false
  })),
  frame_colors: dbModel.frame_colors.map(c => ({
    color_name: c.color_name,
    color_code: c.color_code || undefined,
    choosen: false,
    view_images: {
      view1: c.view1Image || undefined,
      view2: c.view2Image || undefined,
      view3: c.view3Image || undefined
    }
  })),
  available_strap_ids: dbModel.available_straps?.map(s => s.watchStrapId) || []
})

// Преобразование из формата store в формат для API
export const mapStoreToAPI = (storeModel: WatchModel): CreateWatchModelData => ({
  model_name: storeModel.model_name,
  watch_model_name: storeModel.watch_model_name,
  watch_model_manufacturer: storeModel.watch_model_manufacturer,
  main_image: storeModel.main_image,
  watch_sizes: storeModel.watch_sizes.map(s => ({ watch_size: s.watch_size })),
  frame_colors: storeModel.frame_colors.map(c => ({
    color_name: c.color_name,
    color_code: c.color_code,
    view_images: c.view_images
  })),
  available_strap_ids: storeModel.available_strap_ids || []
})

export const watchModelsApi = {
  async getAll(): Promise<WatchModel[]> {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Failed to fetch watch models')
    const data: WatchModelDB[] = await response.json()
    return data.map(mapDBToStore)
  },

  async getOne(id: number): Promise<WatchModel> {
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) throw new Error('Failed to fetch watch model')
    const data: WatchModelDB = await response.json()
    return mapDBToStore(data)
  },

  async create(model: WatchModel): Promise<WatchModel> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapStoreToAPI(model))
    })
    if (!response.ok) throw new Error('Failed to create watch model')
    const data: WatchModelDB = await response.json()
    return mapDBToStore(data)
  },

  async update(id: number, model: WatchModel): Promise<WatchModel> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapStoreToAPI(model))
    })
    if (!response.ok) throw new Error('Failed to update watch model')
    const data: WatchModelDB = await response.json()
    return mapDBToStore(data)
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete watch model')
  },

  async backup(): Promise<{ timestamp: string; data: WatchModelDB[] }> {
    const response = await fetch(`${API_URL}/backup`)
    if (!response.ok) throw new Error('Failed to create backup')
    return response.json()
  },

  async restore(backupData: WatchModelDB[]): Promise<{ success: boolean; restoredCount: number }> {
    const response = await fetch(`${API_URL}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: backupData })
    })
    if (!response.ok) throw new Error('Failed to restore from backup')
    return response.json()
  }
}


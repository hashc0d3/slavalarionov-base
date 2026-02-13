const API_URL = '/api/colors'

export interface Color {
  id: number
  technical_name: string
  display_name: string
  hex_code: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateColorDto {
  technical_name: string
  display_name: string
  hex_code: string
}

export interface UpdateColorDto {
  technical_name?: string
  display_name?: string
  hex_code?: string
}

export const colorsApi = {
  async getAll(): Promise<Color[]> {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Failed to fetch colors')
    return response.json()
  },

  async getOne(id: number): Promise<Color> {
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) throw new Error('Failed to fetch color')
    return response.json()
  },

  async create(data: CreateColorDto): Promise<Color> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create color')
    return response.json()
  },

  async update(id: number, data: UpdateColorDto): Promise<Color> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update color')
    return response.json()
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to delete color')
    }
  },
}


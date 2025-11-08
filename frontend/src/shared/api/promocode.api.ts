const API_URL = '/api/promocodes'

export interface PromoCode {
  id: number
  code: string
  discountPercent: number | null
  discountAmount: number | null
  activationsLeft: number
  createdAt: string
  updatedAt: string
}

export interface CreatePromoCodeRequest {
  code: string
  discountPercent?: number
  discountAmount?: number
  activationsLeft: number
}

export interface UpdatePromoCodeRequest {
  code?: string
  discountPercent?: number
  discountAmount?: number
  activationsLeft?: number
}

export interface CheckPromoCodeResponse {
  promoFound: boolean
  type: 'percent' | 'ruble' | null
  discountValue: number
  code: string
  message?: string
}

export const promocodeApi = {
  async getAll(): Promise<PromoCode[]> {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Failed to fetch promo codes')
    return response.json()
  },

  async getById(id: number): Promise<PromoCode> {
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) throw new Error('Failed to fetch promo code')
    return response.json()
  },

  async create(data: CreatePromoCodeRequest): Promise<PromoCode> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create promo code')
    }
    return response.json()
  },

  async update(id: number, data: UpdatePromoCodeRequest): Promise<PromoCode> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update promo code')
    }
    return response.json()
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete promo code')
  },

  async check(code: string): Promise<CheckPromoCodeResponse> {
    const response = await fetch(`${API_URL}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to check promo code')
    }
    return response.json()
  },

  async backup(): Promise<{ timestamp: string; data: PromoCode[] }> {
    const response = await fetch(`${API_URL}/backup`)
    if (!response.ok) throw new Error('Failed to backup promo codes')
    return response.json()
  },

  async restore(data: PromoCode[]): Promise<{ success: boolean; restoredCount: number }> {
    const response = await fetch(`${API_URL}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to restore promo codes')
    }
    return response.json()
  }
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

export const cmsApi = {
  async getWatchModels() {
    try {
      const response = await fetch(`${API_BASE_URL}/cms/watch-models`)
      if (!response.ok) {
        throw new Error('Failed to fetch watch models')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching watch models:', error)
      return []
    }
  },

  async getWatchStraps() {
    try {
      const response = await fetch(`${API_BASE_URL}/cms/watch-straps`)
      if (!response.ok) {
        throw new Error('Failed to fetch watch straps')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching watch straps:', error)
      return []
    }
  },

  async getStrapParams(strapId: number | string) {
    try {
      const response = await fetch(`${API_BASE_URL}/cms/strap-params/${strapId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch strap params')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching strap params:', error)
      return null
    }
  },

  async getAdditionalOptions() {
    try {
      const response = await fetch(`${API_BASE_URL}/cms/additional-options`)
      if (!response.ok) {
        throw new Error('Failed to fetch additional options')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching additional options:', error)
      return null
    }
  },

  async validatePromoCode(code: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/cms/validate-promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
      if (!response.ok) {
        throw new Error('Failed to validate promo code')
      }
      return await response.json()
    } catch (error) {
      console.error('Error validating promo code:', error)
      return {
        promoFound: false,
        type: null,
        value: 0,
        minOrderAmount: 0,
      }
    }
  },

  async incrementPromoUsage(code: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/cms/increment-promo-usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
      if (!response.ok) {
        throw new Error('Failed to increment promo usage')
      }
      return await response.json()
    } catch (error) {
      console.error('Error incrementing promo usage:', error)
      return { success: false }
    }
  },
}


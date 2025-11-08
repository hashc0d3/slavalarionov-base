const API_URL = '/api/payment'

export interface CreatePaymentRequest {
  amount: number
  purpose: string
  paymentMode?: string[]
  redirectUrl?: string
}

export interface CreatePaymentResponse {
  success: boolean
  data?: {
    Data?: {
      paymentLink?: string
      [key: string]: any
    }
    [key: string]: any
  }
  status?: number
  message?: string
}

export const paymentApi = {
  async createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create payment')
    }

    return response.json()
  }
}


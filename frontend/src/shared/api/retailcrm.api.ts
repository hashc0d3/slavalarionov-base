const API_URL = '/api/retailcrm'

export interface Initials {
  choosen: boolean
  text?: string | null
}

export interface PresentBox {
  choosen: boolean
}

export interface PostCard {
  choosen: boolean
  text?: string | null
}

export interface BuckleButterfly {
  available: boolean
  choosen: boolean
}

export interface Promo {
  code: string
  used: boolean
  discountValue: number
  discountValueFull?: string
}

export interface DeliveryAddressInfo {
  street?: string
  building?: string
  appartament?: string
}

export interface DeliveryPoint {
  name?: string
  address?: string
}

export interface OrderItem {
  strapModel: string
  strapLeatherColor: string
  appleWatchModel: string
  appleWatchModelSize: string
  appleWatchModelColor: string
  stitchingColor: string
  edgeColor: string
  buckleColor: string
  adapterColor: string
  initials: Initials
  presentBox: PresentBox
  postCard: PostCard
  buckleButterfly: BuckleButterfly
  quantity: number
  productsPrice: number
  additionalOptionsPrice: number
}

export interface CreateRetailCrmOrderRequest {
  orderNumber: string
  items: OrderItem[]
  receiverFullname: string
  email: string
  tel: string
  deliveryCity: string
  deliveryType: string
  deliveryPoint?: DeliveryPoint | null
  deliveryAddressInfo?: DeliveryAddressInfo | null
  mailAddress?: string
  curierAddress?: string
  deliveryComment?: string
  deliveryPrice?: number
  promo: Promo
  totalPrice: number
  paymentType?: string
}

export interface CreateRetailCrmOrderResponse {
  success: boolean
  data?: any
  status?: number
  message?: string
}

export const retailCrmApi = {
  async createOrder(request: CreateRetailCrmOrderRequest): Promise<CreateRetailCrmOrderResponse> {
    const response = await fetch(`${API_URL}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create RetailCRM order')
    }

    return response.json()
  }
}


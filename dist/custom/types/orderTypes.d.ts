export interface CreateOrderParams {
    customerCode: string;
    amount: string;
    purpose: string;
    paymentMode: string[];
    redirectUrl: string;
    merchantId: string;
    token: string;
}
export interface CreateOrderResultSuccess {
    success: true;
    data: unknown;
}
export interface CreateOrderResultError {
    success: false;
    status?: number;
    data?: unknown;
    message?: string;
}
export type CreateOrderResult = CreateOrderResultSuccess | CreateOrderResultError;

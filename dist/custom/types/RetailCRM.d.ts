export interface RetailCrmOrderProperty {
    name: string;
    value: string | null;
}
export interface RetailCrmOrderItem {
    productName: string;
    quantity: number;
    initialPrice: number;
    properties: RetailCrmOrderProperty[];
}
export interface RetailCrmOrderDeliveryAddress {
    region?: string;
    city?: string;
    street?: string;
    building?: string;
    housing?: string;
    test?: string;
}
export interface RetailCrmOrderDelivery {
    code: string;
    cost: number | undefined;
    address: RetailCrmOrderDeliveryAddress;
}
export interface RetailCrmOrder {
    number: string;
    firstName: string;
    email: string;
    phone: string;
    promoCode?: string;
    delivery?: RetailCrmOrderDelivery;
    items: RetailCrmOrderItem[];
    summ: number;
}
